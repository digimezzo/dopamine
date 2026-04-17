import {
    ByteVector,
    File,
    Id3v2FrameClassType,
    Id3v2FrameIdentifiers,
    Id3v2PopularimeterFrame,
    Id3v2Tag,
    Picture,
    PictureType,
    TagTypes,
} from '@digimezzo/node-taglib-sharp';
import { IFileMetadata } from './i-file-metadata';
import { RatingConverter } from './rating-converter';

export class TagLibFileMetadata implements IFileMetadata {
    private _title: string = '';
    private _album: string = '';
    private _albumArtists: string[] = [];
    private _artists: string[] = [];
    private _genres: string[] = [];
    private _comment: string = '';
    private _grouping: string = '';
    private _year: number = 0;
    private _trackNumber: number = 0;
    private _trackCount: number = 0;
    private _discNumber: number = 0;
    private _discCount: number = 0;
    private _lyrics: string = '';
    private _picture: Buffer | undefined;
    private _rating: number = 0;
    private _composers: string[] = [];
    private _conductor: string = '';
    private _beatsPerMinute: number = 0;
    private _changedProperties: Set<string> = new Set();

    private windowsPopMUser: string = 'Windows Media Player 9 Series';

    public constructor(public path: string) {}

    public bitRate: number = 0;
    public sampleRate: number = 0;
    public durationInMilliseconds: number = 0;

    public get title(): string {
        return this._title;
    }
    public set title(v: string) {
        this._title = v;
        this._changedProperties.add('title');
    }

    public get album(): string {
        return this._album;
    }
    public set album(v: string) {
        this._album = v;
        this._changedProperties.add('album');
    }

    public get albumArtists(): string[] {
        return this._albumArtists;
    }
    public set albumArtists(v: string[]) {
        this._albumArtists = v;
        this._changedProperties.add('albumArtists');
    }

    public get artists(): string[] {
        return this._artists;
    }
    public set artists(v: string[]) {
        this._artists = v;
        this._changedProperties.add('artists');
    }

    public get genres(): string[] {
        return this._genres;
    }
    public set genres(v: string[]) {
        this._genres = v;
        this._changedProperties.add('genres');
    }

    public get comment(): string {
        return this._comment;
    }
    public set comment(v: string) {
        this._comment = v;
        this._changedProperties.add('comment');
    }

    public get grouping(): string {
        return this._grouping;
    }
    public set grouping(v: string) {
        this._grouping = v;
        this._changedProperties.add('grouping');
    }

    public get year(): number {
        return this._year;
    }
    public set year(v: number) {
        this._year = v;
        this._changedProperties.add('year');
    }

    public get trackNumber(): number {
        return this._trackNumber;
    }
    public set trackNumber(v: number) {
        this._trackNumber = v;
        this._changedProperties.add('trackNumber');
    }

    public get trackCount(): number {
        return this._trackCount;
    }
    public set trackCount(v: number) {
        this._trackCount = v;
        this._changedProperties.add('trackCount');
    }

    public get discNumber(): number {
        return this._discNumber;
    }
    public set discNumber(v: number) {
        this._discNumber = v;
        this._changedProperties.add('discNumber');
    }

    public get discCount(): number {
        return this._discCount;
    }
    public set discCount(v: number) {
        this._discCount = v;
        this._changedProperties.add('discCount');
    }

    public get lyrics(): string {
        return this._lyrics;
    }
    public set lyrics(v: string) {
        this._lyrics = v;
        this._changedProperties.add('lyrics');
    }

    public get picture(): Buffer | undefined {
        return this._picture;
    }
    public set picture(v: Buffer | undefined) {
        this._picture = v;
        this._changedProperties.add('picture');
    }

    public get rating(): number {
        return this._rating;
    }
    public set rating(v: number) {
        this._rating = v;
        this._changedProperties.add('rating');
    }

    public get composers(): string[] {
        return this._composers;
    }
    public set composers(v: string[]) {
        this._composers = v;
        this._changedProperties.add('composers');
    }

    public get conductor(): string {
        return this._conductor;
    }
    public set conductor(v: string) {
        this._conductor = v;
        this._changedProperties.add('conductor');
    }

    public get beatsPerMinute(): number {
        return this._beatsPerMinute;
    }
    public set beatsPerMinute(v: number) {
        this._beatsPerMinute = v;
        this._changedProperties.add('beatsPerMinute');
    }

    public save(): void {
        const tagLibFile = File.createFromPath(this.path);

        if (this._changedProperties.has('rating')) {
            this.writeRatingToFile(tagLibFile, this._rating);
        }

        if (this._changedProperties.has('title')) {
            tagLibFile.tag.title = this._title;
        }
        if (this._changedProperties.has('artists')) {
            tagLibFile.tag.performers = this._artists;
        }
        if (this._changedProperties.has('album')) {
            tagLibFile.tag.album = this._album;
        }
        if (this._changedProperties.has('albumArtists')) {
            tagLibFile.tag.albumArtists = this._albumArtists;
        }
        if (this._changedProperties.has('year')) {
            tagLibFile.tag.year = this._year;
        }
        if (this._changedProperties.has('genres')) {
            tagLibFile.tag.genres = this._genres;
        }
        if (this._changedProperties.has('trackNumber')) {
            tagLibFile.tag.track = this._trackNumber;
        }
        if (this._changedProperties.has('trackCount')) {
            tagLibFile.tag.trackCount = this._trackCount;
        }
        if (this._changedProperties.has('discNumber')) {
            tagLibFile.tag.disc = this._discNumber;
        }
        if (this._changedProperties.has('discCount')) {
            tagLibFile.tag.discCount = this._discCount;
        }
        if (this._changedProperties.has('grouping')) {
            tagLibFile.tag.grouping = this._grouping;
        }
        if (this._changedProperties.has('comment')) {
            tagLibFile.tag.comment = this._comment;
        }
        if (this._changedProperties.has('composers')) {
            tagLibFile.tag.composers = this._composers;
        }
        if (this._changedProperties.has('conductor')) {
            tagLibFile.tag.conductor = this._conductor;
        }
        if (this._changedProperties.has('beatsPerMinute')) {
            tagLibFile.tag.beatsPerMinute = this._beatsPerMinute;
        }

        if (this._changedProperties.has('picture')) {
            if (this._picture) {
                const picture = Picture.fromData(ByteVector.fromByteArray(this._picture));
                picture.type = PictureType.FrontCover;
                tagLibFile.tag.pictures = [picture];
            } else {
                tagLibFile.tag.pictures = [];
            }
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
                this._artists = tagLibFile.tag.performers ?? [];
            }

            if (tagLibFile.tag.title != undefined) {
                this._title = tagLibFile.tag.title ?? '';
            }

            if (tagLibFile.tag.album != undefined) {
                this._album = tagLibFile.tag.album ?? '';
            }

            if (tagLibFile.tag.albumArtists !== undefined) {
                if (this.path.toLowerCase().endsWith('.wav')) {
                    this._albumArtists = (tagLibFile.tag.albumArtists ?? []).map((a) => a.replace(/\u0000/g, ''));
                } else {
                    this._albumArtists = tagLibFile.tag.albumArtists ?? [];
                }
            }

            if (tagLibFile.tag.genres != undefined) {
                this._genres = tagLibFile.tag.genres ?? [];
            }

            if (tagLibFile.tag.year != undefined && !Number.isNaN(tagLibFile.tag.year)) {
                this._year = tagLibFile.tag.year ?? 0;
            }

            if (tagLibFile.tag.comment != undefined) {
                this._comment = tagLibFile.tag.comment ?? '';
            }

            if (tagLibFile.tag.grouping != undefined) {
                this._grouping = tagLibFile.tag.grouping ?? '';
            }

            if (tagLibFile.tag.track != undefined && !Number.isNaN(tagLibFile.tag.track)) {
                this._trackNumber = tagLibFile.tag.track ?? 0;
            }

            if (tagLibFile.tag.trackCount != undefined && !Number.isNaN(tagLibFile.tag.trackCount)) {
                this._trackCount = tagLibFile.tag.trackCount ?? 0;
            }

            if (tagLibFile.tag.disc != undefined && !Number.isNaN(tagLibFile.tag.disc)) {
                this._discNumber = tagLibFile.tag.disc ?? 0;
            }

            if (tagLibFile.tag.discCount != undefined && !Number.isNaN(tagLibFile.tag.discCount)) {
                this._discCount = tagLibFile.tag.discCount ?? 0;
            }

            if (tagLibFile.tag.lyrics != undefined) {
                this._lyrics = tagLibFile.tag.lyrics ?? '';
            }

            if (tagLibFile.tag.composers != undefined) {
                this._composers = tagLibFile.tag.composers ?? [];
            }

            if (tagLibFile.tag.conductor != undefined) {
                this._conductor = tagLibFile.tag.conductor ?? '';
            }

            if (tagLibFile.tag.beatsPerMinute != undefined && !Number.isNaN(tagLibFile.tag.beatsPerMinute)) {
                this._beatsPerMinute = tagLibFile.tag.beatsPerMinute ?? 0;
            }

            if (tagLibFile.tag.pictures != undefined && tagLibFile.tag.pictures.length > 0) {
                let couldGetPicture: boolean = false;

                for (const picture of tagLibFile.tag.pictures.filter((x) => x.type !== PictureType.NotAPicture)) {
                    if (!couldGetPicture) {
                        try {
                            this._picture = Buffer.from(picture.data.toBase64String(), 'base64');
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
