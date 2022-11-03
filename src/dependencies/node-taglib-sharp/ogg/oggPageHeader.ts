import { ByteVector, StringType } from "../byteVector";
import { CorruptFileError } from "../errors";
import { File } from "../file";
import { Guards, NumberUtils } from "../utils";

/**
 * Indicates the special properties of a {@see OggPageHeader}.
 */
export enum OggPageFlags {
    /** The page is a normal page. */
    None = 0,

    /** The first packet of the page is continued from the previous page. */
    FirstPacketContinued = 1,

    /** The page is the first page of the stream. */
    FirstPageOfStream = 2,

    /** The page is the last page of the stream. */
    LastPageOfStream = 4
}

/**
 * This structure provides a representation of an Ogg page header.
 */
export class OggPageHeader {
    public static readonly MINIMUM_SIZE = 27;
    public static readonly HEADER_IDENTIFIER = ByteVector.fromString("OggS", StringType.Latin1).makeReadOnly();

    private _absoluteGranularPosition: number;
    private _dataSize: number;
    private _flags: OggPageFlags;
    private _lastPacketComplete: boolean;
    private _packetSizes: number[];
    private _pageSequenceNumber: number;
    private _size: number;
    private _streamSerialNumber: number;
    private _version: number;

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs and initializes a new instance by reading a raw Ogg page header from a specified
     * position in a specified file.
     * @param file File from which the contents of the new instance are to be read
     * @param position Position in the file where the header begins
     */
    public static fromFile(file: File, position: number): OggPageHeader {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (position > file.length - this.MINIMUM_SIZE) {
            throw new Error(`Argument out of range: page header must be at least ${this.MINIMUM_SIZE} bytes`);
        }

        file.seek(position);
        const data = file.readBlock(this.MINIMUM_SIZE);
        if (data.length < this.MINIMUM_SIZE || !data.startsWith(this.HEADER_IDENTIFIER)) {
            throw new CorruptFileError("Error reading page header");
        }

        const header = new OggPageHeader();
        header._version = data.get(4);
        header._flags = data.get(5);

        header._absoluteGranularPosition = Number(data.subarray(6, 8).toUlong(false));
        header._streamSerialNumber = data.subarray(14, 4).toUint(false);
        header._pageSequenceNumber = data.subarray(18, 4).toUint(false);

        // Byte 27 is the number of page segments, which is the only variable length portion of the
        // page header. After reading the number of page segments, we'll then read in the
        // corresponding data for this count.
        const pageSegmentCount = data.get(26);
        const pageSegments = file.readBlock(pageSegmentCount);

        // Another sanity check
        if (pageSegmentCount < 1 || pageSegments.length !== pageSegmentCount) {
            throw new CorruptFileError("Incorrect number of page segments");
        }

        // The base size of an Ogg page is 27 bytes + the number of lacing values
        header._size = this.MINIMUM_SIZE + pageSegmentCount;
        header._packetSizes = [];

        let packetSize = 0;
        header._dataSize = 0;

        for (let i = 0; i < pageSegmentCount; i++) {
            header._dataSize += pageSegments.get(i);
            packetSize += pageSegments.get(i);

            if (pageSegments.get(i) < 255) {
                header._packetSizes.push(packetSize);
                packetSize = 0;
            }
        }

        if (packetSize > 0) {
            header._packetSizes.push(packetSize);
        }

        header._lastPacketComplete = pageSegments.get(pageSegmentCount - 1) < 255;

        return header;
    }

    /**
     * Constructs and initializes a new instance with a given stream serial number, page number,
     * and flags.
     * @param streamSerialNumber Serial number for the stream containing the page described by the
     *     new instance
     * @param pageNumber Index of the page described by the new instance in the stream
     * @param flags Flags that apply to the new instance.
     */
    public static fromInfo(streamSerialNumber: number, pageNumber: number, flags: OggPageFlags): OggPageHeader {
        Guards.uint(streamSerialNumber, "streamSerialNumber");
        Guards.uint(pageNumber, "pageNumber");

        const header = new OggPageHeader();
        header._version = 0;
        header._flags = flags;
        header._absoluteGranularPosition = 0;
        header._streamSerialNumber = streamSerialNumber;
        header._pageSequenceNumber = pageNumber;
        header._size = 0;
        header._dataSize = 0;
        header._packetSizes = [];
        header._lastPacketComplete = false;

        if (pageNumber === 0 && !NumberUtils.hasFlag(flags, OggPageFlags.FirstPacketContinued)) {
            header._flags |= OggPageFlags.FirstPageOfStream;
        }

        return header;
    }

    /**
     * Constructs and initializes a new instance by copying the values from another instance,
     * offsetting the page number and applying new flags.
     * @param original Object to copy values from
     * @param offset How much to offset the page sequence number in the new instance
     * @param flags Flags to use in the new instance
     */
    public static fromPageHeader(original: OggPageHeader, offset: number, flags: OggPageFlags): OggPageHeader {
        Guards.truthy(original, "original");
        Guards.uint(offset, "offset");

        const header = new OggPageHeader();
        header._version = original._version;
        header._flags = flags;
        header._absoluteGranularPosition = original._absoluteGranularPosition;
        header._streamSerialNumber = original._streamSerialNumber;
        header._pageSequenceNumber = original._pageSequenceNumber + offset;
        header._size = original._size;
        header._dataSize = original._dataSize;
        header._packetSizes = [];
        header._lastPacketComplete = false;

        if (header._pageSequenceNumber === 0 && !NumberUtils.hasFlag(flags, OggPageFlags.FirstPacketContinued)) {
            header._flags |= OggPageFlags.FirstPageOfStream;
        }

        return header;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the absolute granular position of the page described by the current instance.
     */
    public get absoluteGranularPosition(): number { return this._absoluteGranularPosition; }

    /**
     * Gets the size of the data portion of the page described by the current instance as it
     * appeared on disk.
     */
    public get dataSize(): number { return this._dataSize; }

    /**
     * Gets the flags for the page described by the current instance.
     */
    public get flags(): OggPageFlags { return this._flags; }

    /**
     * Gets whether or not the final packet is continued on the next page. If `true`, the final
     * packet is complete and not continued on the next page.
     */
    public get lastPacketComplete(): boolean { return this._lastPacketComplete; }

    /**
     * Gets the sizes for the packets in the page described by the current instance.
     */
    public get packetSizes(): number[] { return this._packetSizes; }
    /**
     * Sets the sizes for the packets in the page described by the current instnace.
     * @internal
     */
    public set packetSizes(value: number[]) {
        Guards.truthy(value, "value");
        Guards.all(value, Guards.int, "value");
        this._packetSizes.splice(0, this._packetSizes.length, ... value);
    }

    /**
     * Gets the sequence number of the page described by the current instance.
     */
    public get pageSequenceNumber(): number { return this._pageSequenceNumber; }

    /**
     * Gets the size of the header as it appeared on disk.
     */
    public get size(): number { return this._size; }

    /**
     * Gets the serial number of the stream that the current instance belongs to.
     */
    public get streamSerialNumber(): number { return this._streamSerialNumber; }

    // #endregion

    // #region Methods

    public render(): ByteVector {
        const lacingValues = this._packetSizes.reduce((accum, ps, i) => {
            // The size of a packet in an Ogg page is indicated by a series of "lacing values"
            // where the sum of the values is the packet size in bytes. Each of these values is a
            // byte. A value of less than 255 indicates the end of the packet.
            const quot = Math.floor(ps / 255);
            const rem = ps % 255;
            accum.push(ByteVector.fromSize(quot, 0xFF));
            if (i < this._packetSizes.length - 1 || rem !== 0) {
                accum.push(rem);
            }

            return accum;
        }, <Array<ByteVector|number>> []);
        const lacingBytes = ByteVector.concatenate(...lacingValues);

        return ByteVector.concatenate(
            OggPageHeader.HEADER_IDENTIFIER,
            this._version,
            this._flags,
            ByteVector.fromUlong(this._absoluteGranularPosition, false),
            ByteVector.fromUint(this._streamSerialNumber, false),
            ByteVector.fromUint(this._pageSequenceNumber, false),
            ByteVector.fromSize(4), // Checksum to be filled later
            lacingBytes.length,
            lacingBytes
        );
    }

    // #endregion
}

