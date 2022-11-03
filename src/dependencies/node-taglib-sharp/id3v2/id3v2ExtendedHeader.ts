import SyncData from "./syncData";
import {ByteVector} from "../byteVector";
import {Guards} from "../utils";

export default class Id3v2ExtendedHeader {
    private _size: number;

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs and initializes a new instance by reading the raw contents.
     * @param data Raw extended header structure
     * @param version ID3v2 version. Must be an unsigned 8-bit integer.
     */
    public static fromData(data: ByteVector, version: number): Id3v2ExtendedHeader {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const header = new Id3v2ExtendedHeader();
        header.parse(data, version);
        return header;
    }

    /**
     * Constructs and initializes a new instance with no contents.
     */
    public static fromEmpty(): Id3v2ExtendedHeader {
        return new Id3v2ExtendedHeader();
    }

    /**
     * Gets the size of the data on disk in bytes.
     */
    public get size(): number { return this._size; }

    protected parse(data: ByteVector, version: number): void {
        this._size = (version === 3 ? 4 : 0)
            + SyncData.toUint(data.subarray(0, 4));

        // TODO: Are we going to actually support any of the flags?
    }
}
