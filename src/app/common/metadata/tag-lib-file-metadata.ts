import { File, Id3v2FrameClassType, Id3v2FrameIdentifiers, Id3v2PopularimeterFrame, Id3v2Tag, TagTypes } from 'node-taglib-sharp';
import { IFileMetadata } from './i-file-metadata';
import { RatingConverter } from './rating-converter';

export class TagLibFileMetadata implements IFileMetadata {
    private _rating: number = 0;
    private ratingHasChanged: boolean = false;

    private windowsPopMUser: string = 'Windows Media Player 9 Series';

    public constructor(public path: string) {}

    public bitRate: number;
    public sampleRate: number;
    public durationInMilliseconds: number;
    public title: string;
    public album: string;
    public albumArtists: string[];
    public artists: string[];
    public genres: string[];
    public comment: string;
    public grouping: string;
    public year: number;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public lyrics: string;
    public picture: Buffer;

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

        tagLibFile.save();
        tagLibFile.dispose();
    }

    public async loadAsync(): Promise<void> {
        const tagLibFile = File.createFromPath(this.path);

        if (tagLibFile.tag != undefined) {
            if (tagLibFile.tag.performers != undefined) {
                this.artists = tagLibFile.tag.performers;
            }

            if (tagLibFile.tag.title != undefined) {
                this.title = tagLibFile.tag.title;
            }

            if (tagLibFile.tag.album != undefined) {
                this.album = tagLibFile.tag.album;
            }

            if (tagLibFile.tag.albumArtists != undefined) {
                this.albumArtists = tagLibFile.tag.albumArtists;
            }

            if (tagLibFile.tag.genres != undefined) {
                this.genres = tagLibFile.tag.genres;
            }

            if (tagLibFile.tag.year != undefined && !Number.isNaN(tagLibFile.tag.year)) {
                this.year = tagLibFile.tag.year;
            }

            if (tagLibFile.tag.comment != undefined) {
                this.comment = tagLibFile.tag.comment;
            }

            if (tagLibFile.tag.grouping != undefined) {
                this.grouping = tagLibFile.tag.grouping;
            }

            if (tagLibFile.tag.track != undefined && !Number.isNaN(tagLibFile.tag.track)) {
                this.trackNumber = tagLibFile.tag.track;
            }

            if (tagLibFile.tag.trackCount != undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                this.trackCount = tagLibFile.tag.trackCount;
            }

            if (tagLibFile.tag.disc != undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                this.discNumber = tagLibFile.tag.disc;
            }

            if (tagLibFile.tag.discCount != undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                this.discCount = tagLibFile.tag.discCount;
            }

            if (tagLibFile.tag.lyrics != undefined) {
                this.lyrics = tagLibFile.tag.lyrics;
            }

            if (tagLibFile.tag.pictures != undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture: boolean = false;

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

        if (tagLibFile.properties != undefined) {
            if (tagLibFile.properties.durationMilliseconds != undefined && !Number.isNaN(tagLibFile.properties.durationMilliseconds)) {
                this.durationInMilliseconds = tagLibFile.properties.durationMilliseconds;
            }

            if (tagLibFile.properties.audioBitrate != undefined && !Number.isNaN(tagLibFile.properties.audioBitrate)) {
                this.bitRate = tagLibFile.properties.audioBitrate;
            }

            if (tagLibFile.properties.audioSampleRate != undefined && !Number.isNaN(tagLibFile.properties.audioSampleRate)) {
                this.sampleRate = tagLibFile.properties.audioSampleRate;
            }
        }

        try {
            this._rating = this.readRatingFromFile(tagLibFile);
        } catch (error) {
            // Intended suppression
        }

        tagLibFile.dispose();
    }

    private readRatingFromFile(tagLibFile: File): number {
        const id3v2Tag: Id3v2Tag = <Id3v2Tag>tagLibFile.getTag(TagTypes.Id3v2, true);
        const allPopularimeterFrames: Id3v2PopularimeterFrame[] = id3v2Tag.getFramesByClassType<Id3v2PopularimeterFrame>(
            Id3v2FrameClassType.PopularimeterFrame
        );

        if (allPopularimeterFrames.length === 0) {
            return 0;
        }

        const popularimeterFramesForWindowsUser: Id3v2PopularimeterFrame[] = allPopularimeterFrames.filter(
            (x) => x.user === this.windowsPopMUser
        );

        if (popularimeterFramesForWindowsUser.length > 0) {
            return RatingConverter.popM2StarRating(popularimeterFramesForWindowsUser[0].rating);
        }

        return RatingConverter.popM2StarRating(allPopularimeterFrames[0].rating);
    }

    private writeRatingToFile(tagLibFile: File, rating: number): void {
        const id3v2Tag: Id3v2Tag = <Id3v2Tag>tagLibFile.getTag(TagTypes.Id3v2, true);
        const allPopularimeterFrames: Id3v2PopularimeterFrame[] = id3v2Tag.getFramesByClassType<Id3v2PopularimeterFrame>(
            Id3v2FrameClassType.PopularimeterFrame
        );

        if (allPopularimeterFrames.length === 0) {
            const newPopularimeterFrame = Id3v2PopularimeterFrame.fromUser(this.windowsPopMUser);
            newPopularimeterFrame.rating = rating;
            id3v2Tag.removeFrames(Id3v2FrameIdentifiers.POPM);
            id3v2Tag.addFrame(newPopularimeterFrame);

            return;
        }

        const popularimeterFramesForWindowsUser: Id3v2PopularimeterFrame[] = allPopularimeterFrames.filter(
            (x) => x.user === this.windowsPopMUser
        );

        if (popularimeterFramesForWindowsUser.length > 0) {
            popularimeterFramesForWindowsUser[0].rating = RatingConverter.starToPopMRating(rating);

            return;
        }

        allPopularimeterFrames[0].rating = RatingConverter.starToPopMRating(rating);
    }
}
