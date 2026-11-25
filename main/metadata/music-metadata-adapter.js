// Keep ESM loading in the external Node loader, including in Angular's bundle.
const { loadEsm } = require('load-esm');
exports.updateFile = async (path, patch, rating) => {
    const { MediaFile, updateFile } = await loadEsm('music-metadata');
    const id3 = /\.(mp3|wav)$/i.test(path);
    const file = id3 ? await MediaFile.open(path) : undefined;
    const legacy = file?.metadata.format.tagTypes.some((type) => ['ID3v2.2', 'ID3v2.3'].includes(type));
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
        if (file) {
            const ratings = file.metadata.common.rating ?? [];
            const preferred = ratings.find((entry) => entry.source === owner) || ratings[0];
            const score = RatingConverter.starToPopMRating(rating);
            const value = score === 0 ? undefined : (score - 1) / 254;
            if (preferred) {
                preferred.rating = value;
            } else {
                ratings.push({ source: owner, rating: value });
            }
            patch = { ...patch, rating: ratings };
        } else if (/\.(mp4|m4a)$/i.test(path)) {
            patch = { ...patch, native: { ...patch.native, '----:com.apple.iTunes:DOPAMINE_RATING': String(rating) } };
        } else {
            patch = { ...patch, native: { ...patch.native, 'RATING:dopamine': String(rating / 10) } };
        }
    }
    // Replacement needs the full parsed common tags. Ordinary edits can patch just the changed fields.
    if (legacy) {
        Object.assign(file.metadata.common, patch);
        return file.save({ replaceId3: true });
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
        albumArtists: c.albumArtists?.length ? c.albumArtists : c.albumArtist ? [c.albumArtist] : [],
        genres: c.genres || [],
        comment: c.comments?.map((value) => value.text).join('\n') || '',
        grouping: c.grouping || '',
        year: number(c.year),
        trackNumber: number(c.trackNumber),
        trackCount: number(c.trackTotal),
        discNumber: number(c.discNumber),
        discCount: number(c.discTotal),
        lyrics: c.lyrics?.map((value) => value.text || value.syncText?.map((line) => line.text).join('\n') || '').join('\n') || '',
        picture: picture ? Buffer.from(picture.data) : undefined,
        composers: c.composers || [],
        conductor: c.conductors?.join('; ') || '',
        beatsPerMinute: number(c.bpm),
        rating: Math.max(0, Math.min(10, number(rating))),
        bitRate: number(f.bitrate) / 1000,
        sampleRate: number(f.sampleRate),
        durationInMilliseconds: number(f.duration) * 1000,
        replayGainTrackGain: number(c.replayGainTrackGain?.dB),
        replayGainTrackPeak: number(c.replayGainTrackPeak?.ratio),
        replayGainAlbumGain: number(c.replayGainAlbumGain?.dB),
        replayGainAlbumPeak: number(c.replayGainAlbumPeak?.ratio),
    };
};
