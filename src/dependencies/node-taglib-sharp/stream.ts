import * as fs from "fs";

import {Guards} from "./utils";
import {ByteVector} from "./byteVector";

export enum SeekOrigin {
    Begin,
    Current,
    End
}

export interface IStream {
    /**
     * Whether or not the stream can be written to
     */
    readonly canWrite: boolean;

    /**
     * Number of bytes currently stored in file this stream connects to
     */
    readonly length: number;

    /**
     * Position within the stream
     */
    position: number;

    /**
     * Closes the stream
     */
    close(): void;

    /**
     * Reads a block of bytes from the current stream and writes the data to a buffer.
     * @param buffer When this method returns, contains the specified byte array with the values
     *     between `offset` and (`offset` + `length` - 1) replaced by
     *     the characters read from the current stream
     * @param offset Zero-based byte offset in `buffer` at which to begin storing data
     *     from the current stream
     * @param length The maximum number of bytes to read
     * @returns number Total number of bytes written to the buffer. This can be less than the
     *     number of bytes requested if that number of bytes are not currently available or zero if
     *     the end of the stream is reached before any bytes are read
     */
    read(buffer: Uint8Array, offset: number, length: number): number;

    /**
     * Sets the position within the current stream to the specified value.
     * @param offset New position within the stream. this is relative to the `origin`
     *     parameter and can be positive or negative
     * @param origin Seek reference point {@link SeekOrigin}
     */
    seek(offset: number, origin: SeekOrigin): void;

    /**
     * Sets the length of the current current stream to the specified value.
     * @param length Number of bytes to set the length of the stream to
     */
    setLength(length: number): void;

    /**
     * Writes a block of bytes to the current stream using data read from a buffer.
     * @param buffer Buffer to write data from
     * @param bufferOffset Zero-based byte offset in `buffer` at which to begin copying
     *    bytes to the current stream
     * @param length Maximum number of bytes to write
     */
    write(buffer: Uint8Array | ByteVector, bufferOffset: number, length: number): number;
}

/**
 * Wrapper around the Node.js internal file descriptors to mock behavior like .NET Streams
 */
export class Stream implements IStream {
    private readonly _canWrite: boolean;
    private readonly _fd: number;
    private _length: number;
    private _position: number;

    // #region Constructors

    private constructor(fd: number, canWrite: boolean) {
        this._canWrite = canWrite;
        this._fd = fd;
        this._position = 0;
        this._length = fs.fstatSync(fd).size;
    }

    public static createAsRead(path: string): Stream {
        const fd = fs.openSync(path, "r");
        return new Stream(fd, false);
    }

    public static createAsReadWrite(path: string): Stream {
        const fd = fs.openSync(path, "r+");
        return new Stream(fd, true);
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get canWrite(): boolean { return this._canWrite; }

    /** @inheritDoc */
    public get length(): number { return this._length; }

    /** @inheritDoc */
    public get position(): number { return this._position; }
    /** @inheritDoc */
    public set position(position: number) {
        Guards.safeUint(position, "position");
        this._position = position;
    }

    // #endregion

    // #region Public Methods

    /** @inheritDoc */
    public close(): void {
        fs.closeSync(this._fd);
    }

    /** @inheritDoc */
    public read(buffer: Uint8Array, bufferOffset: number, length: number): number {
        const bytes = fs.readSync(this._fd, buffer, bufferOffset, length, this._position);
        this._position += bytes;
        return bytes;
    }

    /** @inheritDoc */
    public seek(offset: number, origin: SeekOrigin): void {
        Guards.safeInt(offset, "offset");
        switch (origin) {
            case SeekOrigin.Begin:
                this.position = offset;
                break;
            case SeekOrigin.Current:
                this.position = this.position + offset;
                break;
            case SeekOrigin.End:
                this.position = this.length + offset;
                break;
        }
    }

    /** @inheritDoc */
    public setLength(length: number): void {
        Guards.safeUint(length, "length");
        if (!this._canWrite) {
            throw new Error("Invalid operation: this stream is a read-only stream");
        }

        if (length === this._length) {
            return;
        }

        fs.ftruncateSync(this._fd, length);
        this._length = length;
        if (this._position > this._length) {
            this._position = this._length;
        }
    }

    /** @inheritDoc */
    public write(buffer: Uint8Array | ByteVector, bufferOffset: number, length: number): number {
        // Make sure we standardize on a Uint8Array
        if (buffer instanceof ByteVector) {
            buffer = buffer.toByteArray();
        }

        if (!this._canWrite) {
            throw new Error("Invalid operation: this stream is a read-only stream");
        }
        const origLength = this._length;

        const bytes = fs.writeSync(this._fd, buffer, bufferOffset, length, this._position);
        this._position += bytes;

        // If we wrote past the old end of the file, then the file has increased in size
        if (this._position > origLength) {
            this._length = this._position;
        }
        return bytes;
    }

    // #endregion
}
