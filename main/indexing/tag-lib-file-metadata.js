const { File } = require('node-taglib-sharp');

class TagLibFileMetadata {
    constructor(path) {
        this.#load(path);
    }

    #load(path) {
        const metadata = {
            path: path,
            bitRate: 0,
            sampleRate: 0,
            durationInMilliseconds: 0,
            title: '',
            album: '',
            albumArtists: [],
            artists: [],
            genres: [],
            comment: '',
            grouping: '',
            year: 0,
            trackNumber: 0,
            trackCount: 0,
            discNumber: 0,
            discCount: 0,
            lyrics: '',
            picture: undefined,
            rating: 0,
        };

        const tagLibFile = File.createFromPath(path);

        if (tagLibFile.tag !== undefined) {
            if (tagLibFile.tag.performers !== undefined) {
                metadata.artists = tagLibFile.tag.performers ?? [];
            }

            if (tagLibFile.tag.title !== undefined) {
                metadata.title = tagLibFile.tag.title ?? '';
            }

            if (tagLibFile.tag.album !== undefined) {
                metadata.album = tagLibFile.tag.album ?? '';
            }

            if (tagLibFile.tag.albumArtists !== undefined) {
                metadata.albumArtists = tagLibFile.tag.albumArtists ?? [];
            }

            if (tagLibFile.tag.genres !== undefined) {
                metadata.genres = tagLibFile.tag.genres ?? [];
            }

            if (tagLibFile.tag.year !== undefined && !Number.isNaN(tagLibFile.tag.year)) {
                metadata.year = tagLibFile.tag.year ?? 0;
            }

            if (tagLibFile.tag.comment !== undefined) {
                metadata.comment = tagLibFile.tag.comment ?? '';
            }

            if (tagLibFile.tag.grouping !== undefined) {
                metadata.grouping = tagLibFile.tag.grouping ?? '';
            }

            if (tagLibFile.tag.track !== undefined && !Number.isNaN(tagLibFile.tag.track)) {
                metadata.trackNumber = tagLibFile.tag.track ?? 0;
            }

            if (tagLibFile.tag.trackCount !== undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                metadata.trackCount = tagLibFile.tag.trackCount ?? 0;
            }

            if (tagLibFile.tag.disc !== undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                metadata.discNumber = tagLibFile.tag.disc ?? 0;
            }

            if (tagLibFile.tag.discCount !== undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                metadata.discCount = tagLibFile.tag.discCount ?? 0;
            }

            if (tagLibFile.tag.lyrics !== undefined) {
                metadata.lyrics = tagLibFile.tag.lyrics ?? '';
            }

            if (tagLibFile.tag.pictures !== undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture = false;

                for (const picture of tagLibFile.tag.pictures) {
                    if (!couldGetPicture) {
                        try {
                            metadata.picture = Buffer.from(picture.data.toBase64String(), 'base64');
                            couldGetPicture = true;
                        } catch (error) {
                            // Intended suppression
                        }
                    }
                }
            }
        }

        if (tagLibFile.properties !== undefined) {
            if (tagLibFile.properties.durationMilliseconds !== undefined && !Number.isNaN(tagLibFile.properties.durationMilliseconds)) {
                metadata.durationInMilliseconds = tagLibFile.properties.durationMilliseconds ?? 0;
            }

            if (tagLibFile.properties.audioBitrate !== undefined && !Number.isNaN(tagLibFile.properties.audioBitrate)) {
                metadata.bitRate = tagLibFile.properties.audioBitrate ?? 0;
            }

            if (tagLibFile.properties.audioSampleRate !== undefined && !Number.isNaN(tagLibFile.properties.audioSampleRate)) {
                metadata.sampleRate = tagLibFile.properties.audioSampleRate ?? 0;
            }
        }

        return metadata;
    }
}

exports.TagLibFileMetadata = TagLibFileMetadata;
