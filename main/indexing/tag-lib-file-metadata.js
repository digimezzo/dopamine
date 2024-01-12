const { File } = require('node-taglib-sharp');

class TagLibFileMetadata {
    constructor(path) {
        this.path = path;
        this.bitRate = 0;
        this.sampleRate = 0;
        this.durationInMilliseconds = 0;
        this.title = '';
        this.album = '';
        this.albumArtists = [];
        this.artists = [];
        this.genres = [];
        this.comment = '';
        this.grouping = '';
        this.year = 0;
        this.trackNumber = 0;
        this.trackCount = 0;
        this.discNumber = 0;
        this.discCount = 0;
        this.lyrics = '';
        this.picture = undefined;
        this.rating = 0;

        this.#load();
    }

    #load() {
        const tagLibFile = File.createFromPath(this.path);

        if (tagLibFile.tag !== undefined) {
            if (tagLibFile.tag.performers !== undefined) {
                this.artists = tagLibFile.tag.performers ?? [];
            }

            if (tagLibFile.tag.title !== undefined) {
                this.title = tagLibFile.tag.title ?? '';
            }

            if (tagLibFile.tag.album !== undefined) {
                this.album = tagLibFile.tag.album ?? '';
            }

            if (tagLibFile.tag.albumArtists !== undefined) {
                this.albumArtists = tagLibFile.tag.albumArtists ?? [];
            }

            if (tagLibFile.tag.genres !== undefined) {
                this.genres = tagLibFile.tag.genres ?? [];
            }

            if (tagLibFile.tag.year !== undefined && !Number.isNaN(tagLibFile.tag.year)) {
                this.year = tagLibFile.tag.year ?? 0;
            }

            if (tagLibFile.tag.comment !== undefined) {
                this.comment = tagLibFile.tag.comment ?? '';
            }

            if (tagLibFile.tag.grouping !== undefined) {
                this.grouping = tagLibFile.tag.grouping ?? '';
            }

            if (tagLibFile.tag.track !== undefined && !Number.isNaN(tagLibFile.tag.track)) {
                this.trackNumber = tagLibFile.tag.track ?? 0;
            }

            if (tagLibFile.tag.trackCount !== undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                this.trackCount = tagLibFile.tag.trackCount ?? 0;
            }

            if (tagLibFile.tag.disc !== undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                this.discNumber = tagLibFile.tag.disc ?? 0;
            }

            if (tagLibFile.tag.discCount !== undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                this.discCount = tagLibFile.tag.discCount ?? 0;
            }

            if (tagLibFile.tag.lyrics !== undefined) {
                this.lyrics = tagLibFile.tag.lyrics ?? '';
            }

            if (tagLibFile.tag.pictures !== undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture = false;

                for (const picture of tagLibFile.tag.pictures) {
                    if (!couldGetPicture) {
                        try {
                            this.picture = Buffer.from(picture.data.toBase64String(), 'base64');
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
                this.durationInMilliseconds = tagLibFile.properties.durationMilliseconds ?? 0;
            }

            if (tagLibFile.properties.audioBitrate !== undefined && !Number.isNaN(tagLibFile.properties.audioBitrate)) {
                this.bitRate = tagLibFile.properties.audioBitrate ?? 0;
            }

            if (tagLibFile.properties.audioSampleRate !== undefined && !Number.isNaN(tagLibFile.properties.audioSampleRate)) {
                this.sampleRate = tagLibFile.properties.audioSampleRate ?? 0;
            }
        }
    }
}

exports.TagLibFileMetadata = TagLibFileMetadata;
