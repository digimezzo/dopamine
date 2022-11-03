import IRiffChunk from "./iRiffChunk";
import {ByteVector, StringType} from "../byteVector";
import {File, FileAccessMode} from "../file";
import {ILazy} from "../interfaces";
import {Guards} from "../utils";

export default class RiffList implements IRiffChunk, ILazy {
    /**
     * FOURCC code for a list chunk
     */
    public static readonly IDENTIFIER_FOURCC = "LIST";

    private _chunkStart: number;
    private _file: File;
    private _isLoaded: boolean;
    private _lists: Map<string, RiffList[]> = new Map<string, RiffList[]>();
    private _originalDataSize: number;
    private _type: string;
    private _values: Map<string, ByteVector[]> = new Map<string, ByteVector[]>();

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs and initializes a new instance with no contents.
     * @param type Type ID of the list
     */
    public static fromEmpty(type: string): RiffList {
        const list = new RiffList();
        list._isLoaded = true;
        list._type = type;
        list._originalDataSize = 4;
        return list;
    }

    /**
     * Constructs and initializes a new instance, lazily, from a position in a file.
     * @param file File from which to read the current instance
     * @param position Position in the file where the list begins
     */
    public static fromFile(file: File, position: number): RiffList {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (position > file.length) {
            throw new Error("Argument out of range: position must be within size of file");
        }

        file.seek(position);
        const listHeader = file.readBlock(12);
        if (listHeader.subarray(0, 4).toString(StringType.Latin1) !== RiffList.IDENTIFIER_FOURCC) {
            throw new Error("Cannot read RIFF list from non-list chunk");
        }

        const list = new RiffList();
        list._chunkStart = position;
        list._originalDataSize = listHeader.subarray(4, 4).toUint(false);
        list._file = file;
        list._isLoaded = false;
        list._type = listHeader.subarray(8, 4).toString(StringType.Latin1);

        return list;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get chunkStart(): number|undefined { return this._chunkStart; }
    /** @inheritDoc */
    public set chunkStart(value: number) {
        Guards.safeUint(value, "value");
        this._chunkStart = value;
    }

    /** @inheritDoc */
    public get fourcc(): string { return RiffList.IDENTIFIER_FOURCC; }

    /** @inheritDoc */
    public get isLoaded(): boolean { return this._isLoaded; }

    /**
     * Total number of nested lists contained in this instance.
     */
    public get listCount(): number {
        this.load();
        return this._lists.size;
    }
    // @TODO: Just expose the values and lists?

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

    /**
     * ID that identifies the type of this list.
     */
    public get type(): string { return this._type; }

    /**
     * Total number of values contained in this instance.
     */
    public get valueCount(): number {
        this.load();
        return this._values.size;
    }

    // #endregion

    // #region Methods

    public static isChunkList(c: IRiffChunk): boolean {
        return c.fourcc === RiffList.IDENTIFIER_FOURCC;
    }

    /**
     * Removes all values and nested lists from the current instance.
     */
    public clear(): void {
        this._values.clear();
        this._lists.clear();
        this._isLoaded = true;
    }

    /**
     * Retrieves a collection of lists by the lists' key.
     * @param id Key for looking up the desired lists
     * @returns RiffList[] Array of the nested lists with the provided key, or an empty array if
     *     the key does not exist in this instance.
     */
    public getLists(id: string): RiffList[] {
        this.load();
        return this._lists.get(id) || [];
    }

    /**
     * Retrieves a collection of values by the values' key.
     * @param id Key for looking up the desired values
     * @returns ByteVector[] Array of the values with the provided key, or an empty array if the
     *     key does not exist in the instance.
     */
    public getValues(id: string): ByteVector[] {
        Guards.truthy(id, "id");
        if (id.length !== 4) {
            throw new Error("Argument error: ID must be 4 bytes");
        }

        this.load();
        return this._values.get(id) || [];
    }

    /** @inheritDoc */
    public load(): void {
        if (this._isLoaded) {
            return;
        }

        // Read the raw list from file
        const lastMode = this._file.mode;
        this._file.mode = FileAccessMode.Read;
        try {
            let fileOffset = this._chunkStart + 12;
            while (fileOffset + 8 <= this._chunkStart + this.originalTotalSize) {
                // Read the value
                this._file.seek(fileOffset);
                const headerBlock = this._file.readBlock(8);
                const id = headerBlock.subarray(0, 4).toString(StringType.UTF8);
                const length = headerBlock.subarray(4, 4).toUint(false);

                if (id === RiffList.IDENTIFIER_FOURCC) {
                    // The element is a list, create a nested riff list from it
                    const nestedList = RiffList.fromFile(this._file, fileOffset);
                    if (this._lists.get(nestedList.type) === undefined) {
                        this._lists.set(nestedList.type, []);
                    }
                    this._lists.get(nestedList.type).push(nestedList);
                } else {
                    // The element is just a key-value pair, store it
                    if (this._values.get(id) === undefined) {
                        this._values.set(id, []);
                    }
                    const valueBlock = this._file.readBlock(length);
                    this._values.get(id).push(valueBlock);
                }

                // Increment offset, including padding if necessary
                fileOffset += 8 + length + (length % 2 === 1 ? 1 : 0);
            }

            this._isLoaded = true;
        } finally {
            this._file.mode = lastMode;
        }
    }

    /**
     * Stores a collection of lists in the current instance, overwriting any that currently exist.
     * @param id Key for the lists to store
     * @param lists Collection of lists to store in the current instance
     */
    public setLists(id: string, lists: RiffList[]): void {
        this.load();
        if (!lists || lists.length === 0) {
            this._lists.delete(id);
        } else {
            this._lists.set(id, lists);
        }
    }

    /**
     * Stores a collection of values in the current instance, overwriting any that currently exist.
     * @param id Key for the values to store
     * @param values Collection of values to store in the current instance
     */
    public setValues(id: string, values: ByteVector[]): void {
        Guards.truthy(id, "id");
        if (id.length !== 4) {
            throw new Error("Argument error: ID must be 4 bytes");
        }

        this.load();
        if (!values || values.length === 0) {
            this._values.delete(id);
        } else {
            this._values.set(id, values);
        }
    }

    /** @inheritDoc */
    public render(): ByteVector {
        this.load();

        // Render all the values
        // @TODO: I think we can do this with less concat calls
        const valueData = Array.from(this._values.entries(), ([key, value]) => {
            const valuesBytes = value.map((v) => ByteVector.concatenate(
                ByteVector.fromString(key, StringType.UTF8),
                ByteVector.fromUint(v.length, false),
                v,
                (v.length % 2 === 1) ? 0x00 : undefined
            ));

            return ByteVector.concatenate(... valuesBytes);
        });

        // Render all the nested lists
        const listData = Array.from(this._lists.values(), (lists) => {
            const listsBytes = lists.map((l) => l.render());
            return ByteVector.concatenate(... listsBytes);
        });

        const allData = ByteVector.concatenate(
            ... valueData,
            ... listData
        );

        return ByteVector.concatenate(
            ByteVector.fromString(RiffList.IDENTIFIER_FOURCC, StringType.Latin1),
            ByteVector.fromUint(allData.length + 4, false),
            ByteVector.fromString(this._type, StringType.Latin1),
            allData,
            (allData.length % 2 === 1) ? 0x00 : undefined
        );
    }

    // #endregion
}
