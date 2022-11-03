import ContentDescriptionObject from "./objects/contentDescriptionObject";
import Genres from "../genres";
import HeaderObject from "./objects/headerObject";
import ReadWriteUtils from "./readWriteUtils";
import {ByteVector, StringType} from "../byteVector";
import {DataType} from "./objects/descriptorBase";
import {ContentDescriptor, ExtendedContentDescriptionObject} from "./objects/extendedContentDescriptionObject";
import {IPicture, Picture} from "../picture";
import {MetadataDescriptor, MetadataLibraryObject} from "./objects/metadataLibraryObject";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";
import {ObjectType} from "./constants";

/**
 * This class extends {@link Tag} to provide a representation of an ASF tag which can be read from
 * and written to disk.
 */
export default class AsfTag extends Tag {

    private _contentDescriptionObject: ContentDescriptionObject = ContentDescriptionObject.fromEmpty();
    private _extendedDescriptionObject: ExtendedContentDescriptionObject = ExtendedContentDescriptionObject.fromEmpty();
    private _metadataLibraryObject: MetadataLibraryObject = MetadataLibraryObject.fromEmpty();

    private static readonly GENRE_REGEX = new RegExp(/\(([0-9]+)\)/);

    // #region Constructors

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new, empty instance.
     */
    public static fromEmpty(): AsfTag {
        return new AsfTag();
    }

    /**
     * Constructs and initializes a new instance using the children of a {@link HeaderObject}
     * object.
     * @param header Header object whose children will be used to populate the new instance
     */
    public static fromHeader(header: HeaderObject): AsfTag {
        Guards.truthy(header, "header");

        const instance = new AsfTag();
        for (const child of header.children) {
            if (child.objectType === ObjectType.ContentDescriptionObject) {
                instance._contentDescriptionObject = <ContentDescriptionObject> child;
            }
            if (child.objectType === ObjectType.ExtendedContentDescriptionObject) {
                instance._extendedDescriptionObject = <ExtendedContentDescriptionObject> child;
            }
        }

        if (header.extension) {
            for (const child of header.extension.children) {
                if (child.objectType === ObjectType.MetadataLibraryObject) {
                    instance._metadataLibraryObject = <MetadataLibraryObject> child;
                }
            }
        }

        return instance;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the ASF content description object used by the current instance.
     */
    public get contentDescriptionObject(): ContentDescriptionObject { return this._contentDescriptionObject; }

    /**
     * Gets the ASF extended content description used by the current instance.
     */
    public get extendedContentDescriptionObject(): ExtendedContentDescriptionObject {
        return this._extendedDescriptionObject;
    }

    /**
     * Gets the ASF metadata library object used by the current instance.
     */
    public get metadataLibraryObject(): MetadataLibraryObject { return this._metadataLibraryObject; }

    // #endregion

    // #region Tag Properties

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.Asf; }

    /** @inheritDoc */
    // @TODO: Reliably calculate size on disk during reading
    public get sizeOnDisk(): number { return undefined; }

    /**
     *  @inheritDoc
     *  @remarks via content description object
     */
    public get title(): string { return this._contentDescriptionObject.title; }
    /**
     *  @inheritDoc
     *  @remarks via content description object
     */
    public set title(value: string) { this._contentDescriptionObject.title = value; }

    /**
     * @inheritDoc
     * @remarks via `WM/SubTitle` descriptor
     *     https://msdn.microsoft.com/en-us/library/windows/desktop/dd757997(v=vs.85).aspx
     */
    public get subtitle(): string { return this.getDescriptorString("WM/SubTitle"); }
    /**
     * @inheritDoc
     * @remarks via `WM/SubTitle` descriptor
     *     https://msdn.microsoft.com/en-us/library/windows/desktop/dd757997(v=vs.85).aspx
     */
    public set subtitle(value: string) { this.setDescriptorString(value, "WM/SubTitle"); }

    /**
     * @inheritDoc
     * @remarks via "WM/TitleSortOrder"
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public get titleSort(): string { return this.getDescriptorString("WM/TitleSortOrder"); }
    /**
     * @inheritDoc
     * @remarks via "WM/TitleSortOrder"
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public set titleSort(value: string) { this.setDescriptorString(value, "WM/TitleSortOrder"); }

    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptor.description}
     *     Some applications will use this field for storing comments.
     */
    public get description(): string { return this._contentDescriptionObject.description; }
    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptor.description}
     *     Some applications will use this field for storing comments.
     */
    public set description(value: string) { this._contentDescriptionObject.description = value; }

    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptor.author}
     */
    public get performers(): string[] { return AsfTag.splitAndClean(this._contentDescriptionObject.author); }
    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptor.author}
     */
    public set performers(value: string[]) { this._contentDescriptionObject.author = value.join("; "); }

    /**
     * @inheritDoc
     * @remarks via "WM/ArtistSortOrder" descriptor
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public get performersSort(): string[] { return this.getDescriptorStrings("WM/ArtistSortOrder"); }
    /**
     * @inheritDoc
     * @remarks via "WM/ArtistSortOrder" descriptor
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public set performersSort(value: string[]) { this.setDescriptorStrings(value, "WM/ArtistSortOrder"); }

    /**
     * @inheritDoc
     * @remarks via `WM/AlbumArtist` or `AlbumArtist` descriptors
     */
    public get albumArtists(): string[] { return this.getDescriptorStrings("WM/AlbumArtist", "AlbumArtist"); }
    /**
     * @inheritDoc
     * @remarks via `WM/AlbumArtist` or `AlbumArtist` descriptors
     */
    public set albumArtists(value: string[]) { this.setDescriptorStrings(value, "WM/AlbumArtist", "AlbumArtist"); }

    /**
     * @inheritDoc
     * @remarks via `WM/AlbumArtistSortOrder` descriptor
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public get albumArtistsSort(): string[] { return this.getDescriptorStrings("WM/AlbumArtistSortOrder"); }
    /**
     * @inheritDoc
     * @remarks via `WM/AlbumArtistSortOrder` descriptor
     *     http://msdn.microsoft.com/en-us/library/aa386866(VS.85).aspx
     */
    public set albumArtistsSort(value: string[]) { this.setDescriptorStrings(value, "WM/AlbumArtistSortOrder"); }

    /**
     * @inheritDoc
     * @remarks via `WM/Composer` or `Composer` descriptors
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-composer
     */
    public get composers(): string[] { return this.getDescriptorStrings("WM/Composer", "Composer"); }
    /**
     * @inheritDoc
     * @remarks via `WM/Composer` or `Composer` descriptors
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-composer
     */
    public set composers(value: string[]) { this.setDescriptorStrings(value, "WM/Composer", "Composer"); }

    /**
     * @inheritDoc
     * @remarks via `WM/AlbumTitle` or `Album` descriptors
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-albumtitle
     */
    public get album(): string { return this.getDescriptorString("WM/AlbumTitle", "Album"); }
    /**
     * @inheritDoc
     * @remarks via `WM/AlbumTitle` or `Album` descriptors
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-albumtitle
     */
    public set album(value: string) { this.setDescriptorString(value, "WM/AlbumTitle", "Album"); }

    /**
     * @inheritDoc
     * @remarks via `WM/AlbumSortOrder` descriptors
     */
    public get albumSort(): string { return this.getDescriptorString("WM/AlbumSortOrder"); }
    /**
     * @inheritDoc
     * @remarks via `WM/AlbumSortOrder` descriptors
     */
    public set albumSort(value: string) { this.setDescriptorString(value, "WM/AlbumSortOrder"); }

    /**
     * @inheritDoc
     * @remarks via `WM/Text` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-text
     *     It should be noted that many applications store comments in the field read by
     *     {@link description}.
     */
    public get comment(): string { return this.getDescriptorString("WM/Text"); }
    /**
     * @inheritDoc
     * @remarks via `WM/Text` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-text
     *     It should be noted that many applications store comments in the field read by
     *     {@link description}.
     */
    public set comment(value: string) { this.setDescriptorString(value, "WM/Text"); }

    /**
     * @inheritDoc
     * @remarks via `WM/Genre`, `WM/GenreID`, or `Genre` descriptors
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-genre
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-genreid
     */
    public get genres(): string[] {
        // @TODO: Strings from genre should be combined with genreID and checked for duplicates
        const value = this.getDescriptorString("WM/Genre", "WM/GenreID", "Genre");
        if (!value || value.trim().length === 0) {
            return [];
        }

        const result = value.split(";");
        for (let i = 0; i < result.length; i++) {
            let genre = result[i].trim();

            // Attempt to find a numeric genre in here
            const genreMatch = AsfTag.GENRE_REGEX.exec(genre);
            if (genreMatch) {
                const numericGenre = Number.parseInt(genreMatch[1], 10);
                if (!Number.isNaN(numericGenre)) {
                    genre = Genres.indexToAudio(genreMatch[1], false);
                }
            }

            result[i] = genre;
        }

        return result;
    }
    /**
     * @inheritDoc
     * @remarks via `WM/Genre`, `WM/GenreID`, or `Genre` descriptors
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-genre
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-genreid
     */
    public set genres(value: string[]) {
        // @TODO: Make it optional to write to WM/GenreID in addition to WM/Genre
        // @TODO: WM/GenreID should be written as a TCON compatible genre ID where possible
        this.setDescriptorStrings(value, "WM/Genre", "Genre", "WM/GenreID");
    }

    /**
     * @inheritDoc
     * @remarks via `WM/Year` descriptor
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-year
     */
    public get year(): number {
        const text = this.getDescriptorString("WM/Year");
        if (!text || text.length < 4) {
            return 0;
        }

        const parsed = Number.parseInt(text.substr(0, 4), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
    /**
     * @inheritDoc
     * @remarks via `WM/Year` descriptor
     *      https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-year
     */
    public set year(value: number) {
        Guards.uint(value, "value");
        this.setDescriptorString(value.toString(10), "WM/Year");
    }

    /**
     * @inheritDoc
     * @remarks via `WM/TrackNumber` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-tracknumber
     */
    public get track(): number { return this.getDescriptorUint("WM/TrackNumber"); }
    /**
     * @inheritDoc
     * @remarks via `WM/TrackNumber` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-tracknumber
     */
    public set track(value: number) {
        Guards.uint(value, "value");
        if (value === 0) {
            this.removeDescriptors("WM/TrackNumber");
        } else {
            // @TODO: Config value for storing as DWORD or WMT_TYPE_STRING OR store it the same way
            //     it was read
            const descriptor = new ContentDescriptor("WM/TrackNumber", DataType.Unicode, value.toString());
            this.setDescriptors("WM/TrackNumber", descriptor);
        }
    }

    /**
     * @inheritDoc
     * @remarks via `TrackTotal` descriptor
     */
    public get trackCount(): number { return this.getDescriptorUint("TrackTotal"); }
    /**
     * @inheritDoc
     * @remarks via `TrackTotal` descriptor
     */
    public set trackCount(value: number) {
        Guards.uint(value, "value");
        if (value === 0) {
            this.removeDescriptors("TrackTotal");
        } else {
            const descriptor = new ContentDescriptor("TrackTotal", DataType.DWord, value);
            this.setDescriptors("TrackTotal", descriptor);
        }
    }

    /**
     * @inheritDoc
     * @remarks via `WM/PartOfSet` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-partofset
     */
    public get disc(): number {
        const discString = this.getDescriptorString("WM/PartOfSet");
        if (!discString) {
            return 0;
        }

        const discSplit = discString.split("/");

        const discNumber = Number.parseInt(discSplit[0], 10);
        return Number.isNaN(discNumber) ? 0 : discNumber;
    }
    /**
     * @inheritDoc
     * @remarks via `WM/PartOfSet` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-partofset
     */
    public set disc(value: number) {
        Guards.uint(value, "value");

        const count = this.discCount;
        if (value === 0 && count === 0) {
            this.removeDescriptors("WM/PartOfSet");
            return;
        }

        const descriptorValue = count !== 0 ? `${value}/${count}` : value.toString();
        this.setDescriptorString(descriptorValue, "WM/PartOfSet");
    }

    /**
     * @inheritDoc
     * @remarks via `WM/PartOfSet` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-partofset
     */
    public get discCount(): number {
        const discString = this.getDescriptorString("WM/PartOfSet");
        if (!discString) {
            return 0;
        }

        const discSplit = discString.split("/");
        if (discSplit.length < 2) {
            return 0;
        }

        const discCount = Number.parseInt(discSplit[1], 10);
        return Number.isNaN(discCount) ? 0 : discCount;
    }
    /**
     * @inheritDoc
     * @remarks via `WM/PartOfSet` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-partofset
     */
    public set discCount(value: number) {
        Guards.uint(value, "value");

        const disc = this.disc;
        if (value === 0 && disc === 0) {
            this.removeDescriptors("WM/PartOfSet");
            return;
        }

        this.setDescriptorString(`${disc}/${value}`, "WM/PartOfSet");
    }

    /**
     * @inheritDoc
     * @remarks via `WM/Lyrics` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-lyrics
     */
    public get lyrics(): string { return this.getDescriptorString("WM/Lyrics"); }
    /**
     * @inheritDoc
     * @remarks via `WM/Lyrics` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-lyrics
     */
    public set lyrics(value: string) { this.setDescriptorString(value, "WM/Lyrics"); }

    /**
     * @inheritDoc
     * @remarks via `WM/ContentGroupDescription` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-contentgroupdescription
     */
    public get grouping(): string { return this.getDescriptorString("WM/ContentGroupDescription"); }
    /**
     * @inheritDoc
     * @remarks via `WM/ContentGroupDescription` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-contentgroupdescription
     */
    public set grouping(value: string) { this.setDescriptorString(value, "WM/ContentGroupDescription"); }

    /**
     * @inheritDoc
     * @remarks via `WM/BeatsPerMinute` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-beatsperminute
     */
    public get beatsPerMinute(): number { return this.getDescriptorUint("WM/BeatsPerMinute"); }
    /**
     * @inheritDoc
     * @remarks via `WM/BeatsPerMinute` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-beatsperminute
     */
    public set beatsPerMinute(value: number) {
        Guards.uint(value, "value");
        if (value === 0) {
            this.removeDescriptors("WM/BeatsPerMinute");
        } else {
            // @TODO: Config value for storing as DWORD or WMT_TYPE_STRING
            const descriptor = new ContentDescriptor("WM/BeatsPerMinute", DataType.Unicode, value.toString());
            this.setDescriptors("WM/BeatsPerMinute", descriptor);
        }
    }

    /**
     * @inheritDoc
     * @remarks via `WM/Conductor` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-conductor
     */
    public get conductor(): string { return this.getDescriptorString("WM/Conductor"); }
    /**
     * @inheritDoc
     * @remarks via `WM/Conductor` descriptor
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-conductor
     */
    public set conductor(value: string) { this.setDescriptorString(value, "WM/Conductor"); }

    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptionObject.copyright}
     */
    public get copyright(): string { return this._contentDescriptionObject.copyright; }
    /**
     * @inheritDoc
     * @remarks via {@link ContentDescriptionObject.copyright}
     */
    public set copyright(value: string) { this._contentDescriptionObject.copyright = value; }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Artist Id` descriptor
     */
    public get musicBrainzArtistId(): string { return this.getDescriptorString("MusicBrainz/Artist Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Artist Id` descriptor
     */
    public set musicBrainzArtistId(value: string) { this.setDescriptorString(value, "MusicBrainz/Artist Id"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Release Group Id` descriptor
     */
    public get musicBrainzReleaseGroupId(): string { return this.getDescriptorString("MusicBrainz/Release Group Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Release Group Id` descriptor
     */
    public set musicBrainzReleaseGroupId(value: string) {
        this.setDescriptorString(value, "MusicBrainz/Release Group Id");
    }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Id` descriptor
     */
    public get musicBrainzReleaseId(): string { return this.getDescriptorString("MusicBrainz/Album Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Id` descriptor
     */
    public set musicBrainzReleaseId(value: string) { this.setDescriptorString(value, "MusicBrainz/Album Id"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Artist Id` descriptor
     */
    public get musicBrainzAlbumArtistId(): string { return this.getDescriptorString("MusicBrainz/Album Artist Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Artist Id` descriptor
     */
    public set musicBrainzAlbumArtistId(value: string) {
        this.setDescriptorString(value, "MusicBrainz/Album Artist Id");
    }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Track Id` descriptor
     */
    public get musicBrainzTrackId(): string { return this.getDescriptorString("MusicBrainz/Track Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Track Id` descriptor
     */
    public set musicBrainzTrackId(value: string) { this.setDescriptorString(value, "MusicBrainz/Track Id"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Disc Id` descriptor
     */
    public get musicBrainzDiscId(): string { return this.getDescriptorString("MusicBrainz/Disc Id"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Disc Id` descriptor
     */
    public set musicBrainzDiscId(value: string) { this.setDescriptorString(value, "MusicBrainz/Disc Id"); }

    /**
     * @inheritDoc
     * @remarks via `MusicIP/PUID` descriptor
     */
    public get musicIpId(): string { return this.getDescriptorString("MusicIP/PUID"); }
    /**
     * @inheritDoc
     * @remarks via `MusicIP/PUID` descriptor
     */
    public set musicIpId(value: string) { this.setDescriptorString(value, "MusicIP/PUID"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Status` descriptor
     */
    public get musicBrainzReleaseStatus(): string { return this.getDescriptorString("MusicBrainz/Album Status"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Status` descriptor
     */
    public set musicBrainzReleaseStatus(value: string) { this.setDescriptorString(value, "MusicBrainz/Album Status"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Type` descriptor
     */
    public get musicBrainzReleaseType(): string { return this.getDescriptorString("MusicBrainz/Album Type"); }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Type` descriptor
     */
    public set musicBrainzReleaseType(value: string) { this.setDescriptorString(value, "MusicBrainz/Album Type"); }

    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Release Country` descriptor
     */
    public get musicBrainzReleaseCountry(): string {
        return this.getDescriptorString("MusicBrainz/Album Release Country");
    }
    /**
     * @inheritDoc
     * @remarks via `MusicBrainz/Album Release Country` descriptor
     */
    public set musicBrainzReleaseCountry(value: string) {
        this.setDescriptorString(value, "MusicBrainz/Album Release Country");
    }

    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Track` descriptor
     */
    public get replayGainTrackGain(): number {
        let valueString = this.getDescriptorString("ReplayGain/Track");
        if (!valueString) {
            return Number.NaN;
        }
        if (valueString.toLowerCase().endsWith("db")) {
            valueString = valueString.substr(0, valueString.length - 2).trim();
        }

        return  Number.parseFloat(valueString);
    }
    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Track` descriptor
     */
    public set replayGainTrackGain(value: number) {
        Guards.notNullOrUndefined(value, "value");
        if (Number.isNaN(value)) {
            this.removeDescriptors("ReplayGain/Track");
        } else {
            const text = value.toFixed(2);
            this.setDescriptorString(`${text} dB`, "ReplayGain/Track");
        }
    }

    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Track Peak` descriptor
     */
    public get replayGainTrackPeak(): number {
        const valueString = this.getDescriptorString("ReplayGain/Track Peak");
        return !valueString ? Number.NaN : Number.parseFloat(valueString);
    }
    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Track Peak` descriptor
     */
    public set replayGainTrackPeak(value: number) {
        if (Number.isNaN(value)) {
            this.removeDescriptors("ReplayGain/Track Peak");
        } else {
            const text = value.toFixed(6);
            this.setDescriptorString(text, "ReplayGain/Track Peak");
        }
    }

    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Album` descriptor
     */
    public get replayGainAlbumGain(): number {
        let valueString = this.getDescriptorString("ReplayGain/Album");
        if (!valueString) {
            return Number.NaN;
        }
        if (valueString.toLowerCase().endsWith("db")) {
            valueString = valueString.substr(0, valueString.length - 2).trim();
        }

        return  Number.parseFloat(valueString);
    }
    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Album` descriptor
     */
    public set replayGainAlbumGain(value: number) {
        Guards.notNullOrUndefined(value, "value");
        if (Number.isNaN(value)) {
            this.removeDescriptors("ReplayGain/Album");
        } else {
            const text = value.toFixed(2);
            this.setDescriptorString(`${text} dB`, "ReplayGain/Album");
        }
    }

    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Album Peak` descriptor
     */
    public get replayGainAlbumPeak(): number {
        const valueString = this.getDescriptorString("ReplayGain/Album Peak");
        return !valueString ? Number.NaN : Number.parseFloat(valueString);
    }
    /**
     * @inheritDoc
     * @remarks via `ReplayGain/Album Peak` descriptor
     */
    public set replayGainAlbumPeak(value: number) {
        if (Number.isNaN(value)) {
            this.removeDescriptors("ReplayGain/Album Peak");
        } else {
            const text = value.toFixed(6);
            this.setDescriptorString(text, "ReplayGain/Album Peak");
        }
    }

    /**
     * @inheritDoc
     * @remarks via the `WM/Picture` content descriptor and description record.
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wmpicture
     *     Modifications to the returned array will not stored.
     */
    public get pictures(): IPicture[] {
        const records = [
            ... this.getDescriptors("WM/Picture"),
            ... this._metadataLibraryObject.getRecords(0, 0, "WM/Picture")
        ];
        return records.map((r) => AsfTag.pictureFromData(r.byteValue))
            .filter((p) => !!p);
    }
    /**
     * @inheritDoc
     * @remarks via the `WM/Picture` content descriptor and description record.
     *     https://docs.microsoft.com/en-us/windows/win32/wmformat/wmpicture
     */
    public set pictures(value: IPicture[]) {
        if (!value || value.length === 0) {
            this.removeDescriptors("WM/Picture");
            this._metadataLibraryObject.removeRecords(0, 0, "WM/Picture");
            return;
        }

        const data = value.map((p) => AsfTag.pictureToData(p));
        const bigPics = data.some((d) => d.length > 0xFFFF);

        if (bigPics) {
            const descriptors = data.map((d) => new MetadataDescriptor(0, 0, "WM/Picture", DataType.Bytes, d));
            this.removeDescriptors("WM/Picture");
            this._metadataLibraryObject.setRecords(0, 0, "WM/Picture", ...descriptors);
        } else {
            const descriptors = data.map((d) => new ContentDescriptor("WM/Picture", DataType.Bytes, d));
            this.setDescriptors("WM/Picture", ... descriptors);
            this._metadataLibraryObject.removeRecords(0, 0, "WM/Picture");
        }
    }

    /** @inheritDoc */
    public get isEmpty(): boolean {
        return this._contentDescriptionObject.isEmpty && this._extendedDescriptionObject.isEmpty;
    }

    // #endregion

    // #region Methods

    /**
     * Adds a descriptor to the current instance's extended content description object.
     * @param descriptor Content descriptor to add to the current instance. Must be truthy
     */
    public addDescriptor(descriptor: ContentDescriptor): void {
        this._extendedDescriptionObject.addDescriptor(descriptor);
    }

    /** @inheritDoc */
    public clear(): void {
        this._contentDescriptionObject = ContentDescriptionObject.fromEmpty();
        this._extendedDescriptionObject = ExtendedContentDescriptionObject.fromEmpty();
        this._metadataLibraryObject.removeRecords(0, 0, "WM/Picture");
    }

    /**
     * Gets all descriptors in the extended description object with names matching any of the names
     * in the provided collection of names.
     * @param names Collection of names to search the extended description object for
     */
    public getDescriptors(... names: string[]): ContentDescriptor[] {
        return this._extendedDescriptionObject.getDescriptors(... names);
    }

    /**
     * Gets the string contained in a specific descriptor from the extended content description
     * object in the current instance.
     * @param names Names of the descriptors to look for
     * @returns string The contents of the first descriptor found who's name is in the provided
     *     collection of descriptor names
     */
    public getDescriptorString(... names: string[]): string {
        Guards.truthy(names, "names");
        for (const descriptor of this.getDescriptors(... names)) {
            if (descriptor === null || descriptor.type !== DataType.Unicode) {
                continue;
            }

            const value = descriptor.stringValue;
            if (value !== undefined) {
                return value;
            }
        }

        return undefined;
    }

    public getDescriptorUint(... names: string[]): number {
        for (const descriptor of this.getDescriptors(... names)) {
            if (descriptor.type === DataType.DWord) {
                const uintValue = descriptor.uintValue;
                if (uintValue !== 0) {
                    return uintValue;
                }
            } else if (descriptor.type === DataType.Unicode) {
                const numericValue = Number.parseInt(descriptor.stringValue.trim(), 10);
                if (numericValue !== 0) {
                    return numericValue;
                }
            }
        }

        return 0;
    }

    /**
     * Gets the strings contained in a specific descriptor from the extended content description
     * object in the current instance, as split by `;`.
     * @param names Names of the descriptors to look for
     * @returns string The contents of the first descriptor found who's name is in the provided
     *     collection of descriptor names, split by `;`
     */
    public getDescriptorStrings(... names: string[]): string[] {
        return AsfTag.splitAndClean(this.getDescriptorString(... names));
    }

    /**
     * Removes all descriptors with a specified name from the extended content description object
     * in the current instance.
     * @param name Name of the descriptor to remove rom the current instance
     */
    public removeDescriptors(name: string): void {
        this._extendedDescriptionObject.removeDescriptors(name);
    }

    /**
     * Sets a collection of descriptors in the extended content description object for a given
     * name, removing the existing matching records.
     * @param name Name of the descriptors to be added/removed
     * @param descriptors Descriptors to add to the new instance
     * @remarks All added descriptors should have their name set to `name` but this is not
     *     verified by the method. The descriptors will be added with their own names and not the
     *     one provided as an argument, which is only used for removing existing values and
     *     determining where to position the new descriptors.
     */
    public setDescriptors(name: string, ... descriptors: ContentDescriptor[]): void {
        this._extendedDescriptionObject.setDescriptors(name, ... descriptors);
    }

    /**
     * Sets the string for a collection of descriptors in the current instance.
     * @param value Value to store or `undefined` to clear the value
     * @param names Names in which the value would be expected. For example, "WM/AlbumTitle" and
     *     "Album"
     * @remarks The value will be stored in the first value in `names` and the rest of the
     *     descriptors with the matching names will be cleared.
     */
    public setDescriptorString(value: string, ... names: string[]): void {
        Guards.truthy(names, "names");

        let index = 0;
        if (value !== undefined && value !== null) {
            const trimmed = value.trim();
            if (trimmed.length > 0) {
                this.setDescriptors(names[0], new ContentDescriptor(names[0], DataType.Unicode, value));
                index++;
            }
        }

        for (; index < names.length; index++) {
            this.removeDescriptors(names[index]);
        }
    }

    /**
     * Sets the strings for a collection of descriptors in the current instance. The strings will
     * be stored as a single string, joined together with `; `.
     * @param value Value to store or `undefined` to clear the value
     * @param names Names in which the value would be expected. For example, "WM/AlbumTitle" and
     *     "Album"
     * @remarks The value will be stored in the first value in `names` and the rest of the
     *     descriptors with the matching names will be cleared.
     */
    public setDescriptorStrings(value: string[], ... names: string[]): void {
        this.setDescriptorString(value.join("; "), ...names);
    }

    /** @internal */
    public static pictureFromData(data: ByteVector): Picture {
        if (data.length < 9) {
            return undefined;
        }

        // @TODO: Should offer option to read picture lazily?
        let offset = 0;
        const pictureType = data.get(offset);
        offset += 1;

        // Get the Picture size
        const pictureSize = data.subarray(offset, 4).toUint(false);
        offset += 4;

        const delimiter = ByteVector.getTextDelimiter(StringType.UTF16LE);

        // Get the mime-type
        const mimeTypeDelimiterIndex = data.offsetFind(delimiter, offset, delimiter.length);
        if (mimeTypeDelimiterIndex < 0 || mimeTypeDelimiterIndex - offset === 0) {
            return undefined;
        }
        const mimeTypeLength = mimeTypeDelimiterIndex - offset;
        const mimeType = data.subarray(offset, mimeTypeLength).toString(StringType.UTF16LE);
        offset = mimeTypeDelimiterIndex + delimiter.length;

        // Get the description
        const descriptionDelimiterIndex = data.offsetFind(delimiter, offset, delimiter.length);
        if (descriptionDelimiterIndex < 0 || descriptionDelimiterIndex - offset === 0) {
            return undefined;
        }
        const descriptionLength = descriptionDelimiterIndex - offset;
        const description = data.subarray(offset, descriptionLength).toString(StringType.UTF16LE);
        offset = descriptionDelimiterIndex + 2;

        return Picture.fromFullData(data.subarray(offset, pictureSize), pictureType, mimeType, description);
    }

    /** @internal */
    public static pictureToData(picture: IPicture): ByteVector {
        return ByteVector.concatenate(
            picture.type,
            ReadWriteUtils.renderDWord(picture.data.length),
            ReadWriteUtils.renderUnicode(picture.mimeType),
            ReadWriteUtils.renderUnicode(picture.description),
            picture.data
        );
    }

    private static splitAndClean(str: string): string[] {
        return !str
            ? []
            : str.split(";").map((s) => s.trim());
    }

    // #endregion
}
