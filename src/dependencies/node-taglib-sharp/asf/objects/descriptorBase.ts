import UuidWrapper from "../../uuidWrapper";
import {ByteVector, StringType} from "../../byteVector";
import {CorruptFileError} from "../../errors";
import {Guards} from "../../utils";

/**
 * Indicates the type of data stored in a {@link ContentDescriptor} or {@link MetadataDescriptor} object.
 */
export enum DataType {
    /**
     * The descriptor contains Unicode (UTF-16LE) text.
     */
    Unicode = 0,

    /**
     * The descriptor contains binary data.
     */
    Bytes = 1,

    /**
     * The descriptor contains a boolean value.
     */
    Bool = 2,

    /**
     * The descriptor contains a 4-byte DWORD value.
     */
    DWord = 3,

    /**
     * The descriptor contains a 8-byte QWORD value.
     */
    QWord = 4,

    /**
     * The descriptor contains a 2-byte WORD value.
     */
    Word = 5,

    /**
     * The descriptor contains a 16-byte GUID value.
     */
    Guid = 6
}

export type DescriptorValue = bigint | boolean | ByteVector | number | string | UuidWrapper;

/**
 * Abstract class that forms the basis of extended content descriptors and metadata library records.
 */
export abstract class DescriptorBase {
    private readonly _name: string;
    private readonly _type: DataType;

    private readonly _boolValue: boolean;
    private readonly _byteValue: ByteVector;
    private readonly _dWordValue: number;
    private readonly _guidValue: UuidWrapper;
    private readonly _qWordValue: bigint;
    private readonly _stringValue: string;
    private readonly _wordValue: number;

    protected constructor(name: string, type: DataType, value: DescriptorValue) {
        this._name = name;
        this._type = type;

        switch (type) {
            case DataType.Word:
                if (typeof(value) !== "number") {
                    throw new Error("Invalid value type for datatype WORD");
                }

                Guards.ushort(value, "value");
                this._wordValue = value;
                break;
            case DataType.DWord:
                if (typeof(value) !== "number") {
                    throw new Error("Invalid value type for datatype DWORD");
                }

                Guards.uint(value, "value");
                this._dWordValue = value;
                break;
            case DataType.QWord:
                if (typeof(value) !== "bigint") {
                    throw new Error("Invalid value type for datatype QWORD");
                }

                Guards.ulong(value, "value");
                this._qWordValue = value;
                break;
            case DataType.Bool:
                if (typeof(value) !== "boolean") {
                    throw new Error("Invalid value type for datatype boolean");
                }

                this._boolValue = value;
                break;
            case DataType.Unicode:
                if (typeof(value) !== "string") {
                    throw new Error("Invalid value type for datatype unicode");
                }

                this._stringValue = value;
                break;
            case DataType.Bytes:
                if (!(value instanceof ByteVector)) {
                    throw new Error("Invalid value type for datatype bytes");
                }

                this._byteValue = value.toByteVector();
                break;
            case DataType.Guid:
                if (!(value instanceof UuidWrapper)) {
                    throw new Error("Invalid value type for datatype GUID");
                }

                this._guidValue = value;
                break;
            default:
                throw new CorruptFileError(`Invalid datatype ${type}`);
        }
    }

    // #region Properties

    /**
     * Gets the name of the current instance.
     */
    public get name(): string { return this._name; }

    /**
     * Gets the type of data contained in the current instance.
     */
    public get type(): DataType { return this._type; }

    /**
     * Gets the boolean value of the current instance.
     * @returns boolean Boolean value of the current instance is returned if {@link type} is
     *     {@link DataType.Bool}. `undefined` is returned otherwise.
     */
    public get boolValue(): boolean { return this._boolValue; }

    /**
     * Gets the binary contents of the current instance.
     * @returns ByteVector Byte contents of the current instance, if {@link type} is
     *     {@link DataType.Bytes}. `undefined` is returned otherwise.
     */
    public get byteValue(): ByteVector { return this._byteValue; }

    /**
     * Gets the guid contents of the current instance.
     * @returns UuidWrapper GUID contents of the current instance, if {@link type} is
     *     {@link DataType.Guid}. `undefined` is returned otherwise.
     */
    public get guidValue(): UuidWrapper { return this._guidValue; }

    /**
     * Gets the string contents of the current instance.
     * @returns string String contents of the current instance if {@link type} is
     *     {@link DataType.Unicode}. `undefined` is returned otherwise.
     */
    public get stringValue(): string { return this._stringValue; }

    /**
     * Gets the 32-bit double word contents of the current instance.
     * @returns number Double word contents of the current instance, if {@link type} is
     *      {@link DataType.DWord}. `undefined` is returned otherwise.
     */
    public get uintValue(): number { return this._dWordValue; }

    /**
     * Gets the 64-bit quad word contents of the current instance.
     * @returns bigint Quad word contents of the current instance, if {@link type} is
     *     {@link DataType.QWord}. `undefined` is returned otherwise.
     */
    public get ulongValue(): bigint { return this._qWordValue; }

    /**
     * Gets the 16-bit word contents of the current instance.
     * @returns number Word contents of the current instance, if {@link type} is
     *     {@link DataType.Word}. `undefined` is returned otherwise.
     */
    public get ushortValue(): number { return this._wordValue; }

    public abstract render(): ByteVector;

    /** @inheritDoc */
    public toString(): string {
        switch (this._type) {
            case DataType.QWord:
                return this._qWordValue.toString();
            case DataType.DWord:
                return this._dWordValue.toString();
            case DataType.Word:
                return this._wordValue.toString();
            case DataType.Bool:
                return this._boolValue.toString();
            case DataType.Unicode:
                return this._stringValue;
            case DataType.Bytes:
                return this._byteValue.toString(StringType.UTF16LE);
            case DataType.Guid:
                return this._guidValue.toString();
        }
        return undefined;
    }

    // #endregion
}
