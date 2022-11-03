import {NotSupportedError} from "./errors";
import {IPicture} from "./picture";
import {Tag, TagTypes} from "./tag";
import {Guards, NumberUtils} from "./utils";

/**
 * This class provides a unified way of accessing tag data from multiple tag types.
 */
export default abstract class CombinedTag extends Tag {
    private readonly _supportedTagTypes: TagTypes;
    private readonly _tags: Tag[];
    private readonly _writeToAll: boolean;

    /**
     * Constructs and initializes a new instance of {@link CombinedTag}.
     * @param supportedTagTypes Types of tags that are supported by this instance of the combined
     * @param writeToAllTags Whether to write to all tags in the instance (`true`) or to the first
     *     tag in the instance (`false`).
     * @param tags Optionally, a list of tags to combine in the new instance.
     */
    protected constructor(supportedTagTypes: TagTypes, writeToAllTags: boolean, tags?: Tag[]) {
        super();
        this._supportedTagTypes = supportedTagTypes;
        this._tags = tags ? tags.slice(0) : [];
        this._writeToAll = writeToAllTags;
    }

    // #region Properties

    /**
     * Gets all tags contained within the current instance. If the tags within this tag are also
     * {@link CombinedTag}s, the retrieval will recurse and return a flat list of nested tags.
     * @remarks Modifications of the returned array will not be retained.
     */
    public get tags(): Tag[] {
        return this._tags.reduce<Tag[]>((accum, tag) => {
            if (tag instanceof CombinedTag) {
                accum.push(... tag.tags);
            } else {
                accum.push(tag);
            }
            return accum;
        }, []);
    }

    /**
     * Gets the types of tags that are supported by this instance of a combined tag. Only these tag
     * types can be added to the instance.
     */
    public get supportedTagTypes(): TagTypes { return this._supportedTagTypes; }

    /** @inheritDoc */
    public get tagTypes(): TagTypes {
        return this._tags.filter((t) => !!t).reduce((types, t) => types | t.tagTypes, TagTypes.None);
    }

    /**
     * @inheritDoc
     * @remarks Note that tags may not appear contiguously in a file. Access the {@link tags}
     *     contained in this object to see the size of each tag on the disk.
     */
    public get sizeOnDisk(): number {
        return this._tags.filter((t) => !!t).reduce((totalBytes, t) => totalBytes + t.sizeOnDisk, 0);
    }

    /** @inheritDoc */
    public get title(): string { return this.getFirstValue((t) => t.title); }
    /** @inheritDoc */
    public set title(val: string) { this.setValues((t, v) => { t.title = v; }, val); }

    /** @inheritDoc */
    public get titleSort(): string { return this.getFirstValue((t) => t.titleSort); }
    /** @inheritDoc */
    public set titleSort(val: string) { this.setValues((t, v) => { t.titleSort = v; }, val); }

    /** @inheritDoc */
    public get subtitle(): string { return this.getFirstValue((t) => t.subtitle); }
    /** @inheritDoc */
    public set subtitle(val: string) { this.setValues((t, v) => { t.subtitle = v; }, val); }

    /** @inheritDoc */
    public get description(): string { return this.getFirstValue((t) => t.description); }
    /** @inheritDoc */
    public set description(val: string) { this.setValues((t, v) => { t.description = v; }, val); }

    /** @inheritDoc */
    public get performers(): string[] { return this.getFirstArray((t) => t.performers); }
    /** @inheritDoc */
    public set performers(val: string[]) { this.setValues((t, v) => { t.performers = v; }, val); }

    /** @inheritDoc */
    public get performersSort(): string[] { return this.getFirstArray((t) => t.performersSort); }
    /** @inheritDoc */
    public set performersSort(val: string[]) { this.setValues((t, v) => { t.performersSort = v; }, val); }

    /** @inheritDoc */
    public get performersRole(): string[] { return this.getFirstArray((t) => t.performersRole); }
    /** @inheritDoc */
    public set performersRole(val: string[]) { this.setValues((t, v) => { t.performersRole = v; }, val); }

    /** @inheritDoc */
    public get albumArtists(): string[] { return this.getFirstArray((t) => t.albumArtists); }
    /** @inheritDoc */
    public set albumArtists(val: string[]) { this.setValues((t, v) => { t.albumArtists = v; }, val); }

    /** @inheritDoc */
    public get albumArtistsSort(): string[] { return this.getFirstArray((t) => t.albumArtistsSort); }
    /** @inheritDoc */
    public set albumArtistsSort(val: string[]) { this.setValues((t, v) => { t.albumArtistsSort = v; }, val); }

    /** @inheritDoc */
    public get composers(): string[] { return this.getFirstArray((t) => t.composers); }
    /** @inheritDoc */
    public set composers(val: string[]) { this.setValues((t, v) => { t.composers = v; }, val); }

    /** @inheritDoc */
    public get composersSort(): string[] { return this.getFirstArray((t) => t.composersSort); }
    /** @inheritDoc */
    public set composersSort(val: string[]) { this.setValues((t, v) => { t.composersSort = v; }, val); }

    /** @inheritDoc */
    public get album(): string { return this.getFirstValue((t) => t.album); }
    /** @inheritDoc */
    public set album(val: string) { this.setValues((t, v) => { t.album = v; }, val); }

    /** @inheritDoc */
    public get albumSort(): string { return this.getFirstValue((t) => t.albumSort); }
    /** @inheritDoc */
    public set albumSort(val: string) { this.setValues((t, v) => { t.albumSort = v; }, val); }

    /** @inheritDoc */
    public get comment(): string { return this.getFirstValue((t) => t.comment); }
    /** @inheritDoc */
    public set comment(val: string) { this.setValues((t, v) => { t.comment = v; }, val); }

    /** @inheritDoc */
    public get genres(): string[] { return this.getFirstArray((t) => t.genres); }
    /** @inheritDoc */
    public set genres(val: string[]) { this.setValues((t, v) => { t.genres = v; }, val); }

    /** @inheritDoc */
    public get year(): number { return this.getFirstValue((t) => t.year, 0); }
    /** @inheritDoc */
    public set year(val: number) { this.setUint((t, v) => { t.year = v; }, val); }

    /** @inheritDoc */
    public get track(): number { return this.getFirstValue((t) => t.track, 0); }
    /** @inheritDoc */
    public set track(val: number) { this.setUint((t, v) => { t.track = v; }, val); }

    /** @inheritDoc */
    public get trackCount(): number { return this.getFirstValue((t) => t.trackCount, 0); }
    /** @inheritDoc */
    public set trackCount(val: number) { this.setUint((t, v) => { t.trackCount = v; }, val); }

    /** @inheritDoc */
    public get disc(): number { return this.getFirstValue((t) => t.disc, 0); }
    /** @inheritDoc */
    public set disc(val: number) { this.setUint((t, v) => { t.disc = v; }, val); }

    /** @inheritDoc */
    public get discCount(): number { return this.getFirstValue((t) => t.discCount, 0); }
    /** @inheritDoc */
    public set discCount(val: number) { this.setUint((t, v) => { t.discCount = v; }, val); }

    /** @inheritDoc */
    public get lyrics(): string { return this.getFirstValue((t) => t.lyrics); }
    /** @inheritDoc */
    public set lyrics(val: string) { this.setValues((t, v) => { t.lyrics = v; }, val); }

    /** @inheritDoc */
    public get grouping(): string { return this.getFirstValue((t) => t.grouping); }
    /** @inheritDoc */
    public set grouping(val: string) { this.setValues((t, v) => { t.grouping = v; }, val); }

    /** @inheritDoc */
    public get beatsPerMinute(): number { return this.getFirstValue((t) => t.beatsPerMinute, 0); }
    /** @inheritDoc */
    public set beatsPerMinute(val: number) { this.setUint((t, v) => { t.beatsPerMinute = v; }, val); }

    /** @inheritDoc */
    public get conductor(): string { return this.getFirstValue((t) => t.conductor); }
    /** @inheritDoc */
    public set conductor(val: string) { this.setValues((t, v) => { t.conductor = v; }, val); }

    /** @inheritDoc */
    public get copyright(): string { return this.getFirstValue((t) => t.copyright); }
    /** @inheritDoc */
    public set copyright(val: string) { this.setValues((t, v) => { t.copyright = v; }, val); }

    /** @inheritDoc */
    public get dateTagged(): Date { return this.getFirstValue((t) => t.dateTagged); }
    /** @inheritDoc */
    public set dateTagged(val: Date) { this.setValues((t, v) => { t.dateTagged = v; }, val); }

    /** @inheritDoc */
    public get musicBrainzArtistId(): string { return this.getFirstValue((t) => t.musicBrainzArtistId); }
    /** @inheritDoc */
    public set musicBrainzArtistId(val: string) { this.setValues((t, v) => { t.musicBrainzArtistId = v; }, val); }

    /** @inheritDoc */
    public get musicBrainzReleaseGroupId(): string { return this.getFirstValue((t) => t.musicBrainzReleaseGroupId); }
    /** @inheritDoc */
    public set musicBrainzReleaseGroupId(val: string) {
        this.setValues((t, v) => { t.musicBrainzReleaseGroupId = v; }, val);
    }

    /** @inheritDoc */
    public get musicBrainzReleaseId(): string { return this.getFirstValue((t) => t.musicBrainzReleaseId); }
    /** @inheritDoc */
    public set musicBrainzReleaseId(val: string) { this.setValues((t, v) => { t.musicBrainzReleaseId = v; }, val); }

    /** @inheritDoc */
    public get musicBrainzReleaseArtistId(): string { return this.getFirstValue((t) => t.musicBrainzReleaseArtistId); }
    /** @inheritDoc */
    public set musicBrainzReleaseArtistId(val: string) {
        this.setValues((t, v) => { t.musicBrainzReleaseArtistId = v; }, val);
    }

    /** @inheritDoc */
    public get musicBrainzTrackId(): string { return this.getFirstValue((t) => t.musicBrainzTrackId); }
    /** @inheritDoc */
    public set musicBrainzTrackId(val: string) { this.setValues((t, v) => { t.musicBrainzTrackId = v; }, val); }

    /** @inheritDoc */
    public get musicBrainzDiscId(): string { return this.getFirstValue((t) => t.musicBrainzDiscId); }
    /** @inheritDoc */
    public set musicBrainzDiscId(val: string) { this.setValues((t, v) => { t.musicBrainzDiscId = v; }, val); }

    /** @inheritDoc */
    public get musicIpId(): string { return this.getFirstValue((t) => t.musicIpId); }
    /** @inheritDoc */
    public set musicIpId(val: string) { this.setValues((t, v) => { t.musicIpId = v; }, val); }

    /** @inheritDoc */
    public get amazonId(): string { return this.getFirstValue((t) => t.amazonId); }
    /** @inheritDoc */
    public set amazonId(val: string) { this.setValues((t, v) => { t.amazonId = v; }, val); }

    /** @inheritDoc */
    public get musicBrainzReleaseStatus(): string { return this.getFirstValue((t) => t.musicBrainzReleaseStatus); }
    /** @inheritDoc */
    public set musicBrainzReleaseStatus(val: string) {
        this.setValues((t, v) => { t.musicBrainzReleaseStatus = v; }, val);
    }

    /** @inheritDoc */
    public get musicBrainzReleaseType(): string { return this.getFirstValue((t) => t.musicBrainzReleaseType); }
    /** @inheritDoc */
    public set musicBrainzReleaseType(val: string) {
        this.setValues((t, v) => { t.musicBrainzReleaseType = v; }, val);
    }

    /** @inheritDoc */
    public get musicBrainzReleaseCountry(): string { return this.getFirstValue((t) => t.musicBrainzReleaseCountry); }
    /** @inheritDoc */
    public set musicBrainzReleaseCountry(val: string) {
        this.setValues((t, v) => { t.musicBrainzReleaseCountry = v; }, val);
    }

    /** @inheritDoc */
    public get replayGainTrackGain(): number { return this.getFirstValue((t) => t.replayGainTrackGain, NaN); }
    /** @inheritDoc */
    public set replayGainTrackGain(val: number) { this.setValues((t, v) => { t.replayGainTrackGain = v; }, val); }

    /** @inheritDoc */
    public get replayGainTrackPeak(): number { return this.getFirstValue((t) => t.replayGainTrackPeak, NaN); }
    /** @inheritDoc */
    public set replayGainTrackPeak(val: number) { this.setValues((t, v) => { t.replayGainTrackPeak = v; }, val); }

    /** @inheritDoc */
    public get replayGainAlbumGain(): number { return this.getFirstValue((t) => t.replayGainAlbumGain, NaN); }
    /** @inheritDoc */
    public set replayGainAlbumGain(val: number) { this.setValues((t, v) => { t.replayGainAlbumGain = v; }, val); }

    /** @inheritDoc */
    public get replayGainAlbumPeak(): number { return this.getFirstValue((t) => t.replayGainAlbumPeak, NaN); }
    /** @inheritDoc */
    public set replayGainAlbumPeak(val: number) { this.setValues((t, v) => { t.replayGainAlbumPeak = v; }, val); }

    /** @inheritDoc */
    public get initialKey(): string { return this.getFirstValue((t) => t.initialKey); }
    /** @inheritDoc */
    public set initialKey(val: string) { this.setValues((t, v) => { t.initialKey = v; }, val); }

    /** @inheritDoc */
    public get remixedBy(): string { return this.getFirstValue((t) => t.remixedBy); }
    /** @inheritDoc */
    public set remixedBy(val: string) { this.setValues((t, v) => { t.remixedBy = v; }, val); }

    /** @inheritDoc */
    public get publisher(): string { return this.getFirstValue((t) => t.publisher); }
    /** @inheritDoc */
    public set publisher(val: string) { this.setValues((t, v) => { t.publisher = v; }, val); }

    /** @inheritDoc */
    public get isrc(): string { return this.getFirstValue((t) => t.isrc); }
    /** @inheritDoc */
    public set isrc(val: string) { this.setValues((t, v) => { t.isrc = v; }, val); }

    /** @inheritDoc */
    public get pictures(): IPicture[] { return this.getFirstArray((t) => t.pictures); }
    /** @inheritDoc */
    public set pictures(val: IPicture[]) { this.setValues((t, v) => { t.pictures = v; }, val); }

    /** @inheritDoc */
    public get isCompilation(): boolean { return this.getFirstValue((t) => t.isCompilation); }
    /** @inheritDoc */
    public set isCompilation(val: boolean) { this.setValues((t, v) => { t.isCompilation = v; }, val); }

    /** @inheritDoc */
    public get isEmpty(): boolean {
        return this._tags.every((t) => t.isEmpty);
    }

    // #endregion

    /**
     * @inheritDoc
     * Clears all child tags.
     */
    public clear(): void {
        this._tags.forEach((t) => t.clear());
    }

    /**
     * Creates a new instance of the desired tag type and adds it to the current instance. If the
     * tag type is unsupported in the current context or the tag type already exists, an error will
     * be thrown.
     * @param tagType Type of tag to create
     * @param copy Whether or not to copy the contents of the current instance to the newly created
     *     tag instance
     * @returns Tag The newly created tag
     */
    public abstract createTag(tagType: TagTypes, copy: boolean): Tag;

    /**
     * Gets a tag of the specified tag type if a matching tag exists in the current instance.
     * @param tagType Type of tag to retrieve
     * @returns Tag Tag with specified type, if it exists. `undefined` otherwise.
     */
    public getTag<TTag extends Tag>(tagType: TagTypes): TTag {
        // Make sure the tag type can possibly be stored here
        if (!NumberUtils.hasFlag(this._supportedTagTypes, tagType)) {
            return undefined;
        }

        // Look for the tag, recurse if necessary
        for (const tag of this._tags) {
            if (tag instanceof CombinedTag) {
                const foundTag = tag.getTag(tagType);
                if (foundTag) {
                    return <TTag> foundTag;
                }
            } else if (tag.tagTypes === tagType) {
                return <TTag> tag;
            }
        }

        return undefined;
    }

    /**
     * Remove all tags that match the specified tagTypes. This is performed recursively. Any nested
     * `CombinedTag` instances are left in place.
     * @param tagTypes Types of tags to remove
     */
    public removeTags(tagTypes: TagTypes): void {
        for (let i = this._tags.length - 1; i >= 0; i--) {
            const tag = this._tags[i];

            if (NumberUtils.hasFlag(tag.tagTypes, tagTypes)) {
                if (tag instanceof CombinedTag) {
                    tag.removeTags(tagTypes);
                } else {
                    this._tags.splice(i, 1);
                }
            }
        }
    }

    // #region Protected/Private Methods

    protected addTag(tag: Tag): void {
        if (tag) {
            this._tags.push(tag);
        }
    }

    /**
     * This is used for special cases where the order of tags is important.
     * @protected
     */
    protected replaceTag(oldTag: Tag, newTag: Tag): void {
        const index = this._tags.indexOf(oldTag);
        this._tags.splice(index, 1, newTag);
    }

    /**
     * Verifies if a tag can be added to the current instance. The criteria for validation are:
     * * A tag of the given tag type does not already exist
     * * The given tag type is supported by the current instance
     * @param tagType Tag type that the caller wants to create
     */
    protected validateTagCreation(tagType: TagTypes): void {
        if (!NumberUtils.hasFlag(this._supportedTagTypes, tagType)) {
            throw new NotSupportedError(`Tag of type ${tagType} is not supported on this CombinedTag`);
        }
        if (NumberUtils.hasFlag(this.tagTypes, tagType)) {
            throw new Error(`Cannot create tag of type ${tagType} because one already exists`);
        }
    }

    private getFirstArray<T>(propertyFn: (t: Tag) => T[]): T[] {
        const tagWithProperty = this._tags.find((t) => {
           if (!t) { return false; }
           const val = propertyFn(t);
           return val !== undefined && val !== null && val.length > 0;
        });
        return tagWithProperty ? propertyFn(tagWithProperty) : [];
    }

    private getFirstValue<T>(propertyFn: (t: Tag) => T, defaultValue?: T): T {
        const tagWithProperty = this._tags.find((t) => {
            if (!t) { return false; }
            const val = propertyFn(t);
            return val !== undefined && val !== null && val !== defaultValue;
        });
        return tagWithProperty ? propertyFn(tagWithProperty) : defaultValue;
    }

    private setUint(propertyFn: (t: Tag, val: number) => void, val: number): void {
        Guards.uint(val, "val");

        if (this._writeToAll) {
            this._tags.forEach((t) => { propertyFn(t, val); });
        } else {
            if (this._tags.length > 0) {
                propertyFn(this._tags[0], val);
            }
        }
    }

    private setValues<T>(propertyFn: (t: Tag, val: T) => void, val: T): void {
        if (this._writeToAll) {
            this._tags.forEach((t) => { propertyFn(t, val); });
        } else {
            if (this._tags.length > 0) {
                propertyFn(this._tags[0], val);
            }
        }
    }

    // #endregion
}
