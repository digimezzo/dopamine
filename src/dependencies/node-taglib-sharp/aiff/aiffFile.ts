import AiffFileSettings from "./aiffFileSettings";
import AiffStreamHeader from "./aiffStreamHeader";
import Id3v2Tag from "../id3v2/id3v2Tag";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {Properties} from "../properties";
import {Tag, TagTypes} from "../tag";
import {SeekOrigin} from "../stream";
import {NumberUtils} from "../utils";

export default class AiffFile extends File {

    // #region Constants

    /**
     * Identifier used to recognize an AIFF form type.
     */
    // @TODO: Add support for AIFF-C files - it's pretty much the same
    public static readonly AIFF_FORM_TYPE = ByteVector.fromString("AIFF", StringType.UTF8).makeReadOnly();

    /**
     * Identifier used to recognize an AIFF common chunk.
     */
    public static readonly COMM_IDENTIFIER = ByteVector.fromString("COMM", StringType.UTF8).makeReadOnly();

    /**
     * Identifier used to recognize an AIFF file.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("FORM", StringType.UTF8).makeReadOnly();

    /**
     * Identifier used to recognize an AIFF ID3 chunk.
     */
    public static readonly ID3_IDENTIFIER = ByteVector.fromString("ID3 ", StringType.UTF8).makeReadOnly();

    /**
     * Identifier used to recognize an AIFF sound data chunk.
     */
    public static readonly SOUND_IDENTIFIER = ByteVector.fromString("SSND", StringType.UTF8).makeReadOnly();

    // #endregion

    private _headerBlock: ByteVector;
    private _properties: Properties;
    private _tag: Id3v2Tag;

    /**
     * Constructs and initializes a new instance of {@link AiffFile} for a specified file
     * abstraction and specified read style.
     * @param file File abstraction to use when reading and writing to the file
     * @param propertiesStyle Level of accuracy to read the media properties, or
     *     {@link ReadStyle.None} to ignore the properties
     */
    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file);

        // Read the file
        this.mode = FileAccessMode.Read;
        try {
            this.read(true, propertiesStyle);
        } finally {
            this.mode = FileAccessMode.Closed;
        }

        // Create default tags if desired
        this.tagTypesOnDisk = this.tagTypes;
        if (NumberUtils.hasFlag(AiffFileSettings.defaultTagTypes, TagTypes.Id3v2)) {
            this.getTag(TagTypes.Id3v2, true);
        }
    }

    // #region Properties

    /** @inheritDoc */
    public get properties(): Properties { return this._properties; }

    /** @inheritDoc */
    public get tag(): Tag { return this._tag; }

    // #endregion

    // #region Public Methods

    /** @inheritDoc */
    public getTag(type: TagTypes, create: boolean): Tag {
        let id3v2Tag: Tag;

        switch (type) {
            case TagTypes.Id3v2:
                if (!this._tag && create) {
                    this._tag = Id3v2Tag.fromEmpty();
                    this._tag.version = 2;
                }

                id3v2Tag = this._tag;
                break;
        }

        return id3v2Tag;
    }

    /** @inheritDoc */
    public removeTags(types: TagTypes): void {
        if (NumberUtils.hasFlag(types, TagTypes.Id3v2)) {
            this._tag = undefined;
        }
    }

    /** @inheritDoc */
    public save(): void {
        this.preSave();

        this.mode = FileAccessMode.Write;
        try {
            // Add the ID3 chunk and ID3v2 tag to the vector
            const id3Chunk = ByteVector.empty();
            if (this._tag) {
                const tagData = this._tag.render();
                if (tagData.length > 10) {
                    // Add padding if tag data length is odd
                    if (tagData.length % 2 === 1) {
                        tagData.addByte(0);
                    }

                    id3Chunk.addByteVector(AiffFile.ID3_IDENTIFIER);
                    id3Chunk.addByteVector(ByteVector.fromUint(tagData.length, true));
                    id3Chunk.addByteVector(tagData);
                }
            }

            const readResult = this.read(false, ReadStyle.None);

            // If tagging info cannot be found, place it at the end of the file
            if (readResult.tagStart < 0 || readResult.tagEnd < 0) {
                readResult.tagStart = readResult.tagEnd = this.length;
            }
            const originalTagChunkLength = readResult.tagEnd - readResult.tagStart + 8;

            // Insert the tagging data
            this.insert(id3Chunk, readResult.tagStart, originalTagChunkLength);

            // Update the AIFF size
            const aiffSize = this.length - 8;
            this.insert(ByteVector.fromUint(aiffSize, true), 4, 4);

            // Update the tag types
            this.tagTypesOnDisk = this.tagTypes;
        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    // #endregion

    // #region Private Helpers

    private findChunk(chunkName: ByteVector, startPos: number): number {
        const initialPosition = this.position;
        try {
            // Start at the given position
            this.seek(startPos);

            // While we're not at the end of the file
            while (this.position < this.length) {
                // Read 4-byte chunk name
                if (this.readBlock(4).equals(chunkName)) {
                    // We found a matching chunk, return the position of the header start
                    return this.position - 4;
                } else {
                    // This chunk is not the one we are looking for
                    // Continue the search, seeking over the chunk
                    const chunkSize = this.readBlock(4).toUint();
                    this.seek(chunkSize, SeekOrigin.Current);
                }
            }

            // We did not find the chunk
            return -1;
        } finally {
            // Reset the position to where we started
            this.seek(initialPosition);
        }
    }

    private read(readTags: boolean, style: ReadStyle): {fileSize: number, tagEnd: number, tagStart: number} {
        this.seek(0);
        if (!this.readBlock(4).equals(AiffFile.FILE_IDENTIFIER)) {
            throw new CorruptFileError("File does not begin with AIFF identifier");
        }

        const aiffSize = this.readBlock(4).toUint(true);
        let tagStart = -1;
        let tagEnd = -1;

        // Check form type
        if (!this.readBlock(4).equals(AiffFile.AIFF_FORM_TYPE)) {
            throw new CorruptFileError("File form type is not AIFF");
        }

        // Read the properties of the file
        if (!this._headerBlock && style !== ReadStyle.None) {
            const commonChunkPos = this.findChunk(AiffFile.COMM_IDENTIFIER, this.position);
            if (commonChunkPos === -1) {
                throw new CorruptFileError("No common chunk available in this AIFF file");
            }

            this.seek(commonChunkPos);
            this._headerBlock = this.readBlock(AiffStreamHeader.SIZE);

            const header = new AiffStreamHeader(this._headerBlock, aiffSize);
            this._properties = new Properties(0, [header]);
        }

        // Search for the sound chunk
        const soundChunkPos = this.findChunk(AiffFile.SOUND_IDENTIFIER, this.position);
        if (soundChunkPos === -1) {
            throw new CorruptFileError("No sound chunk available in this AIFF file");
        }
        this.seek(this.position + 4);
        const soundChunkLength = this.readBlock(4).toUint();

        // Search for the ID3 chunk
        const id3ChunkPos = this.findChunk(AiffFile.ID3_IDENTIFIER, this.position + soundChunkLength);
        if (id3ChunkPos >= 0) {
            if (readTags && !this._tag) {
                this._tag = Id3v2Tag.fromFileStart(this, id3ChunkPos + 8, style);
            }

            // Get the length of the tag from the ID3 chunk
            this.seek(id3ChunkPos + 4);
            const tagSize = this.readBlock(4).toUint(true) + 8;

            tagStart = id3ChunkPos;
            tagEnd = tagStart + tagSize;
        }

        return {
            fileSize: this.length,
            tagEnd: tagEnd,
            tagStart: tagStart
        };
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/aif",
    "taglib/aiff",
    "audio/x-aiff",
    "audio/aiff",
    "sound/aiff",
    "application/x-aiff"
].forEach((mt) => File.addFileType(mt, AiffFile));
