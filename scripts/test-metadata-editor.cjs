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
    for (let offset = 12; offset + 8 <= data.length; ) {
        const size = data.readUInt32LE(offset + 4);
        if (data.toString('ascii', offset, offset + 4) === 'data') {
            return data.subarray(offset + 8, offset + 8 + size);
        }
        offset += 8 + size + (size % 2);
    }
    throw new Error('Missing WAV audio');
}

async function fixture(t, data = wav()) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dopamine-metadata-editor-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const file = path.join(directory, 'track.WAV');
    await fs.writeFile(file, data);
    return file;
}

test('published editor round-trips tags, artwork and all UI ratings without changing audio', async (t) => {
    const file = await fixture(t);
    const original = await fs.readFile(file);
    const picture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=', 'base64');
    await updateFile(file, {
        title: '中文 integration',
        artists: ['One', 'Two'],
        album: 'Integration album',
        albumartists: ['Album One', 'Album Two'],
        year: 2026,
        genre: ['Jazz'],
        track: { no: 3, of: 8 },
        disk: { no: 2, of: 4 },
        comment: 'Integration comment',
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
    const editor = await import('music-metadata-editor');
    const frames = [
        { email: 'another-player', rating: 64, counter: 7 },
        { email: 'Windows Media Player 9 Series', rating: 128, counter: 42 },
    ];
    await editor.updateFile(file, {
        lyrics: 'Existing lyrics',
        replaygain_track_gain: '-6.20 dB',
        replaygain_track_peak: '0.988',
        native: { POPM: frames },
    });
    await updateFile(file, { title: 'New title' });
    assert.equal((await readMetadata(file)).rating, 6);
    await updateFile(file, { album: 'New album' }, 7);
    const metadata = await readMetadata(file);
    assert.equal(metadata.lyrics, 'Existing lyrics');
    assert.equal(metadata.replayGainTrackGain, -6.2);
    assert.equal(metadata.replayGainTrackPeak, 0.988);
    assert.equal(metadata.rating, 7);
    const tags = await editor.readTags(file);
    assert.deepEqual(
        tags.native['ID3v2.4'].filter((tag) => tag.id === 'POPM').map((tag) => tag.value),
        [frames[0], { ...frames[1], rating: 186 }],
    );
});

test('legacy ID3 fails without destructive replacement', async (t) => {
    const original = wav([chunk('id3 ', Buffer.from([73, 68, 51, 3, 0, 0, 0, 0, 0, 0]))]);
    const file = await fixture(t, original);
    await assert.rejects(updateFile(file, { title: 'Not written' }), /ID3|replaceId3/i);
    assert.deepEqual(await fs.readFile(file), original);
});

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

test('metadata integration uses published npm dependencies without local package links', () => {
    const manifest = require('../package.json');
    const lock = require('../package-lock.json');
    assert.equal(manifest.dependencies['music-metadata-editor'], '0.3.0');
    assert.equal(manifest.dependencies['load-esm'], '1.0.3');
    assert.equal(manifest.dependencies['dopamine-metadata-editor'], undefined);
    assert.equal(lock.packages['metadata-editor'], undefined);
    assert.equal(lock.packages['node_modules/dopamine-metadata-editor'], undefined);
    const editor = lock.packages['node_modules/music-metadata-editor'];
    assert.equal(editor.version, '0.3.0');
    assert.equal(editor.resolved, 'https://registry.npmjs.org/music-metadata-editor/-/music-metadata-editor-0.3.0.tgz');
    assert.ok(editor.integrity);
    for (const [name, dependency] of Object.entries(manifest.dependencies)) {
        assert.equal(dependency.startsWith('file:'), false, name);
    }
});
