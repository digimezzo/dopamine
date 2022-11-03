import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {Guards, NumberUtils} from "../utils";

/**
 * Indicates the type of data stored in a {@link ApeTagItem} object.
 */
export enum ApeTagItemType {
    /**
     * Item contains unicode text
     */
    Text = 0,

    /**
     * Item contains binary data
     */
    Binary = 1,

    /**
     * Item contains a locator (file path/URL) for external information
     */
    Locator = 2
}

export class ApeTagItem {
    private _data: ByteVector;
    private _isReadonly: boolean = false;
    private _key: string;
    private _size: number = 0;
    private _text: string[];
    private _type: ApeTagItemType = ApeTagItemType.Text;

    // #region Constructors

    private constructor() { /* empty to enforce static construction */ }

    /**
     * Constructs and initializes a new instance of {@link ApeTagItem} with a specified key and binary
     * data to use as the value.
     * @param key Key to use for the item
     * @param value Binary data to store as the value
     */
    public static fromBinaryValue(key: string, value: ByteVector): ApeTagItem {
        Guards.notNullOrUndefined(key, "key");
        Guards.truthy(value, "value");

        const item = new ApeTagItem();
        item._key = key;
        item._type = ApeTagItemType.Binary;
        item._data = value;

        return item;
    }

    /**
     * Constructs a new instance of {@link ApeTagItem} by reading in a raw APEv2 item.
     * @param data {@link ByteVector} containing the item to read
     * @param offset Index into `data` at which to begin reading the item data. Must be
     *     a positive 32-bit integer.
     */
    public static fromData(data: ByteVector, offset: number): ApeTagItem {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");

        const item = new ApeTagItem();

        // 11 bytes is the minimum size for an APE item
        if (data.length < offset + 11) {
            throw new CorruptFileError("Not enough data for APE item");
        }

        const valueLength = data.subarray(offset, 4).toUint(false);
        const flags = data.subarray(offset + 4, 4).toUint(false);

        // Read flag data
        item._isReadonly = NumberUtils.hasFlag(flags, 1);
        item._type = <ApeTagItemType> NumberUtils.uintAnd(NumberUtils.uintRShift(flags, 1), 3);

        // Read key
        const keyStartIndex = offset + 8;
        const keyEndIndex = data.offsetFind(ByteVector.getTextDelimiter(StringType.UTF8), offset + 8);
        const keyLength = keyEndIndex - keyStartIndex;
        item._key = data.subarray(keyStartIndex, keyLength).toString(StringType.UTF8);

        if (valueLength > data.length - keyEndIndex - 1) {
            throw new CorruptFileError("Invalid data length");
        }

        // [length of key + flags/size - offset]+[key delimiter]+[value length]
        item._size = keyEndIndex - offset + 1 + valueLength;

        if (item._type === ApeTagItemType.Binary) {
            item._data = data.subarray(keyEndIndex + 1).toByteVector();
        } else {
            item._text = data.subarray(keyEndIndex + 1, valueLength).toStrings(StringType.UTF8);
        }

        return item;
    }

    /**
     * Constructs and initializes a new instance of {@link ApeTagItem} with a specified key and collection
     * of text values.
     * @param key Key to use for the item
     * @param values Values to store in the item
     */
    public static fromTextValues(key: string, ...values: string[]): ApeTagItem {
        Guards.notNullOrUndefined(key, "name");
        Guards.truthy(values, "values");

        const item = new ApeTagItem();
        item._key = key;
        item._text = values.slice();

        return item;
    }

    // #endregion

    // #region Properties

    /**
     * Gets whether or not the current instance is empty.
     */
    public get isEmpty(): boolean {
        if (this._type === ApeTagItemType.Binary) {
            return !this._data || this._data.isEmpty;
        } else {
            return !this._text || this._text.length === 0;
        }
    }

    /**
     * Gets whether or not the current instance is flagged as read-only on disk.
     */
    public get isReadOnly(): boolean { return this._isReadonly; }

    /**
     * Gets the key that specified the contents of the item.
     * @remarks This value is used for specifying the contents of the item in a common and
     *     consistent fashion. For example, `TITLE` specifies that the item contains the title of
     *     the track.
     */
    public get key(): string { return this._key; }

    /**
     * Size of the current instance as it last appeared on disk.
     */
    public get size(): number { return this._size; }

    /**
     * Gets the string values stored in the current item, if the current item is a text item, or
     * an empty array if the current item is a binary item or no text is stored.
     */
    public get text(): string[] {
        return this._type === ApeTagItemType.Binary || !this._text
            ? []
            : this._text;
    }

    /**
     * Gets the type of value contained in the current instance.
     */
    public get type(): ApeTagItemType { return this._type; }

    /**
     * Gets the binary value stored in the current item, if the current item is a binary item, or
     * `undefined` if the current item is a text item.
     */
    public get value(): ByteVector { return this._type === ApeTagItemType.Binary ? this._data : undefined; }

    // #endregion

    // #region Methods

    /**
     * Creates a deep copy of the current instance.
     */
    public clone(): ApeTagItem {
        const newItem = new ApeTagItem();
        newItem._type = this._type;
        newItem._key = this._key;
        newItem._data = this._data ? this._data.toByteVector() : undefined;
        newItem._text = this._text ? this._text.slice() : undefined;
        newItem._isReadonly = this._isReadonly;
        newItem._size = this._size;

        return newItem;
    }

    /**
     * Renders the current instance as an APEv2 item.
     */
    public render(): ByteVector {
        if (this.isEmpty) {
            return ByteVector.empty();
        }

        // Build the byte vector for the value of the item
        let value: ByteVector;
        if (this._type === ApeTagItemType.Binary) {
            value = this._data;
        } else {
            const vectors = this._text.reduce<ByteVector[]>((acc, e, i) => {
                if (i > 0) {
                    acc.push(ByteVector.getTextDelimiter(StringType.UTF8));
                }
                acc.push(ByteVector.fromString(e, StringType.UTF8));
                return acc;
            }, []);
            value = ByteVector.concatenate(...vectors);
        }

        // Calculate the flags and length
        let flags = this._isReadonly ? 1 : 0;
        flags |= this._type << 1;
        const flagsVector = ByteVector.fromUint(flags, false);
        const sizeVector = ByteVector.fromUint(value.length, false);

        // Put it all together
        const output = ByteVector.concatenate(
            sizeVector,
            flagsVector,
            ByteVector.fromString(this._key, StringType.UTF8),
            ByteVector.getTextDelimiter(StringType.UTF8),
            value
        );

        this._size = output.length;

        return output;
    }

    /**
     * Gets the contents of the current instance as a string. If the current instance is binary or
     * does not have a text array, `undefined` will be returned. Otherwise, the text values will be
     * joined into a single, comma separated list.
     */
    public toString(): string {
        return this._type === ApeTagItemType.Binary || !this._text
            ? undefined
            : this._text.join(", ");
    }

    // #endregion
}
