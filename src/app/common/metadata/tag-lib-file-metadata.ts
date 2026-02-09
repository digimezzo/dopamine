import {
    ByteVector,
    File,
    Id3v2FrameClassType,
    Id3v2FrameIdentifiers,
    Id3v2PopularimeterFrame,
    Id3v2Tag,
    PictureType,
    TagTypes,
} from '@digimezzo/node-taglib-sharp';
import { IFileMetadata } from './i-file-metadata';
import { RatingConverter } from './rating-converter';

export class TagLibFileMetadata implements IFileMetadata {
    private _rating: number = 0;
    private ratingHasChanged: boolean = false;

    private windowsPopMUser: string = 'Windows Media Player 9 Series';

    public constructor(public path: string) {}

    public bitRate: number = 0;
    public sampleRate: number = 0;
    public durationInMilliseconds: number = 0;
    public title: string = '';
    public album: string = '';
    public albumArtists: string[] = [];
    public artists: string[] = [];
    public genres: string[] = [];
    public comment: string = '';
    public grouping: string = '';
    public year: number = 0;
    public trackNumber: number = 0;
    public trackCount: number = 0;
    public discNumber: number = 0;
    public discCount: number = 0;
    public lyrics: string = '';
    public picture: Buffer | undefined;
    public composers: string[] = [];
    public conductor: string = '';
    public beatsPerMinute: number = 0;

    public get rating(): number {
        return this._rating;
    }
    public set rating(v: number) {
        this._rating = v;
        this.ratingHasChanged = true;
    }

    public save(): void {
        const tagLibFile = File.createFromPath(this.path);

        if (this.ratingHasChanged) {
            this.writeRatingToFile(tagLibFile, this.rating);
            this.ratingHasChanged = false;
        }

        tagLibFile.tag.title = this.title;
        tagLibFile.tag.performers = this.artists;
        tagLibFile.tag.album = this.album;
        tagLibFile.tag.albumArtists = this.albumArtists;
        tagLibFile.tag.year = this.year;
        tagLibFile.tag.genres = this.genres;
        tagLibFile.tag.track = this.trackNumber;
        tagLibFile.tag.trackCount = this.trackCount;
        tagLibFile.tag.disc = this.discNumber;
        tagLibFile.tag.discCount = this.discCount;
        tagLibFile.tag.grouping = this.grouping;
        tagLibFile.tag.comment = this.comment;
        tagLibFile.tag.composers = this.composers;
        tagLibFile.tag.conductor = this.conductor;
        tagLibFile.tag.beatsPerMinute = this.beatsPerMinute;

        if (this.picture) {
            const picture = {
                data: ByteVector.fromByteArray(this.picture),
                mimeType: 'image/png',
                type: PictureType.FrontCover,
                filename: '', // Not required
                description: '', // Not required
            };

            tagLibFile.tag.pictures = [picture];
        } else {
            tagLibFile.tag.pictures = [];
        }

        // tagLibFile.tag.lyrics = this.lyrics;

        tagLibFile.save();
        tagLibFile.dispose();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async loadAsync(): Promise<void> {
        const tagLibFile = File.createFromPath(this.path);

        if (tagLibFile.tag != undefined) {
            if (tagLibFile.tag.performers != undefined) {
                this.artists = tagLibFile.tag.performers ?? [];
            }

            if (tagLibFile.tag.title != undefined) {
                this.title = tagLibFile.tag.title ?? '';
            }

            if (tagLibFile.tag.album != undefined) {
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

            if (tagLibFile.tag.genres != undefined) {
                this.genres = tagLibFile.tag.genres ?? [];
            }

            if (tagLibFile.tag.year != undefined && !Number.isNaN(tagLibFile.tag.year)) {
                this.year = tagLibFile.tag.year ?? 0;
            }

            if (tagLibFile.tag.comment != undefined) {
                this.comment = tagLibFile.tag.comment ?? '';
            }

            if (tagLibFile.tag.grouping != undefined) {
                this.grouping = tagLibFile.tag.grouping ?? '';
            }

            if (tagLibFile.tag.track != undefined && !Number.isNaN(tagLibFile.tag.track)) {
                this.trackNumber = tagLibFile.tag.track ?? 0;
            }

            if (tagLibFile.tag.trackCount != undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                this.trackCount = tagLibFile.tag.trackCount ?? 0;
            }

            if (tagLibFile.tag.disc != undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                this.discNumber = tagLibFile.tag.disc ?? 0;
            }

            if (tagLibFile.tag.discCount != undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                this.discCount = tagLibFile.tag.discCount ?? 0;
            }

            if (tagLibFile.tag.lyrics != undefined) {
                this.lyrics = tagLibFile.tag.lyrics ?? '';
            }

            if (tagLibFile.tag.composers != undefined) {
                this.composers = tagLibFile.tag.composers ?? [];
            }

            if (tagLibFile.tag.conductor != undefined) {
                this.conductor = tagLibFile.tag.conductor ?? '';
            }

            if (tagLibFile.tag.beatsPerMinute != undefined && !Number.isNaN(tagLibFile.tag.beatsPerMinute)) {
                this.beatsPerMinute = tagLibFile.tag.beatsPerMinute ?? 0;
            }

            if (tagLibFile.tag.pictures != undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture: boolean = false;

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

        if (tagLibFile.properties != undefined) {
            if (tagLibFile.properties.durationMilliseconds != undefined && !Number.isNaN(tagLibFile.properties.durationMilliseconds)) {
                this.durationInMilliseconds = tagLibFile.properties.durationMilliseconds ?? 0;
            }

            if (tagLibFile.properties.audioBitrate != undefined && !Number.isNaN(tagLibFile.properties.audioBitrate)) {
                this.bitRate = tagLibFile.properties.audioBitrate ?? 0;
            }

            if (tagLibFile.properties.audioSampleRate != undefined && !Number.isNaN(tagLibFile.properties.audioSampleRate)) {
                this.sampleRate = tagLibFile.properties.audioSampleRate ?? 0;
            }
        }

        try {
            this._rating = this.readRatingFromFile(tagLibFile) ?? 0;
        } catch (error) {
            // Intended suppression
        }

        tagLibFile.dispose();
    }

    private readRatingFromFile(tagLibFile: File): number {
        const id3v2Tag: Id3v2Tag = <Id3v2Tag>tagLibFile.getTag(TagTypes.Id3v2, true);
        const allPopularimeterFrames: Id3v2PopularimeterFrame[] = id3v2Tag.getFramesByClassType<Id3v2PopularimeterFrame>(
            Id3v2FrameClassType.PopularimeterFrame,
        );

        if (allPopularimeterFrames.length === 0) {
            return 0;
        }

        const popularimeterFramesForWindowsUser: Id3v2PopularimeterFrame[] = allPopularimeterFrames.filter(
            (x) => x.user === this.windowsPopMUser,
        );

        if (popularimeterFramesForWindowsUser.length > 0) {
            return RatingConverter.popMToStarRating(popularimeterFramesForWindowsUser[0].rating);
        }

        return RatingConverter.popMToStarRating(allPopularimeterFrames[0].rating);
    }

    private writeRatingToFile(tagLibFile: File, rating: number): void {
        const id3v2Tag: Id3v2Tag = <Id3v2Tag>tagLibFile.getTag(TagTypes.Id3v2, true);
        let allPopularimeterFrames: Id3v2PopularimeterFrame[] = id3v2Tag.getFramesByClassType<Id3v2PopularimeterFrame>(
            Id3v2FrameClassType.PopularimeterFrame,
        );

        if (allPopularimeterFrames.length === 0) {
            id3v2Tag.removeFrames(Id3v2FrameIdentifiers.POPM);
            id3v2Tag.addFrame(Id3v2PopularimeterFrame.fromUser(this.windowsPopMUser));
        }

        allPopularimeterFrames = id3v2Tag.getFramesByClassType<Id3v2PopularimeterFrame>(Id3v2FrameClassType.PopularimeterFrame);

        const popularimeterFramesForWindowsUser: Id3v2PopularimeterFrame[] = allPopularimeterFrames.filter(
            (x) => x.user === this.windowsPopMUser,
        );

        if (popularimeterFramesForWindowsUser.length > 0) {
            popularimeterFramesForWindowsUser[0].rating = RatingConverter.starToPopMRating(rating);
        }
    }
}
