import ApeTag from "../ape/apeTag";
import CombinedTag from "../combinedTag";
import Id3v2Tag from "../id3v2/id3v2Tag";
import Id3v2Settings from "../id3v2/id3v2Settings";
import TagParser from "./tagParsers";
import {ApeTagFooter} from "../ape/apeTagFooter";
import {ByteVector} from "../byteVector";
import {CorruptFileError, UnsupportedFormatError} from "../errors";
import {File, ReadStyle} from "../file";
import {Id3v2TagHeader} from "../id3v2/id3v2TagHeader";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * Provides support for accessing and modifying a collection of tags appearing at the start of a
 * file.
 * This class is used by {@link SandwichFile} to read all the tags appearing at the start of the
 * file but could be used by other classes. It currently supports ID3v2 and APE tags.
 */
export default class StartTag extends CombinedTag {
    public static readonly SUPPORTED_TAG_TYPES: TagTypes = TagTypes.Ape | TagTypes.Id3v2;

    /**
     * Constructs and initializes a new instance by reading tags from the beginning of the
     * specified file until non-tag content is found.
     * @param file File on which the new instance will perform its operations
     * @param readStyle How deeply to read the tag and its properties
     */
    public constructor(file: File, readStyle: ReadStyle) {
        super(StartTag.SUPPORTED_TAG_TYPES, true);
        Guards.truthy(file, "file");
        this.read(file, readStyle);
    }

    // #region Public Methods

    /** @inheritDoc */
    public createTag(type: TagTypes, copy: boolean): Tag {
        this.validateTagCreation(type);

        let tag: Tag;
        switch (type) {
            case TagTypes.Id3v2:
                tag = Id3v2Tag.fromEmpty();
                break;
            case TagTypes.Ape:
                const apeTag = ApeTag.fromEmpty();
                apeTag.isHeaderPresent = true;
                tag = apeTag;
                break;
            default:
                throw new UnsupportedFormatError(`Specified tag type ${type} is invalid`);
        }

        if (copy) {
            this.copyTo(tag, true);
        }

        this.addTag(tag);
        return tag;
    }

    /**
     * Renders the tags contained in the current instance.
     * The tags are rendered in the order that they are stored in the current instance.
     * @returns ByteVector Physical representation of the tags stored in the current instance
     */
    public render(): ByteVector {
        const tagData = this.tags.map((t) => (<ApeTag|Id3v2Tag> t).render());
        return ByteVector.concatenate(... tagData);
    }

    // #endregion

    /**
     * Reads the tags stored at the start of the file into the current instance.
     */
    private read(file: File, style: ReadStyle): void {
        const parser = new StartTagParser(file, style);
        while (parser.read()) {
            this.addTag(parser.currentTag);
        }
    }
}

/**
 * Class for parsing sequential tags at the beginning of the file.
 * @internal
 */
class StartTagParser extends TagParser {
    // Size of the block to read when looking for a tag header, this must be large to contain the
    // largest header identifier (at the time of writing, this is APE).
    private static readonly READ_SIZE = Math.max(
        ApeTagFooter.SIZE,
        Id3v2Settings.headerSize
    );
    private static readonly IDENTIFIER_MAPPINGS = [
        {
            action: (f: File, p: number) => ApeTag.fromFile(f, p),
            identifier: ApeTagFooter.FILE_IDENTIFIER,
        },
        {
            action: (f: File, p: number, rs: ReadStyle) => Id3v2Tag.fromFileStart(f, p, rs),
            identifier: Id3v2TagHeader.FILE_IDENTIFIER
        }
    ];

    public constructor(file: File, readStyle: ReadStyle) {
        super(file, readStyle, 0);
    }

    public read(): boolean {
        try {
            // Read a header from the file
            this.file.seek(this.fileOffset);
            const tagHeaderBlock = this.file.readBlock(StartTagParser.READ_SIZE);

            // Check for any identifier of a tag
            for (const mapping of StartTagParser.IDENTIFIER_MAPPINGS) {
                if (tagHeaderBlock.startsWith(mapping.identifier)) {
                    this.currentTag = mapping.action(this.file, this.fileOffset, this.readStyle);
                    this.fileOffset += this.currentTag.sizeOnDisk;
                    return true;
                }
            }
        } catch (e) {
            if (!CorruptFileError.errorIs(e)) {
                throw e;
            }
        }

        return false;
    }
}
