const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { readMetadata, updateFile } = require('../main/metadata/music-metadata-adapter');
const { FileMetadataFactory } = require('../main/background-work/indexing/file-metadata.factory');

function chunk(id, data) {
    const header = Buffer.alloc(8);
    header.write(id);
    header.writeUInt32LE(data.length, 4);
    return Buffer.concat([header, data, Buffer.alloc(data.length % 2)]);
}

function wav(extra = []) {
    const format = Buffer.alloc(16);
    format.writeUInt16LE(1, 0); // PCM
    format.writeUInt16LE(1, 2); // mono
    format.writeUInt32LE(8000, 4);
    format.writeUInt32LE(16000, 8);
    format.writeUInt16LE(2, 12);
    format.writeUInt16LE(16, 14);
    const body = Buffer.concat([Buffer.from('WAVE'), chunk('fmt ', format), ...extra, chunk('data', Buffer.alloc(16000, 42))]);
    const header = Buffer.alloc(8);
    header.write('RIFF');
    header.writeUInt32LE(body.length, 4);
    return Buffer.concat([header, body]);
}

function audio(data) {
    for (let offset = 12; offset + 8 <= data.length;) {
        const size = data.readUInt32LE(offset + 4);
        if (data.toString('ascii', offset, offset + 4) === 'data') {
            return data.subarray(offset + 8, offset + 8 + size);
        }
        offset += 8 + size + (size % 2);
    }
    throw new Error('Missing WAV audio');
}

async function fixture(t, data = wav(), name = 'track.WAV') {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dopamine-metadata-editor-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const file = path.join(directory, name);
    await fs.writeFile(file, data);
    return file;
}

test('editor round-trips tags, artwork and all UI ratings without changing audio', async (t) => {
    const file = await fixture(t);
    const original = await fs.readFile(file);
    const picture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=', 'base64');
    await updateFile(file, {
        title: '中文 integration',
        artists: ['One', 'Two'],
        album: 'Integration album',
        albumArtists: ['Album One', 'Album Two'],
        year: 2026,
        genres: ['Jazz'],
        trackNumber: 3,
        trackTotal: 8,
        discNumber: 2,
        discTotal: 4,
        comments: 'Integration comment',
        composers: ['Composer One', 'Composer Two'],
        conductors: 'Conductor',
        bpm: 120,
        picture: [{ data: picture, type: 'Cover (front)' }],
    });
    const metadata = await readMetadata(file);
    assert.equal(metadata.title, '中文 integration');
    assert.deepEqual(metadata.artists, ['One', 'Two']);
    assert.equal(metadata.album, 'Integration album');
    assert.deepEqual(metadata.albumArtists, ['Album One', 'Album Two']);
    assert.equal(metadata.year, 2026);
    assert.deepEqual(metadata.genres, ['Jazz']);
    assert.equal(metadata.trackNumber, 3);
    assert.equal(metadata.trackCount, 8);
    assert.equal(metadata.discNumber, 2);
    assert.equal(metadata.discCount, 4);
    assert.equal(metadata.comment, 'Integration comment');
    assert.deepEqual(metadata.composers, ['Composer One', 'Composer Two']);
    assert.equal(metadata.conductor, 'Conductor');
    assert.equal(metadata.beatsPerMinute, 120);
    assert.deepEqual(metadata.picture, picture);
    assert.equal(metadata.durationInMilliseconds, 1000);
    assert.equal(metadata.sampleRate, 8000);
    assert.equal(metadata.bitRate, 128);
    assert.deepEqual(await new FileMetadataFactory().create(file), metadata);
    for (let rating = 0; rating <= 10; rating++) {
        await updateFile(file, {}, rating);
        assert.equal((await readMetadata(file)).rating, rating);
    }
    await updateFile(file, { title: null, picture: null });
    const cleared = await readMetadata(file);
    assert.equal(cleared.title, '');
    assert.equal(cleared.picture, undefined);
    assert.equal(cleared.rating, 10);
    assert.deepEqual(audio(await fs.readFile(file)), audio(original));
});

test('unrelated writes preserve lyrics, ReplayGain and POPM owners/counters', async (t) => {
    const file = await fixture(t);
    const editor = await import('music-metadata');
    const frames = [
        { email: 'another-player', rating: 64, counter: 7 },
        { email: 'Windows Media Player 9 Series', rating: 128, counter: 42 },
    ];
    await editor.updateFile(file, {
        lyrics: 'Existing lyrics',
        replayGainTrackGain: '-6.20 dB',
        replayGainTrackPeak: '0.988',
        replayGainAlbumGain: '-4.50 dB',
        replayGainAlbumPeak: '0.999',
        native: { POPM: frames },
    });
    await updateFile(file, { title: 'New title' });
    assert.equal((await readMetadata(file)).rating, 6);
    await updateFile(file, { album: 'New album' }, 7);
    const metadata = await readMetadata(file);
    assert.equal(metadata.lyrics, 'Existing lyrics');
    assert.equal(metadata.replayGainTrackGain, -6.2);
    assert.equal(metadata.replayGainTrackPeak, 0.988);
    assert.equal(metadata.replayGainAlbumGain, -4.5);
    assert.equal(metadata.replayGainAlbumPeak, 0.999);
    assert.equal(metadata.rating, 7);
    const tags = await editor.parseFile(file);
    const id3v2Tags = Object.entries(tags.native)
        .filter(([key]) => key.startsWith('ID3v2'))
        .flatMap(([, tags]) => tags.filter((tag) => tag.id === 'POPM').map((tag) => tag.value));
    assert.deepEqual(id3v2Tags, [frames[0], { ...frames[1], rating: 186 }]);

    await updateFile(file, {}, 0);
    const cleared = await editor.parseFile(file);
    assert.deepEqual(
        cleared.native['ID3v2.4'].filter((tag) => tag.id === 'POPM').map((tag) => tag.value),
        [frames[0], { ...frames[1], rating: 0 }],
    );
    assert.equal((await readMetadata(file)).rating, 0);
});

test('legacy ID3 upgrades to v2.4 while preserving audio', async (t) => {
    const tag = Buffer.from('ID3\x03\0\0\0\0\0\x0eTALB\0\0\0\x04\0\0\0Old', 'latin1');
    const frame = Buffer.alloc(417);
    Buffer.from([0xff, 0xfb, 0x90, 0]).copy(frame);
    const payload = Buffer.concat([frame, frame, frame]);
    const file = await fixture(t, Buffer.concat([tag, payload]), 'track.mp3');
    await updateFile(file, { title: 'Edited' });
    const tags = await (await import('music-metadata')).parseFile(file);
    assert.ok(tags.format.tagTypes.includes('ID3v2.4'));
    assert.equal(tags.common.title, 'Edited');
    assert.equal(tags.common.album, 'Old');
    assert.deepEqual((await fs.readFile(file)).subarray(-payload.length), payload);
});

require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const { MusicFileMetadata } = require('../src/app/common/metadata/music-file-metadata');

test('foreground edits preserve display-only credits and update artist lists and credits together', async (t) => {
    const file = await fixture(t);
    const editor = await import('music-metadata');
    await editor.updateFile(file, { artist: 'One feat. Two', albumArtist: 'Album One & Album Two' });
    const before = (await editor.parseFile(file)).common;
    assert.equal(before.artists, undefined);
    assert.equal(before.albumArtists, undefined);

    const foreground = new MusicFileMetadata(file);
    await foreground.loadAsync();
    assert.deepEqual(foreground.artists, ['One feat. Two']);
    assert.deepEqual(foreground.albumArtists, ['Album One & Album Two']);
    foreground.title = 'Changed title';
    await foreground.save();
    const preserved = (await editor.parseFile(file)).common;
    assert.equal(preserved.artist, before.artist);
    assert.equal(preserved.albumArtist, before.albumArtist);
    assert.equal(preserved.artists, undefined);
    assert.equal(preserved.albumArtists, undefined);

    foreground.artists = ['Three', 'Four'];
    foreground.albumArtists = ['Album Three', 'Album Four'];
    await foreground.save();
    const edited = (await editor.parseFile(file)).common;
    assert.equal(edited.artist, 'Three; Four');
    assert.deepEqual(edited.artists, foreground.artists);
    assert.equal(edited.albumArtist, 'Album Three; Album Four');
    assert.deepEqual(edited.albumArtists, foreground.albumArtists);

    foreground.artists = [];
    foreground.albumArtists = [];
    await foreground.save();
    const cleared = await readMetadata(file);
    assert.deepEqual(cleared.artists, []);
    assert.deepEqual(cleared.albumArtists, []);
});

test('foreground edits round-trip and clear the v13 common fields', async (t) => {
    const file = await fixture(t);
    const foreground = new MusicFileMetadata(file);
    await foreground.loadAsync();
    Object.assign(foreground, {
        albumArtists: ['Album artist'],
        genres: ['Jazz'],
        trackNumber: 3,
        trackCount: 8,
        discNumber: 2,
        discCount: 4,
        comment: 'Comment',
        composers: ['Composer'],
        conductor: 'Conductor',
        beatsPerMinute: 120,
    });
    await foreground.save();
    const metadata = await readMetadata(file);
    for (const key of [
        'albumArtists',
        'genres',
        'trackNumber',
        'trackCount',
        'discNumber',
        'discCount',
        'comment',
        'composers',
        'conductor',
        'beatsPerMinute',
    ]) {
        assert.deepEqual(metadata[key], foreground[key], key);
    }

    foreground.trackNumber = 0;
    foreground.discNumber = 0;
    await foreground.save();
    const partial = await readMetadata(file);
    assert.equal(partial.trackNumber, 0);
    assert.equal(partial.trackCount, 8);
    assert.equal(partial.discNumber, 0);
    assert.equal(partial.discCount, 4);

    foreground.trackCount = 0;
    foreground.discCount = 0;
    foreground.genres = [];
    foreground.comment = '';
    foreground.composers = [];
    foreground.conductor = '';
    foreground.beatsPerMinute = 0;
    await foreground.save();
    const cleared = await readMetadata(file);
    for (const key of [
        'trackNumber',
        'trackCount',
        'discNumber',
        'discCount',
        'genres',
        'comment',
        'composers',
        'conductor',
        'beatsPerMinute',
    ]) {
        assert.deepEqual(cleared[key], foreground[key], key);
    }
});

for (const version of [3, 4]) {
    test(`foreground rating edit preserves all artwork and comments from ID3v2.${version}`, async (t) => {
        const editor = await import('music-metadata');
        function id3Frame(id, data) {
            const header = Buffer.alloc(10);
            header.write(id);
            // All fixture frames are shorter than 128 bytes (same size encoding in v2.3 and v2.4).
            header.writeUInt32BE(data.length, 4);
            return Buffer.concat([header, data]);
        }
        const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=', 'base64');
        const body = Buffer.concat([
            id3Frame('APIC', Buffer.concat([Buffer.from('\0image/png\0\x03Front\0', 'latin1'), png])),
            id3Frame('APIC', Buffer.concat([Buffer.from('\0image/png\0\x04Back\0', 'latin1'), png])),
            id3Frame('COMM', Buffer.from('\0engReview\0First comment')),
            id3Frame('COMM', Buffer.from('\0nldNotes\0Second comment')),
        ]);
        const header = Buffer.from([73, 68, 51, version, 0, 0, 0, 0, body.length >> 7, body.length & 127]);
        const frame = Buffer.alloc(417);
        frame.set([0xff, 0xfb, 0x90, 0]);
        const audio = Buffer.concat([frame, frame, frame]);
        const file = await fixture(t, Buffer.concat([header, body, audio]), 'track.mp3');
        const before = (await editor.parseFile(file)).common;
        assert.equal(before.picture.length, 2);
        assert.equal(before.comments.length, 2);

        const foreground = new MusicFileMetadata(file);
        await foreground.loadAsync();
        foreground.rating = 7;
        await foreground.save();
        const after = await editor.parseFile(file);
        assert.ok(after.format.tagTypes.includes('ID3v2.4'));
        assert.deepEqual(after.common.picture, before.picture);
        assert.deepEqual(after.common.comments, before.comments);
        assert.equal((await readMetadata(file)).rating, 7);
        assert.deepEqual((await fs.readFile(file)).subarray(-audio.length), audio);

        foreground.picture = undefined;
        foreground.comment = '';
        await foreground.save();
        const cleared = (await editor.parseFile(file)).common;
        assert.equal(cleared.picture, undefined);
        assert.equal(cleared.comments, undefined);
    });
}

test('invalid artwork fails before changing the file', async (t) => {
    const file = await fixture(t);
    const original = await fs.readFile(file);
    await assert.rejects(updateFile(file, { picture: [{ data: Buffer.alloc(32), type: 'Cover (front)' }] }), /Unsupported artwork image/);
    assert.deepEqual(await fs.readFile(file), original);
});

test('Angular webpack externals keep load-esm in Node and the bundled adapter can edit files', async (t) => {
    const webpack = require('webpack');
    const Module = require('node:module');
    const file = await fixture(t);
    const directory = path.dirname(file);
    const compiler = webpack({
        mode: 'production',
        target: 'web',
        entry: path.resolve(__dirname, '../main/metadata/music-metadata-adapter.js'),
        externals: require('../angular.webpack.js').externals,
        output: { path: directory, filename: 'adapter.cjs', library: { type: 'commonjs2' } },
    });
    t.after(() => new Promise((resolve, reject) => compiler.close((error) => (error ? reject(error) : resolve()))));
    const stats = await new Promise((resolve, reject) => compiler.run((error, stats) => (error ? reject(error) : resolve(stats))));
    assert.equal(stats.hasErrors(), false, stats.toString({ all: false, errors: true }));
    const source = await fs.readFile(path.join(directory, 'adapter.cjs'), 'utf8');
    assert.match(source, /require\(["']load-esm["']\)/);
    const bundled = new Module(path.join(directory, 'adapter.cjs'), module);
    bundled.filename = path.join(directory, 'adapter.cjs');
    bundled.paths = module.paths;
    bundled._compile(source, bundled.filename);
    await bundled.exports.updateFile(file, { title: 'Bundled 中文 title' }, 9);
    const metadata = await bundled.exports.readMetadata(file);
    assert.equal(metadata.title, 'Bundled 中文 title');
    assert.equal(metadata.rating, 9);
    assert.equal(metadata.durationInMilliseconds, 1000);
});
