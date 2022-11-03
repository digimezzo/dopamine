import itiriri from "itiriri";
import AviFileSettings from "./aviFileSettings";
import AviHeader from "./avi/aviHeader";
import DivxTag from "./divxTag";
import Id3v2Tag from "../id3v2/id3v2Tag";
import InfoTag from "./infoTag";
import IRiffChunk from "./iRiffChunk";
import MovieIdTag from "./movieIdTag";
import RiffChunk from "./riffChunk";
import RiffList from "./riffList";
import RiffTags from "./riffTags";
import RiffWaveFormatEx from "./riffWaveFormatEx";
import Settings from "../settings";
import WaveFileSettings from "./waveFileSettings";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError, UnsupportedFormatError} from "../errors";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {ICodec, Properties} from "../properties";
import {Tag, TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class extends {@link File} to provide tagging and properties support for RIFF files. These
 * are usually WAV and AVI file.
 * @remarks The RIFF standard supports a general purpose "chunk" system that software can use for
 *     whatever purpose. Tagging is accomplished using various types of chunks
 */
export default class RiffFile extends File {
    /**
     * Identifier at the beginning of a RIFF file.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("RIFF", StringType.Latin1).makeReadOnly();

    private _fileType: string;
    private _properties: Properties;
    private _rawChunks: IRiffChunk[] = [];
    private _riffSize: number;
    private _tag: RiffTags;
    private _taggingChunkIndexes: Map<TagTypes, number>;

    /**
     * Constructs and initializes a new instance of a RIFF file based on the provided file/file path.
     * @param file File abstraction or path to a file to open as a RIFF file
     * @param propertiesStyle How in-depth to read the properties of the file
     */
    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file);

        // Read the file
        this.mode = FileAccessMode.Read;
        try {
            this.read(propertiesStyle);
        } finally {
            this.mode = FileAccessMode.Closed;
        }

        // Depending on which type of file we're working with, determine which tags to create
        let defaultTags = 0;
        switch (this._fileType) {
            case "AVI ":
                defaultTags = AviFileSettings.defaultTagTypes;
                break;
            case "WAVE":
                defaultTags = WaveFileSettings.defaultTagTypes;
                break;
        }

        // Create the default tags
        // NOTE: We are adding ID3v2 tag first because it is the most flexible and will store
        //    complete tag information.
        const allTagTypes = [TagTypes.Id3v2, TagTypes.DivX, TagTypes.RiffInfo, TagTypes.MovieId];
        for (const tagType of allTagTypes) {
            const isDefault = NumberUtils.hasFlag(defaultTags, tagType);
            const existsAlready = NumberUtils.hasFlag(this._tag.tagTypes, tagType);
            if (!isDefault || existsAlready) {
                continue;
            }

            // Desired default tag does not exist, create it
            this._tag.createTag(tagType, Settings.copyExistingTagsToNewDefaultTags);
        }
    }

    // #region Properties

    /** @inheritDoc */
    public get properties(): Properties { return this._properties; }

    /** @inheritDoc */
    public get tag(): Tag { return this._tag; }

    // #endregion

    // #region Methods

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
            // Render the tags we have
            const renderedTags = [];
            const replacedChunks: Array<{chunk: IRiffChunk, newTotalSize: number}> = [];
            const id3v2Tag = this._tag.getTag<Id3v2Tag>(TagTypes.Id3v2);
            if (id3v2Tag) {
                // @TODO: Allow chunk ID to be configurable
                const id3v2TagBytes = id3v2Tag.render();
                const id3v2TagChunk = RiffChunk.fromData("id3 ", id3v2TagBytes);
                replacedChunks.push({ chunk: id3v2TagChunk, newTotalSize: id3v2TagChunk.originalTotalSize });
                renderedTags.push(id3v2TagChunk.render());
            }
            const infoTag = this._tag.getTag<InfoTag>(TagTypes.RiffInfo);
            if (infoTag) {
                const infoTagBytes = infoTag.render();
                replacedChunks.push({ chunk: infoTag.list, newTotalSize: infoTagBytes.length });
                renderedTags.push(infoTagBytes);
            }
            const movieIdTag = this._tag.getTag<MovieIdTag>(TagTypes.MovieId);
            if (movieIdTag) {
                const movieIdBytes = movieIdTag.render();
                replacedChunks.push({ chunk: movieIdTag.list, newTotalSize: movieIdBytes.length });
                renderedTags.push(movieIdBytes);
            }
            const divxTag = this._tag.getTag<DivxTag>(TagTypes.DivX);
            if (divxTag) {
                const divxTagBytes = divxTag.render();
                const divxTagChunk = RiffChunk.fromData(DivxTag.CHUNK_FOURCC, divxTagBytes);
                replacedChunks.push({ chunk: divxTagChunk, newTotalSize: divxTagChunk.originalTotalSize });
                renderedTags.push(divxTagChunk.render());
            }
            const renderedTagBytes = ByteVector.concatenate(... renderedTags);

            // Determine the boundaries of the tagging chunks
            const taggingChunkIndexes = itiriri(this._taggingChunkIndexes.values())
                .filter((i) => i >= 0)
                .sort()
                .toArray();

            let taggingChunkStartIndex: number;
            let taggingChunkStart: number;
            let taggingChunkLength: number = 0;
            if (taggingChunkIndexes.length > 0) {
                // Determine if the chunks are contiguous
                let taggingChunksAreContiguous = true;
                for (let i = 1; i < taggingChunkIndexes.length && taggingChunksAreContiguous; i++) {
                    const chunkIndexA = taggingChunkIndexes[i - 1];
                    const chunkIndexB = taggingChunkIndexes[i];
                    let chunkIndexC = chunkIndexA + 1;
                    while (chunkIndexC < chunkIndexB) {
                        // It's ok if we have A-JUNK-JUNK-JUNK-B, but A-X-B is not ok
                        const chunkC = this._rawChunks[chunkIndexC];
                        if (chunkC.fourcc !== "JUNK") {
                            taggingChunksAreContiguous = false;
                            break;
                        }

                        chunkIndexC++;
                    }
                }

                // Are the chunks contiguous?
                if (taggingChunksAreContiguous) {
                    // Awesome, the chunks are contiguous, we can update this in one big write
                    // operation
                    // Find any trailing JUNK chunks
                    let lastChunkIndex = taggingChunkIndexes[taggingChunkIndexes.length - 1];
                    while (
                        lastChunkIndex + 1 < this._rawChunks.length &&
                        this._rawChunks[lastChunkIndex + 1].fourcc === "JUNK"
                    ) {
                        lastChunkIndex++;
                    }

                    // Calculate tagging chunks start/length
                    taggingChunkStartIndex = taggingChunkIndexes[0];
                    taggingChunkStart = this._rawChunks[taggingChunkStartIndex].chunkStart;
                    taggingChunkLength = this._rawChunks[lastChunkIndex].chunkStart
                        + this._rawChunks[lastChunkIndex].originalTotalSize
                        - taggingChunkStart;

                    // Remove the chunks from the chunk list
                    // NOTE: After this point, the chunk list and file contents have diverged (but
                    //    it's ok b/c we will update the whole thing as part of writing the tags
                    //    back out)
                    this._rawChunks.splice(taggingChunkStartIndex, lastChunkIndex - taggingChunkStartIndex + 1);
                } else {
                    // Crud, we can't update in one big write. Let's delete each tagging chunk,
                    // then write them all in a giant block later. This process will be slow on
                    // large files, but future saves should be improved.
                    taggingChunkIndexes.reverse();
                    for (const chunkIndex of taggingChunkIndexes) {
                        // Find any trailing JUNK chunks
                        let lastChunkIndex = chunkIndex;
                        while (
                            lastChunkIndex + 1 < this._rawChunks.length &&
                            this._rawChunks[lastChunkIndex + 1].fourcc === "JUNK"
                        ) {
                            lastChunkIndex++;
                        }

                        // Remove the tag chunk and any JUNK chunks, update start positions for
                        // subsequent chunks
                        const blockStart = this._rawChunks[chunkIndex].chunkStart;
                        const blockLength = this._rawChunks[lastChunkIndex].chunkStart
                            + this._rawChunks[lastChunkIndex].originalTotalSize
                            - blockStart;
                        this.removeBlock(blockStart, blockLength);
                        this._rawChunks.splice(chunkIndex, lastChunkIndex - chunkIndex + 1);
                        this.updateChunkPositions(chunkIndex, -blockLength);
                    }
                }
            }

            // Make no changes if there weren't any tags and there aren't any tags
            if (taggingChunkLength === 0 && renderedTagBytes.length === 0) {
                return;
            }

            // If we don't know where to insert the tags, try to insert them before movi/data chunk,
            // failing that, insert at end of the file.
            if (taggingChunkStart === undefined) {
                const moviChunkId = this._rawChunks.findIndex((c) => c.fourcc === "movi" || c.fourcc === "data");
                if (moviChunkId >= 0) {
                    taggingChunkStartIndex = moviChunkId;
                    taggingChunkStart = this._rawChunks[taggingChunkStartIndex].chunkStart;
                } else {
                    taggingChunkStartIndex = this._rawChunks.length;
                    taggingChunkStart = this.length;
                }
            }

            // Determine new JUNK chunk size
            let junkLength: number;
            if (renderedTagBytes.length + 8 < taggingChunkLength) {
                // New tags are smaller, so use the difference as the size of the JUNK chunk
                junkLength = taggingChunkLength - renderedTagBytes.length - 8;
            } else {
                // New tags are same size or larger, so insert a JUNK chunk for future padding
                // @TODO: Let padding size be configurable
                junkLength = 1024;
            }
            const junkChunk = RiffChunk.fromData("JUNK", ByteVector.fromSize(junkLength));
            const junkBytes = junkChunk.render();
            renderedTagBytes.addByteVector(junkBytes);
            replacedChunks.push({ chunk: junkChunk, newTotalSize: junkBytes.length });

            // Write the big block to the file
            this.insert(renderedTagBytes, taggingChunkStart, taggingChunkLength);

            // Update the chunk list
            this.updateChunkPositions(taggingChunkStartIndex, renderedTagBytes.length - taggingChunkLength);
            this._rawChunks.splice(taggingChunkStartIndex, 0, ... replacedChunks.map((rc) => rc.chunk));
            let filePosition = taggingChunkStart;
            for (const replacedChunk of replacedChunks) {
                replacedChunk.chunk.chunkStart = filePosition;
                replacedChunk.chunk.originalTotalSize = replacedChunk.newTotalSize;
                filePosition += replacedChunk.chunk.originalTotalSize;
            }
            this.updateTaggingChunkIndexes();

            // Calculate new RIFF size
            this._riffSize = this.length - 8;
            this.insert(ByteVector.fromUint(this._riffSize, false), 4, 4);
            this.tagTypesOnDisk = this.tagTypes;
        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    private read(readStyle: ReadStyle): void {
        this.mode = FileAccessMode.Read;

        try {
            // Read the header of the file
            const initialHeader = this.readBlock(12);
            if (!initialHeader.startsWith(RiffFile.FILE_IDENTIFIER)) {
                throw new CorruptFileError("File does not begin with RIFF identifier");
            }
            this._riffSize = initialHeader.subarray(4, 4).toUint(false);
            this._fileType = initialHeader.subarray(8, 4).toString(StringType.Latin1);

            // Read chunks until there are less than 8 bytes to read
            let position = this.position;
            while (position + 8 < this.length) {
                this.seek(position);
                const fourcc = this.readBlock(4).toString(StringType.Latin1);
                const chunk = fourcc === RiffList.IDENTIFIER_FOURCC
                    ? RiffList.fromFile(this, position)
                    : RiffChunk.fromFile(this, fourcc, position);
                position += chunk.originalTotalSize;
                this._rawChunks.push(chunk);
            }

            // Process the properties of the file
            this._properties = this.readProperties(readStyle);

            // Process tags
            this.updateTaggingChunkIndexes();
            // 1) DivX
            const divxChunkIndex = this._taggingChunkIndexes.get(TagTypes.DivX);
            const divxTag = divxChunkIndex >= 0
                ? DivxTag.fromData((<RiffChunk> this._rawChunks[divxChunkIndex]).data)
                : undefined;

            // 2) ID3v2
            const id3v2ChunkIndex = this._taggingChunkIndexes.get(TagTypes.Id3v2);
            // @TODO: Switch to fromFile and using chunk start/data length to allow lazy picture loading
            const id3v2Tag = id3v2ChunkIndex >= 0
                ? Id3v2Tag.fromData((<RiffChunk> this._rawChunks[id3v2ChunkIndex]).data)
                : undefined;

            // 3) Info tag
            const infoTagChunkIndex = this._taggingChunkIndexes.get(TagTypes.RiffInfo);
            const infoTag = infoTagChunkIndex >= 0
                ? InfoTag.fromList(<RiffList> this._rawChunks[infoTagChunkIndex])
                : undefined;

            // 4) MovieID tag
            const movieIdChunkIndex = this._taggingChunkIndexes.get(TagTypes.MovieId);
            const moveIdTag = movieIdChunkIndex >= 0
                ? MovieIdTag.fromList(<RiffList> this._rawChunks[movieIdChunkIndex])
                : undefined;

            this._tag = new RiffTags(divxTag, id3v2Tag, infoTag, moveIdTag);
            this.tagTypesOnDisk = this.tagTypes;

        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    private readProperties(readStyle: ReadStyle): Properties {
        if (!NumberUtils.hasFlag(readStyle, ReadStyle.Average)) {
            return;
        }

        let codecs: ICodec[];
        let durationMilliseconds: number = 0;
        switch (this._fileType) {
            case "WAVE":
                // This is a wav file, search for fmt chunk
                const fmtChunk = this._rawChunks.find((c) => c.fourcc === RiffWaveFormatEx.CHUNK_FOURCC);
                if (!fmtChunk) {
                    throw new CorruptFileError("WAV file is missing header chunk");
                }

                const waveHeader = new RiffWaveFormatEx((<RiffChunk> fmtChunk).data, );
                codecs = [waveHeader];

                // Calculate the duration by getting the data chunk size
                const dataChunk = this._rawChunks.find((c) => c.fourcc === "data");
                if (!dataChunk) {
                    throw new CorruptFileError("WAV file is missing data chunk");
                }

                codecs = [waveHeader];
                durationMilliseconds = dataChunk.originalDataSize * 8000
                    / waveHeader.bitsPerSample / waveHeader.audioSampleRate;
                break;

            case "AVI ":
                // This is an AVI file, search for the hdrl list
                const aviHeaderList = this._rawChunks.find((c) => {
                    return c.fourcc === RiffList.IDENTIFIER_FOURCC
                        && (<RiffList> c).type === AviHeader.HEADER_LIST_TYPE;
                });
                if (!aviHeaderList) {
                    throw new CorruptFileError("AVI file is missing header list");
                }

                const aviHeader = new AviHeader(<RiffList> aviHeaderList);
                codecs = aviHeader.codecs;
                durationMilliseconds = aviHeader.durationMilliseconds;
                break;

            default:
                throw new UnsupportedFormatError("Unsupported RIFF type");
        }

        return new Properties(durationMilliseconds, codecs);
    }

    private updateChunkPositions(chunkIndex: number, filePositionOffset: number): void {
        for (let i = chunkIndex; i < this._rawChunks.length; i++) {
            this._rawChunks[i].chunkStart += filePositionOffset;
        }
    }

    private updateTaggingChunkIndexes(): void {
        const id3v2ChunkFourcc = ["id3 ", "ID3 ", "ID32"];
        this._taggingChunkIndexes = new Map<TagTypes, number>();
        this._taggingChunkIndexes.set(
            TagTypes.DivX,
            this._rawChunks.findIndex((c) => c.fourcc === DivxTag.CHUNK_FOURCC)
        );
        this._taggingChunkIndexes.set(
            TagTypes.Id3v2,
            this._rawChunks.findIndex((c) => id3v2ChunkFourcc.indexOf(c.fourcc) >= 0)
        );
        this._taggingChunkIndexes.set(
            TagTypes.RiffInfo,
            this._rawChunks.findIndex((c) => RiffList.isChunkList(c) && (<RiffList> c).type === InfoTag.LIST_TYPE)
        );
        this._taggingChunkIndexes.set(
            TagTypes.MovieId,
            this._rawChunks.findIndex((c) => RiffList.isChunkList(c) && (<RiffList> c).type === MovieIdTag.LIST_TYPE)
        );
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/avi",
    "taglib/wav",
    "taglib/divx",
    "video/avi",
    "video/msvideo",
    "video/x-msvideo",
    "image/avi",
    "application/x-troff-msvideo",
    "audio/avi",
    "audio/wav",
    "audio/wave",
    "audio/x-wav"
].forEach((mt) => File.addFileType(mt, RiffFile));
