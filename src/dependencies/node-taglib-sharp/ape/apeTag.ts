import * as DateFormat from "dateformat";

import {ApeTagFooter, ApeTagFooterFlags} from "./apeTagFooter";
import {ApeTagItem, ApeTagItemType} from "./apeTagItem";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File, FileAccessMode} from "../file";
import {IPicture, Picture, PictureType} from "../picture";
import {Tag, TagTypes} from "../tag";
import {Guards, NumberUtils, StringComparison} from "../utils";

/**
 * Provides a representation of an APEv2 tag which can be read from and written to disk.
 */
export default class ApeTag extends Tag {
    /**
     * Names of picture fields, indexed to correspond to their picture item names.
     * @private
     */
    private static readonly PICTURE_ITEM_NAMES = [
        "Cover Art (other)",
        "Cover Art (icon)",
        "Cover Art (other icon)",
        "Cover Art (front)",
        "Cover Art (back)",
        "Cover Art (leaflet)",
        "Cover Art (media)",
        "Cover Art (lead)",
        "Cover Art (artist)",
        "Cover Art (conductor)",
        "Cover Art (band)",
        "Cover Art (composer)",
        "Cover Art (lyricist)",
        "Cover Art (studio)",
        "Cover Art (recording)",
        "Cover Art (performance)",
        "Cover Art (movie scene)",
        "Cover Art (colored fish)",
        "Cover Art (illustration)",
        "Cover Art (band logo)",
        "Cover Art (publisher logo)",
        "Embedded Object"
    ];
    private static readonly NOT_PICTURE_ITEM_TYPE_ID = 21;

    private _footer: ApeTagFooter;
    private _items: ApeTagItem[] = [];

    // #region Constructors

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new instance by reading the contents of a raw tag in a
     * specified {@link ByteVector} object.
     * @param data Object containing the raw tag
     */
    public static fromData(data: ByteVector): ApeTag {
        Guards.truthy(data, "data");
        if (data.length < ApeTagFooter.SIZE) {
            throw new CorruptFileError("Does not contain enough footer data");
        }

        const tag = new ApeTag();

        // Read the footer
        tag._footer = ApeTagFooter.fromData(data.subarray(data.length - ApeTagFooter.SIZE));

        // If we've read a header at the end of the block, the block is invalid
        if (NumberUtils.hasFlag(tag._footer.flags, ApeTagFooterFlags.IsHeader)) {
            throw new CorruptFileError("Footer was actually a header");
        }
        if ((data.length < tag._footer.requiredDataSize)) {
            throw new CorruptFileError("Does not contain enough tag data");
        }

        const startIndex = data.length - tag._footer.requiredDataSize;
        const length = tag._footer.requiredDataSize - ApeTagFooter.SIZE;
        tag.parse(data.subarray(startIndex, length));

        return tag;
    }

    /**
     * Constructs an empty APEv2 tag.
     */
    public static fromEmpty(): ApeTag {
        const tag = new ApeTag();
        tag._footer = ApeTagFooter.fromEmpty();
        return tag;
    }

    /**
     * Constructs a new instance by reading the contents from a specified position in a specified
     * file.
     * @param file File to read the tag from
     * @param position Position where the tag header or footer begins
     * @remarks If `position` points to the beginning of the tag footer, the footer will be read
     *     and then the parser will backup and start reading from the beginning of the file.
     */
    public static fromFile(file: File, position: number): ApeTag {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        Guards.lessThanInclusive(position, file.length - ApeTagFooter.SIZE, "position");

        file.mode = FileAccessMode.Read;
        file.seek(position);

        const tag = new ApeTag();

        // Read the header/footer in
        tag._footer = ApeTagFooter.fromData(file.readBlock(ApeTagFooter.SIZE));

        // If we've read a header, we don't have to seek to read the content. If we've read a
        // footer, we need to move back to the start of the tag.
        if (!NumberUtils.hasFlag(tag._footer.flags, ApeTagFooterFlags.IsHeader)) {
            file.seek(position - tag._footer.itemSize);
        }
        tag.parse(file.readBlock(tag._footer.requiredDataSize - ApeTagFooter.SIZE));

        return tag;
    }

    // #endregion

    // #region Ape Tag Properties

    /**
     * Gets whether or not the current instance has a header when rendered.
     */
    public get isHeaderPresent(): boolean {
        return !!this._footer && NumberUtils.hasFlag(this._footer.flags, ApeTagFooterFlags.HeaderPresent);
    }
    /**
     * Sets whether or not the current instance has a header when rendered.
     */
    public set isHeaderPresent(value: boolean) {
        if (value) {
            this._footer.flags |= ApeTagFooterFlags.HeaderPresent;
        } else {
            this._footer.flags &= ~ApeTagFooterFlags.HeaderPresent;
        }
    }

    /**
     * Gets all items stored in the current instance
     */
    public get items(): ApeTagItem[] { return this._items; }

    // #endregion

    // #region Generic Tag Properties

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.Ape; }

    /** @inheritDoc */
    public get sizeOnDisk(): number { return this._footer.tagSize; }

    /** @inheritDoc via Title item */
    public get title(): string { return this.getStringValue("Title"); }
    /** @inheritDoc via Title item */
    public set title(value: string) { this.setStringValue("Title", value); }

    /** @inheritDoc via TitleSort item */
    get titleSort(): string { return this.getStringValue("TitleSort"); }
    /** @inheritDoc via TitleSort item */
    set titleSort(value: string) { this.setStringValue("TitleSort", value); }

    /** @inheritDoc via Subtitle item */
    get subtitle(): string { return this.getStringValue("Subtitle"); }
    /** @inheritDoc via Subtitle */
    set subtitle(value: string) { this.setStringValue("Subtitle", value); }

    /** @inheritDoc via Description item */
    get description(): string { return this.getStringValue("Description"); }
    /** @inheritDoc via Description item */
    set description(value: string) { this.setStringValue("Description", value); }

    /** @inheritDoc via Artist item */
    get performers(): string[] { return this.getStringValues("Artist"); }
    /** @inheritDoc via Artist item */
    set performers(value: string[]) { this.setStringValues("Artist", value); }

    /** @inheritDoc via ArtistSort item */
    get performersSort(): string[] { return this.getStringValues("ArtistSort"); }
    /** @inheritDoc via ArtistSort item */
    set performersSort(value: string[]) { this.setStringValues("ArtistSort", value); }

    /** @inheritDoc via PerformersRole item */
    get performersRole(): string[] { return this.getStringValues("PerformersRole"); }
    /** @inheritDoc via PerformersRole item */
    set performersRole(value: string[]) { this.setStringValues("PerformersRole", value); }

    /**
     * @inheritDoc
     * This property is implemented using the "Album Artist" item and "AlbumArtist" as a backup if
     * it exists.
     */
    get albumArtists(): string[] {
        let albumArtists = this.getStringValues("Album Artist");
        if (albumArtists.length === 0) {
            albumArtists = this.getStringValues("AlbumArtist");
        }
        return albumArtists;
    }
    /**
     * @inheritDoc
     * Will be stored in "Album Artist" primarily. If "AlbumArtist" exists, value will also be
     * stored there for compatibility.
     */
    set albumArtists(value: string[]) {
        /* @TODO: Coalesce old values via config? */
        this.setStringValues("Album Artist", value);
        if (this.hasItem("AlbumArtist")) {
            this.setStringValues("AlbumArtist", value);
        }
    }

    /** @inheritDoc via AlbumArtistSort item */
    get albumArtistsSort(): string[] { return this.getStringValues("AlbumArtistSort"); }
    /** @inheritDoc via AlbumArtistSort item */
    set albumArtistsSort(value: string[]) { this.setStringValues("AlbumArtistSort", value); }

    /** @inheritDoc via Composer item */
    get composers(): string[] { return this.getStringValues("Composer"); }
    /** @inheritDoc via Composer item */
    set composers(value: string[]) { this.setStringValues("Composer", value); }

    /** @inheritDoc via ComposerSort item */
    get composersSort(): string[] { return this.getStringValues("ComposerSort"); }
    /** @inheritDoc via ComposerSort */
    set composersSort(value: string[]) { this.setStringValues("ComposerSort", value); }

    /** @inheritDoc via Album item */
    get album(): string { return this.getStringValue("Album"); }
    /** @inheritDoc via Album item */
    set album(value: string) { this.setStringValue("Album", value); }

    /** @inheritDoc via AlbumSort item */
    get albumSort(): string { return this.getStringValue("AlbumSort"); }
    /** @inheritDoc via AlbumSort item */
    set albumSort(value: string) { this.setStringValue("AlbumSort", value); }

    /** @inheritDoc via Comment item */
    get comment(): string { return this.getStringValue("Comment"); }
    /** @inheritDoc via Comment item */
    set comment(value: string) { this.setStringValue("Comment", value); }

    /** @inheritDoc via Genre item */
    get genres(): string[] { return this.getStringValues("Genre"); }
    /** @inheritDoc via Genre item */
    set genres(value: string[]) { this.setStringValues("Genre", value); }

    /** @inheritDoc via Year item */
    get year(): number {
        let text = this.getStringValue("Year");
        if (!text) {
            return 0;
        }

        let asInt = Number.parseInt(text, 10);
        if (Number.isNaN(asInt)) {
            text = text.substr(0, 4);
            asInt = Number.parseInt(text, 10);
            if (Number.isNaN(asInt)) {
                return 0;
            }
        }

        return asInt;
    }
    /** @inheritDoc via Year item */
    set year(value: number) { this.setNumericValue("Year", value, 0); }

    /** @inheritDoc via Track item numerator */
    get track(): number { return this.getUint32Value("Track", 0); }
    /** @inheritDoc via Track item numerator */
    set track(value: number) { this.setNumericValue("Track", value, this.trackCount); }

    /** @inheritDoc via Track item denominator */
    get trackCount(): number { return this.getUint32Value("Track", 1); }
    /** @inheritDoc via Track item denominator */
    set trackCount(value: number) { this.setNumericValue("Track", this.track, value); }

    /** @inheritDoc via Disc item numerator */
    get disc(): number { return this.getUint32Value("Disc", 0); }
    /** @inheritDoc via Disc item numerator */
    set disc(value: number) { this.setNumericValue("Disc", value, this.discCount); }

    /** @inheritDoc via Disc item denominator */
    get discCount(): number { return this.getUint32Value("Disc", 1); }
    /** @inheritDoc via Disc item denominator */
    set discCount(value: number) { this.setNumericValue("Disc", this.disc, value); }

    /** @inheritDoc via Lyrics item */
    get lyrics(): string { return this.getStringValue("Lyrics"); }
    /** @inheritDoc via Lyrics item */
    set lyrics(value: string) { this.setStringValue("Lyrics", value); }

    /** @inheritDoc via Grouping item */
    get grouping(): string { return this.getStringValue("Grouping"); }
    /** @inheritDoc via Grouping item */
    set grouping(value: string) { this.setStringValue("Grouping", value); }

    /** @inheritDoc via BPM item */
    get beatsPerMinute(): number { return this.getUint32Value("BPM", 0); }
    /** @inheritDoc via BPM item */
    set beatsPerMinute(value: number) { this.setNumericValue("BPM", value, 0); }

    /** @inheritDoc via Conductor item */
    get conductor(): string { return this.getStringValue("Conductor"); }
    /** @inheritDoc via Conductor item */
    set conductor(value: string) { this.setStringValue("Conductor", value); }

    /** @inheritDoc via Copyright item */
    get copyright(): string { return this.getStringValue("Copyright"); }
    /** @inheritDoc via Copyright item */
    set copyright(value: string) { this.setStringValue("Copyright", value); }

    /** @inheritDoc via DateTagged item */
    get dateTagged(): Date | undefined {
        const strValue = this.getStringValue("DateTagged");
        if (!strValue) { return undefined; }
        const dateValue = new Date(strValue);
        return isNaN(dateValue.getTime()) ? undefined : dateValue;
    }
    /** @inheritDoc via DateTagged item */
    set dateTagged(value: Date | undefined) {
        let strValue: string;
        if (value) {
            strValue = DateFormat(value, "yyyy-mm-dd HH:MM:ss");
            strValue = strValue.replace(" ", "T");
        }
        this.setStringValue("DateTagged", strValue);
    }

    /** @inheritDoc via MUSICBRAINZ_ARTISTID item */
    get musicBrainzArtistId(): string { return this.getStringValue("MUSICBRAINZ_ARTISTID"); }
    /** @inheritDoc via MUSICBRAINZ_ARTISTID item */
    set musicBrainzArtistId(value: string) { this.setStringValue("MUSICBRAINZ_ARTISTID", value); }

    /** @inheritDoc via MUSICBRAINZ_RELEASEGROUPID item */
    get musicBrainzReleaseGroupId(): string { return this.getStringValue("MUSICBRAINZ_RELEASEGROUPID"); }
    /** @inheritDoc via MUSICBRAINZ_RELEASEGROUPID item */
    set musicBrainzReleaseGroupId(value: string) { this.setStringValue("MUSICBRAINZ_RELEASEGROUPID", value); }

    /** @inheritDoc via MUSICBRAINZ_ALBUMID item */
    get musicBrainzReleaseId(): string { return this.getStringValue("MUSICBRAINZ_ALBUMID"); }
    /** @inheritDoc via MUSICBRAINZ_ALBUMID item */
    set musicBrainzReleaseId(value: string) { this.setStringValue("MUSICBRAINZ_ALBUMID", value); }

    /** @inheritDoc via MUSICBRAINZ_ARTISTID item */
    get musicBrainzReleaseArtistId(): string { return this.getStringValue("MUSICBRAINZ_ARTISTID"); }
    /** @inheritDoc via MUSICBRAINZ_ARTISTID item */
    set musicBrainzReleaseArtistId(value: string) { this.setStringValue("MUSICBRAINZ_ARTISTID", value); }

    /** @inheritDoc via MUSICBRAINZ_TRACKID item */
    get musicBrainzTrackId(): string { return this.getStringValue("MUSICBRAINZ_TRACKID"); }
    /** @inheritDoc via MUSICBRAINZ_TRACKID item */
    set musicBrainzTrackId(value: string) { this.setStringValue("MUSICBRAINZ_TRACKID", value); }

    /** @inheritDoc via MUSICBRAINZ_DISCID item */
    get musicBrainzDiscId(): string { return this.getStringValue("MUSICBRAINZ_DISCID"); }
    /** @inheritDoc via MUSICBRAINZ_DISCID item */
    set musicBrainzDiscId(value: string) { this.setStringValue("MUSICBRAINZ_DISCID", value); }

    /** @inheritDoc via MUSICIP_PUID item */
    get musicIpId(): string { return this.getStringValue("MUSICIP_PUID"); }
    /** @inheritDoc via MUSICIP_PUID item */
    set musicIpId(value: string) { this.setStringValue("MUSICIP_PUID", value); }

    /** @inheritDoc via ASIN item */
    get amazonId(): string { return this.getStringValue("ASIN"); }
    /** @inheritDoc via ASIN item */
    set amazonId(value: string) { this.setStringValue("ASIN", value); }

    /** @inheritDoc via MUSICBRAINZ_ALBUMSTATUS item */
    get musicBrainzReleaseStatus(): string { return this.getStringValue("MUSICBRAINZ_ALBUMSTATUS"); }
    /** @inheritDoc via MUSICBRAINZ_ALBUMSTATUS item */
    set musicBrainzReleaseStatus(value: string) { this.setStringValue("MUSICBRAINZ_ALBUMSTATUS", value); }

    /** @inheritDoc via MUSICBRAINZ_ALBUMTYPE item */
    get musicBrainzReleaseType(): string { return this.getStringValue("MUSICBRAINZ_ALBUMTYPE"); }
    /** @inheritDoc via MUSICBRAINZ_ALBUMTYPE item */
    set musicBrainzReleaseType(value: string) { this.setStringValue("MUSICBRAINZ_ALBUMTYPE", value); }

    /** @inheritDoc via RELEASECOUNTRY item */
    get musicBrainzReleaseCountry(): string { return this.getStringValue("RELEASECOUNTRY"); }
    /** @inheritDoc via RELEASECOUNTRY item */
    set musicBrainzReleaseCountry(value: string) { this.setStringValue("RELEASECOUNTRY", value); }

    /** @inheritDoc via REPLAYGAIN_TRACK_GAIN item */
    get replayGainTrackGain(): number {
        let text = this.getStringValue("REPLAYGAIN_TRACK_GAIN");
        if (!text) { return NaN; }
        if (text.toLowerCase().endsWith("db")) {
            text = text.substr(0, text.length - 2).trim();
        }

        return Number.parseFloat(text);
    }
    /** @inheritDoc via REPLAYGAIN_TRACK_GAIN item */
    set replayGainTrackGain(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.removeItem("REPLAYGAIN_TRACK_GAIN");
        } else {
            const text = `${value.toFixed(2)} dB`;
            this.setStringValue("REPLAYGAIN_TRACK_GAIN", text);
        }
    }

    /** @inheritDoc via REPLAYGAIN_TRACK_PEAK item */
    get replayGainTrackPeak(): number {
        const text: string = this.getStringValue("REPLAYGAIN_TRACK_PEAK");
        return text ? Number.parseFloat(text) : NaN;
    }
    /** @inheritDoc via REPLAYGAIN_TRACK_PEAK item */
    set replayGainTrackPeak(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.removeItem("REPLAYGAIN_TRACK_PEAK");
        } else {
            const text = value.toFixed(6).toString();
            this.setStringValue("REPLAYGAIN_TRACK_PEAK", text);
        }
    }

    /** @inheritDoc via REPLAYGAIN_ALBUM_GAIN item */
    get replayGainAlbumGain(): number {
        let text = this.getStringValue("REPLAYGAIN_ALBUM_GAIN");
        if (!text) { return NaN; }
        if (text.toLowerCase().endsWith("db")) {
            text = text.substr(0, text.length - 2).trim();
        }

        return Number.parseFloat(text);
    }
    /** @inheritDoc via REPLAYGAIN_ALBUM_GAIN item */
    set replayGainAlbumGain(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.removeItem("REPLAYGAIN_ALBUM_GAIN");
        } else {
            const text = `${value.toFixed(2).toString()} dB`;
            this.setStringValue("REPLAYGAIN_ALBUM_GAIN", text);
        }
    }

    /** @inheritDoc via REPLAYGAIN_ALBUM_PEAK item */
    get replayGainAlbumPeak(): number {
        const text: string = this.getStringValue("REPLAYGAIN_ALBUM_PEAK");
        return text ? Number.parseFloat(text) : NaN;
    }
    /** @inheritDoc via REPLAYGAIN_ALBUM_PEAK item */
    set replayGainAlbumPeak(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.removeItem("REPLAYGAIN_ALBUM_PEAK");
        } else {
            const text = value.toFixed(6).toString();
            this.setStringValue("REPLAYGAIN_ALBUM_PEAK", text);
        }
    }

    /** @inheritDoc via Cover Art items */
    get pictures(): IPicture[] {
        // TODO: Parse pictures either lazily (see xiph) or at tag parsing
        const pictures = [];
        for (const item of this._items) {
            if (!item || item.type !== ApeTagItemType.Binary) {
                continue;
            }

            const comparison = (e: string): boolean => StringComparison.caseInsensitive(item.key, e);
            const pictureTypeId = ApeTag.PICTURE_ITEM_NAMES.findIndex(comparison);
            if (pictureTypeId < 0) {
                continue;
            }

            const descriptionEndIndex = item.value.find(ByteVector.getTextDelimiter(StringType.UTF8));
            if (descriptionEndIndex < 0) {
                continue;
            }

            const pic = Picture.fromData(item.value.subarray(descriptionEndIndex + 1));
            pic.description = item.value.subarray(0, descriptionEndIndex).toString(StringType.UTF8);
            pic.type = pictureTypeId !== ApeTag.NOT_PICTURE_ITEM_TYPE_ID ? pictureTypeId : PictureType.NotAPicture;

            pictures.push(pic);
        }

        return pictures;
    }
    /** @inheritDoc via Cover Art items */
    set pictures(value: IPicture[]) {
        ApeTag.PICTURE_ITEM_NAMES.forEach((e) => this.removeItem(e));

        if (!value || value.length === 0) {
            return;
        }

        for (const pic of value) {
            let type = <number> pic.type;
            if (type > ApeTag.NOT_PICTURE_ITEM_TYPE_ID) {
                type = ApeTag.NOT_PICTURE_ITEM_TYPE_ID;
            }
            const name = ApeTag.PICTURE_ITEM_NAMES[type];

            if (this.getItem(name)) {
                continue;
            }

            const data = ByteVector.concatenate(
                ByteVector.fromString(pic.description, StringType.UTF8),
                ByteVector.getTextDelimiter(StringType.UTF8),
                pic.data
            );

            this.setItem(ApeTagItem.fromBinaryValue(name, data));
        }
    }

    /** @inheritDoc */
    public get isEmpty(): boolean { return this._items.length === 0; }

    // #endregion

    // #region Public Methods

    /**
     * Adds a single value to the contents of an item. Creates a new item if one does not exist.
     * @param key Key to use to lookup to item to add `value` to
     * @param value Values to add to item identified by `key`
     */
    public appendStringValue(key: string, value: string): void {
        Guards.notNullOrUndefined(key, "key");
        if (!value) {
            return;
        }

        this.appendStringValues(key, [value]);
    }

    /**
     * Adds a lists of strings to the values stored in a specified item. Creates a new item if one
     * does not already exist.
     * @param key Key to use to lookup the item
     * @param values Values to add to the item
     */
    public appendStringValues(key: string, values: string[]): void {
        Guards.notNullOrUndefined(key, "key");
        if (!values || values.length === 0) {
            return;
        }

        const index = this.getItemIndex(key);

        values = values.filter((v) => !!v);
        if (index >= 0) {
            values.unshift(...this._items[index].text);
        }

        const item = ApeTagItem.fromTextValues(key, ...values);
        if (index >= 0) {
            this._items[index] = item;
        } else {
            this._items.push(item);
        }
    }

    /** @inheritDoc */
    public clear(): void {
        this._items.splice(0, this._items.length);
    }

    public copyTo(target: Tag, overwrite: boolean): void {
        Guards.truthy(target, "target");

        if (target.tagTypes !== TagTypes.Ape) {
            super.copyTo(target, overwrite);
            return;
        }
        const apeTag = <ApeTag> target;

        this._items.filter((i) => overwrite || !apeTag.getItem(i.key))
            .forEach((i) => apeTag.setItem(i.clone()));
    }

    /**
     * Gets an item from the current instance identified by `key`.
     * @param key Identifier for the item to get
     * @returns ApeTagItem Item specified by `key` if it exists, undefined is
     *     returned otherwise
     */
    public getItem(key: string): ApeTagItem {
        Guards.notNullOrUndefined(key, "key");
        return this._items.find((e) => StringComparison.caseInsensitive(e.key, key));
    }

    /**
     * Determines if any items with the specified `key` exist in the current instance.
     * @param key Identifier for looking up a matching item
     * @returns boolean `true` if an item with the specified key exists, `false` otherwise
     */
    public hasItem(key: string): boolean {
        Guards.notNullOrUndefined(key, "key");
        return this.getItemIndex(key) >= 0;
    }

    /**
     * Removes all items from the current instance with the specified `key`.
     * @param key Identifier of the items to remove.
     */
    public removeItem(key: string): void {
        // NOTE: This removal is done in-place to avoid upsetting people who have a reference to
        //    the item list.
        Guards.notNullOrUndefined(key, "key");

        for (let i = this._items.length - 1 ; i >= 0; i--) {
            if (StringComparison.caseInsensitive(this._items[i].key, key)) {
                this._items.splice(i, 1);
            }
        }
    }

    /**
     * Renders the current instance as a raw APEv2 tag.
     * @returns ByteVector Bytes that represent the current instance
     */
    public render(): ByteVector {
        // Start by rendering the items
        const renderedItems = this._items.map((i) => i.render());
        const data = ByteVector.concatenate(...renderedItems);

        // Store data about the tag in the footer(/header)
        this._footer.itemCount = renderedItems.length;
        this._footer.itemSize = data.length;
        this.isHeaderPresent = true;

        // Add the header/footer
        return ByteVector.concatenate(
            this._footer.renderHeader(),
            ... renderedItems,
            this._footer.renderFooter()
        );
    }

    /**
     * Adds an item to the current instance, replacing an existing one with the same key.
     * @param item Item to add to the current instance
     */
    public setItem(item: ApeTagItem): void {
        Guards.truthy(item, "item");

        const index = this.getItemIndex(item.key);
        if (index >= 0) {
            this._items[index] = item;
        } else {
            this._items.push(item);
        }
    }

    /**
     * Stores a number in a specified item. If both `numerator` and
     * `denominator` are provided the item will be set to `numerator/denominator`. If
     * neither `numerator` nor `denominator` are provided, the item will be
     * removed from this tag. A new item is created if one with the specified `key` does
     * not exist.
     * @param key Identifier for the item to set the item
     * @param numerator Whole number of top half of the fraction if `denominator` is
     *     provided
     * @param denominator Bottom half of the fraction to store. Can be `undefined` if only
     *     `numerator` is needed.
     */
    public setNumericValue(key: string, numerator: number, denominator: number): void {
        Guards.notNullOrUndefined(key, "key");
        Guards.uint(numerator, "numerator");
        Guards.uint(denominator, "denominator");

        if (numerator === 0 && denominator === 0) {
            this.removeItem(key);
        } else if (denominator !== 0) {
            this.setStringValue(key, `${numerator}/${denominator}`);
        } else {
            this.setStringValue(key, numerator.toString(10));
        }
    }

    /**
     * Stores a string in the item specified by `key`. This will replace the contents of
     * the specified item. If `value` is falsy, the item will be removed.
     * @param key Item to set the value of
     * @param value String to store in the item. If falsy, the specified item will be removed
     */
    public setStringValue(key: string, value: string): void {
        Guards.notNullOrUndefined(key, "key");

        if (!value) {
            this.removeItem(key);
        } else {
            this.setStringValues(key, [value]);
        }
    }

    /**
     * Stores a list of strings in the item specified by `key`. This will replace the
     * contents of the specified item. If `value` is falsy or empty, the item will be removed
     * @param key Item to set the value of
     * @param values String to store in the item. If falsy or empty, the specified item will be
     *     removed
     */
    public setStringValues(key: string, values: string[]): void {
        Guards.notNullOrUndefined(key, "key");

        if (!values || values.length === 0) {
            this.removeItem(key);
        } else {
            const item = ApeTagItem.fromTextValues(key, ...values.filter((v) => !!v));
            const index = this.getItemIndex(key);
            if (index >= 0) {
                this._items[index] = item;
            } else {
                this._items.push(item);
            }
        }
    }

    // #endregion

    // #region Private Methods

    private getStringValue(key: string): string {
        const item = this.getItem(key);
        return item ? item.toString() : undefined;
    }

    private getStringValues(key: string): string[] {
        const item = this.getItem(key);
        return item ? item.text : [];
    }

    private getUint32Value(key: string, index: number): number {
        const text = this.getStringValue(key);
        if (!text) {
            return 0;
        }

        const values = text.split("/", index + 2);
        if (values.length < index + 1) {
            return 0;
        }

        const uint = Number.parseInt(values[index], 10);
        return Number.isNaN(uint) || uint < 0
            ? 0
            : uint;
    }

    private getItemIndex(key: string): number {
        return this._items.findIndex((e) => StringComparison.caseInsensitive(e.key, key));
    }

    private parse(data: ByteVector): void {
        try {
            let pos = 0;

            // 11 Bytes is the minimum size for an APE item
            for (let i = 0; i < this._footer.itemCount && pos <= data.length - 11; i++) {
                const item = ApeTagItem.fromData(data, pos);
                this.setItem(item);
                pos += item.size;
            }
        } catch (e: unknown) {
            if (!CorruptFileError.errorIs(e)) {
                throw e;
            }

            // A corrupt item was encountered, consider the tag finished with what was read.
        }
    }

    // #endregion
}
