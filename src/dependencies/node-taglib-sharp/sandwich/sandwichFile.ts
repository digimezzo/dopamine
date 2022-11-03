import EndTag from "./endTag";
import SandwichTag from "./sandwichTag";
import Settings from "../settings";
import StartTag from "./startTag";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {Properties} from "../properties";
import {Tag, TagTypes} from "../tag";
import {NumberUtils} from "../utils";

export interface ISandwichFile {
    readonly mediaEndPosition: number;
    readonly mediaStartPosition: number;
}

/**
 * Abstract class that provides tagging and properties for files that can have tags at the
 * beginning and/or end of the file. The tags are added generically and are not part of the media
 * format. As such, the tags sandwich the media.
 * @remarks This was called `NonContainer` in the original .NET implementation, implying that files
 *     utilizing this pattern could not be containers. This is not true - MPEG containers, for
 *     example, use this pattern. Therefore the name was changed to better represent the situation.
 */
export default abstract class SandwichFile extends File implements ISandwichFile {
    private readonly _properties: Properties;
    private readonly _tag: SandwichTag;
    private _mediaEndPosition: number;
    private _mediaStartPosition: number;

    protected constructor(
        fileToRead: IFileAbstraction | string,
        readStyle: ReadStyle,
        defaultTagMappingTable: Map<TagTypes, () => boolean>,
        defaultTags: TagTypes
    ) {
        super(fileToRead);

        // Read existing tags and properties
        this.mode = FileAccessMode.Read;
        try {
            this._tag = new SandwichTag(this, readStyle, defaultTagMappingTable);
            this._mediaStartPosition = this.startTag.sizeOnDisk;
            this._mediaEndPosition = this.length - this.endTag.sizeOnDisk;
            this._properties = this.readProperties(readStyle);
            this.tagTypesOnDisk = this.tagTypes;
        } finally {
            this.mode = FileAccessMode.Closed;
        }

        // Create the default tags
        for (const tagType of defaultTagMappingTable.keys()) {
            // Don't create tag if it's not desired or already exists
            const isDefault = NumberUtils.hasFlag(defaultTags, tagType);
            const existsAlready = NumberUtils.hasFlag(this._tag.tagTypes, tagType);
            if (!isDefault || existsAlready) {
                continue;
            }

            // Tag is expected to exist
            this._tag.createTag(tagType, Settings.copyExistingTagsToNewDefaultTags);
        }
    }

    // #region Properties

    /**
     * Gets the collection of tags appearing at the end of the file.
     */
    protected get endTag(): EndTag { return this._tag.endTag; }

    /**
     * Gets the collection of tags appearing at the start of the file.
     */
    protected get startTag(): StartTag { return this._tag.startTag; }

    /**
     * Gets the position at which the media content of this file ends.
     */
    get mediaEndPosition(): number {
        return this._mediaEndPosition;
    }

    /**
     * Gets the position at which the media content of this file starts.
     */
    get mediaStartPosition(): number {
        return this._mediaStartPosition;
    }

    /**
     * Gets an abstract representation of all tags stored in the current instance.
     */
    public get tag(): SandwichTag { return this._tag; }

    /**
     * Gets the media properties of the file represented by the current instance.
     */
    public get properties(): Properties { return this._properties; }

    // #endregion

    // #region Public Methods

    /** @inheritDoc */
    public getTag(type: TagTypes, create: boolean): Tag {
        // Try to get the tag in question
        const tag = this._tag.getTag(type);
        if (tag || !create) {
            return tag;
        }

        // Tag could not be found, create one
        return this._tag.createTag(type, false);
    }

    /** @inheritDoc */
    public removeTags(types: TagTypes): void {
        this._tag.removeTags(types);
    }

    /** @inheritDoc */
    public save(): void {
        this.preSave();
        this.mode = FileAccessMode.Write;

        try {
            // Render the end tag and store it at the end of the file
            const endTagBytes = this.endTag.render();
            const endBytesToRemove = this.length - this._mediaEndPosition;
            this.insert(endTagBytes, this._mediaEndPosition, endBytesToRemove);

            // Render the start tag and store it at the start of the file
            const startTagBytes = this.startTag.render();
            this.insert(startTagBytes, 0, this._mediaStartPosition);

            // Calculate the new media start and end positions
            this._mediaStartPosition = startTagBytes.length;
            this._mediaEndPosition = this.length - endTagBytes.length;
            this.tagTypesOnDisk = this.tagTypes;
        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    // #endregion

    protected abstract readProperties(readStyle: ReadStyle): Properties;
}
