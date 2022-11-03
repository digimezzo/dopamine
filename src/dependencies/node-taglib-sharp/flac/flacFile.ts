import EndTag from "../sandwich/endTag";
import FlacFileSettings from "./flacFileSettings";
import FlacStreamHeader from "./flacStreamHeader";
import FlacTag from "./flacTag";
import Settings from "../settings";
import StartTag from "../sandwich/startTag";
import XiphComment from "../xiph/xiphComment";
import XiphPicture from "../xiph/xiphPicture";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {FlacBlock, FlacBlockType} from "./flacBlock";
import {Properties} from "../properties";
import {ISandwichFile} from "../sandwich/sandwichFile";
import {Tag, TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class extends {@link File} to provide tagging and properties for FLAC audio files.
 * @remarks A FLAC file is usually tagged using a Xiph comment block with pictures stored in
 *     special FLAC picture blocks. Additionally, like many other file types, ID3v1, ID3v2, and APE
 *     tags can be added to used to tag a FLAC file by storing them at the beginning or end of the
 *     file. To control the type of tags that are created by default when opening the file, see
 *     {@link FlacFileSettings}.
 */
export default class FlacFile extends File implements ISandwichFile {
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("fLaC", StringType.Latin1).makeReadOnly();

    private readonly _properties: Properties;
    private readonly _tag: FlacTag;
    private _metadataBlocks: FlacBlock[];
    private _mediaEndPosition: number;
    private _mediaStartPosition: number;

    /**
     * Constructs and initializes a new instance of a FLAC file based on the provided file.
     * @param file File abstraction or path to a file to open as a FLAC file
     * @param propertiesStyle How in-depth to read the properties of the file
     */
    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file);

        this.mode = FileAccessMode.Read;
        try {
            // Read start and end tags to determine the media start/end position
            const startTag = new StartTag(this, propertiesStyle);
            this._mediaStartPosition = startTag.sizeOnDisk;
            const endTag = new EndTag(this, propertiesStyle);
            this._mediaEndPosition = this.length - endTag.sizeOnDisk;

            // Read blocks
            this._metadataBlocks = this.readMetadataBlocks();

            // Read properties, flac pictures, and Xiph comment
            this._properties = this.readProperties(propertiesStyle);
            const pictures = this.readPictures(propertiesStyle);
            const xiphComment = this.readXiphComments(propertiesStyle);

            this._tag = new FlacTag(startTag, endTag, xiphComment, pictures);
            this.tagTypesOnDisk = this._tag.tagTypes;
        } finally {
            this.mode = FileAccessMode.Closed;
        }

        // Create default tags
        // NOTE: We are adding ID3v1 tag last because it is the least flexible and will not store
        //    complete tag information.
        const allTagTypes = [TagTypes.Xiph, TagTypes.Id3v2, TagTypes.Ape, TagTypes.Id3v1];
        for (const tagType of allTagTypes) {
            const isDefaultTag = NumberUtils.hasFlag(FlacFileSettings.defaultTagTypes, tagType);
            const existsAlready = NumberUtils.hasFlag(this._tag.tagTypes, tagType);
            if (!isDefaultTag || existsAlready) {
                continue;
            }

            // Desired tag does not exist, create it
            this._tag.createTag(tagType, Settings.copyExistingTagsToNewDefaultTags);
        }
    }

    // #region Properties

    public get mediaEndPosition(): number { return this._mediaEndPosition; }

    public get mediaStartPosition(): number { return this._mediaStartPosition; }

    public get properties(): Properties { return this._properties; }

    public get tag(): FlacTag { return this._tag; }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public getTag(type: TagTypes, create: boolean): Tag {
        // Try to get the desired tag
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
            // Step 0) Store the old metadata start and stop
            const metadataStart = this._metadataBlocks[0].blockStart;
            const lastMetadataBlock = this._metadataBlocks[this._metadataBlocks.length - 1];
            const metadataEnd = lastMetadataBlock.blockStart + lastMetadataBlock.totalSize;
            const oldMetadataLength = metadataEnd - metadataStart;

            // Step 1) Remove existing Xiph comment and picture blocks
            const blocksToRemove = [FlacBlockType.XiphComment, FlacBlockType.Picture, FlacBlockType.Padding];
            this._metadataBlocks = this._metadataBlocks.filter((b) => blocksToRemove.indexOf(b.type) < 0 );

            // Step 2) Generate blocks for the xiph comment and pictures
            if (this._tag.xiphComment) {
                const xiphCommentBytes = this._tag.xiphComment.render(false);
                const xiphCommentBlock = FlacBlock.fromData(FlacBlockType.XiphComment, xiphCommentBytes);
                this._metadataBlocks.push(xiphCommentBlock);
            }

            if (this._tag.pictures.length > 0) {
                // @TODO: If we allow pictures to go in xiph comment or metadata blocks, figure out
                //     how to determine which goes where.
                for (const picture of this._tag.pictures) {
                    const xiphPicture = picture instanceof XiphPicture ? picture : XiphPicture.fromPicture(picture);
                    const pictureBytes = xiphPicture.renderForFlacBlock();
                    const pictureBlock = FlacBlock.fromData(FlacBlockType.Picture, pictureBytes);
                    this._metadataBlocks.push(pictureBlock);
                }
            }

            // Step 3) Render all metadata blocks in the file
            const metadataBlocksBytes = this._metadataBlocks.map((b) => b.render(false));
            const metadataBytes = ByteVector.concatenate(... metadataBlocksBytes);

            // Step 4) Add padding block as necessary
            let paddingLength: number;
            if (metadataBytes.length < oldMetadataLength) {
                // Case 1: New metadata blocks are smaller than old ones. Use remaining space as padding
                paddingLength = oldMetadataLength - metadataBytes.length - FlacBlock.HEADER_SIZE;
            } else {
                // Case 2: New metadata block is bigger than (or equal to) old ones. Add standard padding
                // @TODO: Allow configuring padding length
                paddingLength = 1024;
            }

            const paddingBlock = FlacBlock.fromData(FlacBlockType.Padding, ByteVector.fromSize(paddingLength));
            this._metadataBlocks.push(paddingBlock);
            metadataBytes.addByteVector(paddingBlock.render(true));

            // Step 5) Write the metadata blocks to the file
            this.insert(metadataBytes, metadataStart, oldMetadataLength);
            const mediaEndDifference = metadataBytes.length - oldMetadataLength;
            this._mediaEndPosition += mediaEndDifference;

            // Step 6) Write out the tags at the end of the file
            const endTagBytes = this._tag.endTag.render();
            const endBytesToRemove = this.length - this._mediaEndPosition;
            this.insert(endTagBytes, this._mediaEndPosition, endBytesToRemove);

            // Step 7) Write out the tags at the start of the file
            const startTagBytes = this._tag.startTag.render();
            this.insert(startTagBytes, 0, this._mediaStartPosition);

            // Step 8) Calculate new start and end positions, update block positions
            this._mediaStartPosition = startTagBytes.length;
            this._mediaEndPosition = this.length - endTagBytes.length;
            this._metadataBlocks.reduce((pos, b) => {
                b.blockStart = pos;
                return pos + b.totalSize;
            }, this._mediaStartPosition + 4);

            this.tagTypesOnDisk = this.tagTypes;

        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    private readMetadataBlocks(): FlacBlock[] {
        // Make sure we've got the header at the beginning of the file
        this.seek(this._mediaStartPosition);
        if (!this.readBlock(4).equals(FlacFile.FILE_IDENTIFIER)) {
            throw new CorruptFileError("FLAC header not found after any starting tags");
        }

        // Read the blocks of the file
        let position = this.position;
        const blocks: FlacBlock[] = [];
        do {
            const block = FlacBlock.fromFile(this, position);
            blocks.push(block);

            position += block.totalSize;
        } while (!blocks[blocks.length - 1].isLastBlock && position < this.length);

        return blocks;
    }

    private readPictures(readStyle: ReadStyle): XiphPicture[] {
        return this._metadataBlocks.filter((b) => b.type === FlacBlockType.Picture)
            .map((b) => XiphPicture.fromFlacBlock(b, NumberUtils.hasFlag(readStyle, ReadStyle.PictureLazy)));
    }

    private readProperties(readStyle: ReadStyle): Properties {
        if (!NumberUtils.hasFlag(readStyle, ReadStyle.Average)) {
            return undefined;
        }

        // Check that the first block is a METADATA_BLOCK_STREAMINFO
        if (this._metadataBlocks.length === 0 || this._metadataBlocks[0].type !== FlacBlockType.StreamInfo) {
            throw new CorruptFileError("FLAC stream does not begin with StreamInfo block");
        }

        // @TODO: For precise calculation, read the audio frames
        const lastBlock = this._metadataBlocks[this._metadataBlocks.length - 1];
        const metadataEndPosition = lastBlock.blockStart + lastBlock.dataSize + FlacBlock.HEADER_SIZE;
        const streamLength = this._mediaEndPosition - metadataEndPosition;
        const header = new FlacStreamHeader(this._metadataBlocks[0].data, streamLength);

        return new Properties(header.durationMilliseconds, [header]);
    }

    private readXiphComments(readStyle: ReadStyle): XiphComment {
        // Collect all the xiph comments
        const xiphComments = this._metadataBlocks.filter((b) => b.type === FlacBlockType.XiphComment)
            .map((b) => XiphComment.fromData(b.data, (readStyle & ReadStyle.PictureLazy) !== 0));

        // If we don't have any Xiph comments, just return undefined
        if (xiphComments.length === 0) {
            return undefined;
        }

        // If we only have one Xiph comment (as should be the norm), just return it
        if (xiphComments.length === 1) {
            return xiphComments[0];
        }

        // We have more than one xiph comment. Copy them all into one to normalize
        return xiphComments.reduce(
            (accum, xc) => {
                xc.copyTo(accum, true);
                return accum;
            },
            XiphComment.fromEmpty()
        );
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/flac",
    "audio/x-flac",
    "audio/flc",
    "application/x-flac"
].forEach((mt) => File.addFileType(mt, FlacFile));
