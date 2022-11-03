import ApeTag from "../ape/apeTag";
import CombinedTag from "../combinedTag";
import Id3v2Settings from "../id3v2/id3v2Settings";
import Id3v1Tag from "../id3v1/id3v1Tag";
import Id3v2Tag from "../id3v2/id3v2Tag";
import Id3v2TagFooter from "../id3v2/id3v2TagFooter";
import TagParser from "./tagParsers";
import {ApeTagFooter} from "../ape/apeTagFooter";
import {ByteVector} from "../byteVector";
import {CorruptFileError, UnsupportedFormatError} from "../errors";
import {File, ReadStyle} from "../file";
import {Id3v2TagHeaderFlags} from "../id3v2/id3v2TagHeader";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * Provides support for accessing and modifying a collection of tags appearing at the end of a
 * file.
 * This class is used by {@link SandwichFile} to read all tags appearing at the end of the file
 * but could be used by other classes. It currently supports ID3v1, ID3v2, and APE tags.
 */
export default class EndTag extends CombinedTag {
    public static readonly SUPPORTED_TAG_TYPES: TagTypes = TagTypes.Ape | TagTypes.Id3v1 | TagTypes.Id3v2;

    /**
     * Constructs and initializes a new instance of an end tab by reading a file from the end until
     * non-tag contents are found.
     * @param file File to read the tags from
     * @param readStyle
     */
    public constructor(file: File, readStyle: ReadStyle) {
        super(EndTag.SUPPORTED_TAG_TYPES, true);

        Guards.truthy(file, "file");
        this.read(file, readStyle);
    }

    // #region Public Methods

    /** @inheritDoc */
    public createTag(type: TagTypes, copy: boolean): Tag {
        this.validateTagCreation(type);

        let tag: Tag;
        switch (type) {
            case TagTypes.Ape:
                tag = ApeTag.fromEmpty();
                break;
            case TagTypes.Id3v1:
                tag = Id3v1Tag.fromEmpty();
                break;
            case TagTypes.Id3v2:
                // ID3v2 tags must be told to write a footer
                const id3v2Tag = Id3v2Tag.fromEmpty();
                // @TODO: have default version be configurable
                id3v2Tag.version = 4;
                id3v2Tag.flags |= Id3v2TagHeaderFlags.FooterPresent;
                tag = id3v2Tag;
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
     * Renders the tags contained in the current instance. ID3v1 tag always goes at the end.
     * @returns ByteVector Physical representation of the tags stored in the current instance
     */
    public render(): ByteVector {
        // Note: by sorting these in reverse order, we ensure that ID3v1 is rendered at the end
        const tagBytes = this.tags.sort((t1, t2) => t2.tagTypes - t1.tagTypes)
            .map((t) => (<ApeTag|Id3v1Tag|Id3v2Tag> t).render());
        return ByteVector.concatenate(... tagBytes);
    }

    // #endregion

    private read(file: File, style: ReadStyle): void {
        const parser = new EndTagParser(file, style);
        const tags = [];
        while (parser.read()) {
            tags.push(parser.currentTag);
        }

        // HACK: We want to make sure ID3v1 tags go at the back of the list. ID3v1 will truncate
        //    the contents of fields, so we need to make sure it is not preferentially chosen.
        tags.sort((t1, t2) => t2.tagTypes - t1.tagTypes)
            .forEach((t) => this.addTag(t));
    }
}

/**
 * Class for parsing sequential tags at the end of the file.
 * @internal
 */
class EndTagParser extends TagParser {
    // Size of the block to read when looking for a tag footer, this must be large enough to
    // contain the largest footer identifier (at the time of writing, this is ID3v1)
    private static readonly READ_SIZE = Math.max(
        ApeTagFooter.SIZE,
        Id3v2Settings.footerSize,
        Id3v1Tag.TOTAL_SIZE
    );
    private static readonly IDENTIFIER_MAPPINGS = [
        {
            action: (f: File, p: number) => ApeTag.fromFile(f, p),
            identifier: ApeTagFooter.FILE_IDENTIFIER,
            offset: ApeTagFooter.SIZE,
        },
        {
            action: (f: File, p: number, rs: ReadStyle) => Id3v2Tag.fromFileEnd(f, p + Id3v2Settings.footerSize, rs),
            identifier: Id3v2TagFooter.FILE_IDENTIFIER,
            offset: Id3v2Settings.footerSize
        },
        {
            action: (f: File, p: number) => Id3v1Tag.fromFile(f, p),
            identifier: Id3v1Tag.FILE_IDENTIFIER,
            offset: Id3v1Tag.TOTAL_SIZE
        }
    ];

    public constructor(file: File, readStyle: ReadStyle) {
        super(file, readStyle, Math.max(file.length - EndTagParser.READ_SIZE, 0));
    }

    public read(): boolean {
        try {
            // This check lets us more gracefully handle files that have <128 bytes of media
            let readSize = EndTagParser.READ_SIZE;
            if (this.fileOffset < 0) {
                const overflow = this.fileOffset * -1;
                this.fileOffset = 0;
                readSize -= overflow;
            }

            // Read a footer from the file
            this.file.seek(this.fileOffset);
            const tagFooterBlock = this.file.readBlock(readSize);

            // Check for any identifiers of a tag
            for (const mapping of EndTagParser.IDENTIFIER_MAPPINGS) {
                // If we don't have enough bytes to check for this mapping, skip it
                if (mapping.offset > tagFooterBlock.length) {
                    continue;
                }

                // Calculate how far from the end of the block to check
                const offset = tagFooterBlock.length - mapping.offset;
                if (tagFooterBlock.containsAt(mapping.identifier, offset)) {
                    this.currentTag = mapping.action(this.file, this.fileOffset + offset, this.readStyle);
                    this.fileOffset -= this.currentTag.sizeOnDisk;
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
