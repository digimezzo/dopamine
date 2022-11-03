import {TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class contains settings related to APE file operations. Open files will need to be re-read
 * in order for changes to take effect.
 */
export default class ApeFileSettings {
    public static readonly SUPPORTED_TAG_TYPES = TagTypes.Ape | TagTypes.Id3v1 | TagTypes.Id3v2;

    private static _defaultTagTypes = TagTypes.Ape;
    private static _preferApeTagAtFileEnd = true;
    private static _preferId3v2TagAtFileEnd = false;

    /**
     * Gets the default types of tags for an APE file. When opening a file, if these tag types do
     * not exist on the file, they will be created.
     */
    public static get defaultTagTypes(): TagTypes { return this._defaultTagTypes; }
    /**
     * Sets the default types of tags for an APE file. When opening a file, if these tag types do
     * not exist on the file, they will be created. See {@link SUPPORTED_TAG_TYPES} for a list of tag
     * types that are supported by node-taglib-sharp for APE files.
     */
    public static set defaultTagTypes(value: TagTypes) {
        const unsupportedTagTypes = NumberUtils.uintAnd(value, ~this.SUPPORTED_TAG_TYPES);
        if (unsupportedTagTypes !== 0) {
            throw new Error(
                `Argument error: node-taglib-sharp does not support tag types ${unsupportedTagTypes} for APE files`
            );
        }

        this._defaultTagTypes = value;
    }

    /**
     * Gets whether or not *new* APE tags should be stored at the end of the file. If `true` new
     * APE tags will be stored at the end of the file. If `false` new APE tags will be stored at
     * the beginning of the file (not recommended). Note, this only affects *new* APE tags.
     * Existing APE tags will not be moved unless removed and re-added.
     * @default `true`
     */
    public static get preferApeTagAtFileEnd(): boolean { return this._preferApeTagAtFileEnd; }
    /**
     * Gets whether or not *new* APE tags should be stored at the end of the file. If `true` new
     * APE tags will be stored at the end of the file. If `false` new APE tags will be stored at
     * the beginning of the file (not recommended). Note, this only affects *new* APE tags.
     * Existing APE tags will not be moved unless removed and re-added.
     * @default `true`
     */
    public static set preferApeTagAtFileEnd(value: boolean) { this._preferApeTagAtFileEnd = value; }

    /**
     * Gets whether or not *new* ID3v2 tags should be stored at the end of the file. If `true` new
     * ID3v2 tags will be stored at the end of the file. If `false` new ID3v2 tags will be stored
     * at the beginning of the file. Note, this only affects *new* ID3v2 tags. Existing ID3v2 tags
     * will not be moved unless removed and re-added.
     * * @remarks In order to store an ID3v2 tag at the end of a file, it must have a tag footer. Tag
     *     footers are only supported in ID3v2.4. If the ID3v2 version is changed, it will cause an
     *     error to be thrown when the tag is rendered.
     * @default `false`
     */
    public static get preferId3v2TagAtFileEnd(): boolean { return this._preferId3v2TagAtFileEnd; }
    /**
     * Sets whether or not *new* ID3v2 tags should be stored at the end of the file. If `true` new
     * ID3v2 tags will be stored at the end of the file. If `false` new ID3v2 tags will be stored
     * at the beginning of the file. Note, this only affects *new* ID3v2 tags. Existing ID3v2 tags
     * will not be moved unless removed and re-added.
     * * @remarks In order to store an ID3v2 tag at the end of a file, it must have a tag footer. Tag
     *     footers are only supported in ID3v2.4. If the ID3v2 version is changed, it will cause an
     *     error to be thrown when the tag is rendered.
     * @default `false`
     */
    public static set preferId3v2TagAtFileEnd(value: boolean) { this._preferId3v2TagAtFileEnd = value; }
}
