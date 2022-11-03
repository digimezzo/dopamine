import CombinedTag from "../combinedTag";
import EndTag from "../sandwich/endTag";
import FlacFileSettings from "./flacFileSettings";
import StartTag from "../sandwich/startTag";
import XiphComment from "../xiph/xiphComment";
import XiphPicture from "../xiph/xiphPicture";
import {IPicture} from "../picture";
import {Tag, TagTypes} from "../tag";
import {Guards, NumberUtils} from "../utils";

/**
 * Collection of tags that can be stored in a FLAC file.
 * @remarks The FLAC file specification states that tagging should be done via a XIPH comment block
 *     and any pictures should be stored in a FLAC picture block. However, tagging can be done via
 *     ID3 and APE tags at the beginning or end of the file, same as MP3 and other files. This
 *     class provides a unified access into all the tags a FLAC file may contain.
 */
export default class FlacTag extends CombinedTag {
    private static readonly DEFAULT_TAG_LOCATION_MAPPING = new Map<TagTypes, () => boolean>([
        [TagTypes.Ape, () => FlacFileSettings.preferApeTagAtFileEnd],
        [TagTypes.Id3v1, () => true],
        [TagTypes.Id3v2, () => FlacFileSettings.preferId3v2TagAtFileEnd]
    ]);

    private readonly _endTag: EndTag;
    private readonly _pictures: IPicture[];
    private readonly _startTag: StartTag;
    private _xiphComment: XiphComment;

    /**
     * Constructs and initializes a new FLAC tag using the component tags provided.
     * @param startTag Required, collection of tags at the start of the file
     * @param endTag Required, collection of tags at the end of the file
     * @param xiphTag Optional, Xiph comment tag from the FLAC file
     * @param flacPictures Optional, array of pictures found in the file
     */
    public constructor(startTag: StartTag, endTag: EndTag, xiphTag: XiphComment, flacPictures: XiphPicture[]) {
        super(FlacFileSettings.SUPPORTED_TAG_TYPES, true);
        Guards.truthy(startTag, "startTag");
        Guards.truthy(endTag, "endTag");

        this._xiphComment = xiphTag;
        this.addTag(this._xiphComment);
        this._startTag = startTag;
        this.addTag(this._startTag);
        this._endTag = endTag;
        this.addTag(this._endTag);
        this._pictures = flacPictures || [];
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

    /** Gets the Xiph comment that is stored in the current instance. */
    public get xiphComment(): XiphComment { return this._xiphComment; }

    /**
     * @inheritDoc
     * For FLAC files, FLAC-style pictures are preferentially returned. If those don't exist the
     * pictures that are stored in the
     */
    public get pictures(): IPicture[] {
        // We want to preferentially get pictures from FLAC picture blocks. If there aren't any,
        // fall back to using pictures from the combined tags
        return this._pictures && this._pictures.length > 0
            ? this._pictures.slice()
            : super.pictures;
    }
    /**
     * @inheritDoc
     * For FLAC files, pictures are preferentially stored in FLAC-style picture blocks.
     */
    public set pictures(value: IPicture[]) {
        // @TODO: Allow config to store pictures in flac only or in combined tags.
        this._pictures.splice(0, this._pictures.length, ...value);
    }

    public get tagTypes(): TagTypes {
        return this._pictures && this._pictures.length > 0
            ? super.tagTypes | TagTypes.FlacPictures
            : super.tagTypes;
    }

    // #endregion

    /** @inheritDoc */
    public clear(): void {
        this._pictures.splice(0, this._pictures.length);
        super.clear();
    }

    /** @inheritDoc */
    public createTag(tagType: TagTypes, copy: boolean): Tag {
        this.validateTagCreation(tagType);

        // Create the desired tag
        let tag: Tag;
        switch (tagType) {
            case TagTypes.Xiph:
                // XIPH comments we create directly
                this._xiphComment = XiphComment.fromEmpty();
                tag = this._xiphComment;
                this.addTag(tag);
                break;
            case TagTypes.Id3v1:
            case TagTypes.Id3v2:
            case TagTypes.Ape:
                // Sandwich tags, we farm out to the start/end tags
                const targetTag = FlacTag.DEFAULT_TAG_LOCATION_MAPPING.get(tagType)() ? this._endTag : this._startTag;
                tag = targetTag.createTag(tagType, false);
        }

        // Copy the contents if desired
        if (copy) {
            this.copyTo(tag, true);
        }

        return tag;
    }

    /** @inheritDoc */
    public removeTags(tagTypes: TagTypes): void {
        if (NumberUtils.hasFlag(tagTypes, TagTypes.Xiph)) {
            this._xiphComment = undefined;
        }
        if (NumberUtils.hasFlag(tagTypes, TagTypes.FlacPictures)) {
            this._pictures.splice(0, this._pictures.length);
        }

        super.removeTags(tagTypes);
    }
}
