const { File, PictureType, TagTypes, Id3v2FrameClassType } = require('@digimezzo/node-taglib-sharp');
const { RatingConverter } = require('./rating-converter');

class TagLibFileMetadata {
    #windowsPopMUser = 'Windows Media Player 9 Series';

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
        this.composers = [];
        this.conductor = '';
        this.beatsPerMinute = 0;

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
                if (this.path.toLowerCase().endsWith('.wav')) {
                    // .wav files have limited tagging capabilities. RIFF INFO tags are used to store metadata in .wav files.
                    // There seems to be no dedicated tag for album artists in the RIFF INFO tags. Artist is stored in the 'IART' tag.
                    // node-taglib-sharp reads the album artist from the RIFF 'IART' tag, but adds a null character at the end of the string.
                    // That is why we remove all null characters from all strings in the array here.
                    this.albumArtists = (tagLibFile.tag.albumArtists ?? []).map((a) => a.replace(/\u0000/g, ''));
                } else {
                    this.albumArtists = tagLibFile.tag.albumArtists ?? [];
                }
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

            if (tagLibFile.tag.composers !== undefined) {
                this.composers = tagLibFile.tag.composers ?? [];
            }

            if (tagLibFile.tag.conductor !== undefined) {
                this.conductor = tagLibFile.tag.conductor ?? '';
            }

            if (tagLibFile.tag.beatsPerMinute !== undefined && !Number.isNaN(tagLibFile.tag.beatsPerMinute)) {
                this.beatsPerMinute = tagLibFile.tag.beatsPerMinute ?? 0;
            }

            if (tagLibFile.tag.pictures !== undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture = false;

                for (const picture of tagLibFile.tag.pictures.filter((x) => x.type !== PictureType.NotAPicture)) {
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

        try {
            this.rating = this.#readRatingFromFile(tagLibFile) ?? 0;
        } catch (error) {
            // Intended suppression
        }
    }

    #readRatingFromFile(tagLibFile) {
        const id3v2Tag = tagLibFile.getTag(TagTypes.Id3v2, true);
        const allPopularimeterFrames = id3v2Tag.getFramesByClassType(Id3v2FrameClassType.PopularimeterFrame);

        if (allPopularimeterFrames.length === 0) {
            return 0;
        }

        const popularimeterFramesForWindowsUser = allPopularimeterFrames.filter((x) => x.user === this.#windowsPopMUser);

        if (popularimeterFramesForWindowsUser.length > 0) {
            return RatingConverter.popMToStarRating(popularimeterFramesForWindowsUser[0].rating);
        }

        return RatingConverter.popMToStarRating(allPopularimeterFrames[0].rating);
    }
}

exports.TagLibFileMetadata = TagLibFileMetadata;
