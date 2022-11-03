import BaseObject from "./baseObject";
import {ByteVector} from "../../byteVector";
import {Guids, ObjectType} from "../constants";
import {CorruptFileError} from "../../errors";
import {File} from "../../file";
import {Guards} from "../../utils";

/**
 * This class provides a representation of an ASF padding object which can be read from and
 * written to disk.
 */
export default class PaddingObject extends BaseObject {

    public static readonly HEADER_LENGTH = 24;

    private _size: number;

    // #region Constructors

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new instance by reading it from a file.
     * @param file File to read the padding object from
     * @param position Index into the file where the padding object starts from
     */
    public static fromFile(file: File, position: number): PaddingObject {
        const instance = new PaddingObject();
        instance.initializeFromFile(file, position);

        if (!instance.guid.equals(Guids.ASF_PADDING_OBJECT)) {
            throw new CorruptFileError("Object GUID does not match expected padding object GUID");
        }

        instance._size = instance.originalSize - PaddingObject.HEADER_LENGTH;
        return instance;
    }

    /**
     * Constructs and initializes a new instance with a fixed size.
     * @param size Number of padding bytes to store in the object not including the size of the
     *     header
     */
    public static fromSize(size: number): PaddingObject {
        Guards.safeUint(size, "size");

        const instance = new PaddingObject();
        instance.initializeFromGuid(Guids.ASF_PADDING_OBJECT);
        instance._size = size;

        return instance;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get objectType(): ObjectType { return ObjectType.PaddingObject; }

    /**
     * Gets the number of bytes the current instance will take up on disk. Note: this does *not*
     * include the header for the object.
     */
    public get size(): number { return this._size; }
    /**
     * Sets the number of padding bytes the current instance will contain. Note: this does *not*
     * include the header for the object.
     * @param value Size of the current instance in bytes, must be a safe, positive integer.
     */
    public set size(value: number) {
        Guards.safeUint(value, "value");
        this._size = value;
    }

    // #endregion

    /** @inheritDoc */
    public render(): ByteVector {
        return super.renderInternal(ByteVector.fromSize(this._size));
    }
}
