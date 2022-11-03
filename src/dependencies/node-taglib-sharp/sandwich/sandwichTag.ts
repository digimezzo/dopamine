import CombinedTag from "../combinedTag";
import EndTag from "./endTag";
import StartTag from "./startTag";
import {File, ReadStyle} from "../file";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * This class represents a file that can have tags at the beginning and/or end of the file. Some
 * file types are fine with tags sandwiching the media contents of the file, but not all file
 * support this.
 * @remarks This was called `NonContainer` in the original .NET implementation, implying that files
 *     utilizing this pattern could not be containers. This is not true - MPEG containers, for
 *     example, use this pattern. Therefore the name was changed to better represent the situation.
 */
export default class SandwichTag extends CombinedTag {
    public static readonly SUPPORTED_TAG_TYPES = TagTypes.Ape | TagTypes.Id3v1 | TagTypes.Id3v2;

    private readonly _defaultTagMappingTable: Map<TagTypes, () => boolean>;
    private readonly _endTag: EndTag;
    private readonly _startTag: StartTag;

    /**
     * Constructs a new instance for a specified file.
     * Constructing a new instance does not automatically read the contents from the disk.
     * {@link read} must be called to read the tags
     * @param file File to read tags from the beginning and end of
     * @param readStyle How in-depth to read the tags from the file
     * @param defaultTagMappingTable Mapping of tag type to boolean function, used to determine
     *     whether a tag type goes into the end tag or start tag
     */
    public constructor(file: File, readStyle: ReadStyle, defaultTagMappingTable: Map<TagTypes, () => boolean>) {
        super(SandwichTag.SUPPORTED_TAG_TYPES, true);

        Guards.truthy(file, "file");
        Guards.truthy(defaultTagMappingTable, "defaultTagMappingTable");

        this._defaultTagMappingTable = defaultTagMappingTable;

        this._startTag = new StartTag(file, readStyle);
        this.addTag(this._startTag);
        this._endTag = new EndTag(file, readStyle);
        this.addTag(this._endTag);
    }

    // #region Properties

    /**
     * Gets the collection of tags appearing at the end of the file.
     */
    public get endTag(): EndTag { return this._endTag; }

    /**
     * Gets the collection of tags appearing at the start of the file.
     */
    public get startTag(): StartTag { return this._startTag; }

    // #endregion

    /** @inheritDoc */
    public createTag(tagType: TagTypes, copy: boolean): Tag {
        this.validateTagCreation(tagType);

        // Determine where the tag goes and create it
        const destinationTag = this._defaultTagMappingTable.get(tagType)() ? this._endTag : this._startTag;
        const newTag = destinationTag.createTag(tagType, false);

        if (copy) {
            this.copyTo(newTag, true);
        }

        return newTag;
    }
}
