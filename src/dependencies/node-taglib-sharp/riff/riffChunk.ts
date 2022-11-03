import IRiffChunk from "./iRiffChunk";
import {ByteVector, StringType} from "../byteVector";
import {File} from "../file";
import {ILazy} from "../interfaces";
import {Guards} from "../utils";

/**
 * Represents a block of data in a RIFF file. Used primarily for reading and writing files.
 */
export default class RiffChunk implements IRiffChunk, ILazy {
    private _chunkStart: number;
    private _data: ByteVector;
    private _file: File;
    private _fourcc: string;
    private _originalDataSize: number;

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Creates and initializes a new instance, lazily, from a position of a file.
     * @param file File from which to read the current instance
     * @param fourcc FOURCC code for the chunk
     * @param position Position in the file where the chunk begins
     */
    public static fromFile(file: File, fourcc: string, position: number): RiffChunk {
        Guards.truthy(file, "file");
        Guards.truthy(fourcc, "fourcc");
        if (fourcc.length !== 4) {
            throw new Error("Argument error: fourcc must be 4 characters");
        }
        Guards.safeUint(position, "position");
        if (position > file.length) {
            throw new Error("Argument out of range: position must be within size of file");
        }

        const chunk = new RiffChunk();
        file.seek(position + 4);
        chunk._originalDataSize = file.readBlock(4).toUint(false);
        chunk._file = file;
        chunk._fourcc = fourcc;
        chunk._chunkStart = position;
        return chunk;
    }

    /**
     * Creates and initializes a new instance from the provided data.
     * @param fourcc FOURCC code for the chunk
     * @param data Data to contain in the chunk, not includeing FOURCC or size
     */
    public static fromData(fourcc: string, data: ByteVector): RiffChunk {
        Guards.truthy(fourcc, "fourcc");
        if (fourcc.length !== 4) {
            throw new Error("Argument error: fourcc must be 4 characters");
        }
        Guards.truthy(data, "data");

        const chunk = new RiffChunk();
        chunk._data = data.toByteVector();
        chunk._fourcc = fourcc;
        chunk._originalDataSize = data.length;
        return chunk;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get chunkStart(): number|undefined { return this._chunkStart; }
    /** @internal */
    public set chunkStart(value: number) {
        Guards.safeUint(value, "value");
        this._chunkStart = value;
    }

    /**
     * Data contained in the chunk.
     */
    public get data(): ByteVector {
        this.load();
        return this._data;
    }

    /** @inheritDoc */
    public get fourcc(): string { return this._fourcc; }

    /** @inheritDoc */
    public get isLoaded(): boolean { return !!this._data; }

    /** @inheritDoc */
    public get originalDataSize(): number { return this._originalDataSize; }

    /** @inheritDoc */
    public get originalTotalSize(): number {
        return this._originalDataSize + 8 + (this._originalDataSize % 2 === 1 ? 1 : 0);
    }
    /** @internal */
    public set originalTotalSize(value: number) {
        Guards.safeUint(value, "value");
        this._originalDataSize = value - 8;
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public load(): void {
        if (this.isLoaded) {
            return;
        }

        // Read the data from the file
        this._file.seek(this._chunkStart + 8);
        this._data = this._file.readBlock(this._originalDataSize);
    }

    /** @inheritDoc */
    public render(): ByteVector {
        this.load();

        return ByteVector.concatenate(
            ByteVector.fromString(this._fourcc, StringType.Latin1),
            ByteVector.fromUint(this.data.length, false),
            this._data,
            ((this._data.length + 4 + 4) % 2 === 1) ? 0x00 : undefined
        );
    }

    // #endregion
}
