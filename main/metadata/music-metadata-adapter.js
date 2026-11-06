// Keep ESM loading in the external Node loader, including in Angular's bundle.
const { loadEsm } = require('load-esm');
exports.updateFile = async (path, patch, rating) => {
    const { updateFile } = await loadEsm('music-metadata');
    if (patch.picture) {
        const { fileTypeFromBuffer } = await loadEsm('file-type');
        const pictures = await Promise.all(
            patch.picture.map(async (picture) => {
                const type = await fileTypeFromBuffer(picture.data);
                if (!type || !type.mime.startsWith('image/')) {
                    throw new Error('Unsupported artwork image');
                }
                return { ...picture, format: type.mime };
            }),
        );
        patch = { ...patch, picture: pictures };
    }
    if (rating !== undefined) {
        const metadata = await parse(path);
        const frames = Object.entries(metadata.native)
            .filter(([key]) => key.startsWith('ID3v2'))
            .flatMap(([, tags]) => tags.filter((tag) => tag.id === 'POPM').map((tag) => tag.value));
        if (/\.(mp3|wav)$/i.test(path)) {
            const preferred = frames.find((frame) => frame.email === owner) || frames[0];
            const values = frames.length ? frames.map((frame) => ({ ...frame })) : [{ email: owner, counter: 0 }];
            const index = preferred ? frames.indexOf(preferred) : 0;
            values[index].rating = RatingConverter.starToPopMRating(rating);
            patch = { ...patch, native: { ...patch.native, POPM: values } };
        } else if (/\.(mp4|m4a)$/i.test(path)) {
            patch = { ...patch, native: { ...patch.native, '----:com.apple.iTunes:DOPAMINE_RATING': String(rating) } };
        } else {
            patch = { ...patch, native: { ...patch.native, 'RATING:dopamine': String(rating / 10) } };
        }
    }
    return updateFile(path, patch);
};

const { RatingConverter } = require('../background-work/indexing/rating-converter');
const owner = 'Windows Media Player 9 Series';
async function parse(path) {
    const { parseFile } = await loadEsm('music-metadata');
    return parseFile(path, { duration: true });
}
const number = (value) => (Number.isFinite(value) ? value : 0);
exports.readMetadata = async (path) => {
    const { common: c, format: f, native } = await parse(path);
    const frames = Object.entries(native)
        .filter(([key]) => key.startsWith('ID3v2'))
        .flatMap(([, tags]) => tags.filter((tag) => tag.id === 'POPM').map((tag) => tag.value));
    const frame = frames.find((frame) => frame.email === owner) || frames[0];
    const customRating = (native.iTunes || []).find((tag) => tag.id === '----:com.apple.iTunes:DOPAMINE_RATING');
    const commonRating = c.rating?.find((value) => value.source === 'dopamine') || c.rating?.[0];
    const rating = frame
        ? RatingConverter.popMToStarRating(frame.rating)
        : customRating
          ? Number(customRating.value)
          : Math.round(number(commonRating?.rating) * 10);
    const picture = c.picture?.find((picture) => picture.type === 'Cover (front)') || c.picture?.[0];
    return {
        path,
        title: c.title || '',
        album: c.album || '',
        artists: c.artists?.length ? c.artists : c.artist ? [c.artist] : [],
        albumArtists: c.albumartists?.length ? c.albumartists : c.albumartist ? [c.albumartist] : [],
        genres: c.genre || [],
        comment: c.comment?.map((value) => value.text).join('\n') || '',
        grouping: c.grouping || '',
        year: number(c.year),
        trackNumber: number(c.track?.no),
        trackCount: number(c.track?.of),
        discNumber: number(c.disk?.no),
        discCount: number(c.disk?.of),
        lyrics: c.lyrics?.map((value) => value.text || value.syncText?.map((line) => line.text).join('\n') || '').join('\n') || '',
        picture: picture ? Buffer.from(picture.data) : undefined,
        composers: c.composer || [],
        conductor: c.conductor?.join('; ') || '',
        beatsPerMinute: number(c.bpm),
        rating: Math.max(0, Math.min(10, number(rating))),
        bitRate: number(f.bitrate) / 1000,
        sampleRate: number(f.sampleRate),
        durationInMilliseconds: number(f.duration) * 1000,
        replayGainTrackGain: number(c.replaygain_track_gain?.dB),
        replayGainTrackPeak: number(c.replaygain_track_peak?.ratio),
        replayGainAlbumGain: number(c.replaygain_album_gain?.dB),
        replayGainAlbumPeak: number(c.replaygain_album_peak?.ratio),
    };
};
