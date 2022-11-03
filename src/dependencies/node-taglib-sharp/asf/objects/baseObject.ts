import ReadWriteUtils from "../readWriteUtils";
import UuidWrapper from "../../uuidWrapper";
import {ByteVector} from "../../byteVector";
import {ObjectType} from "../constants";
import {UnsupportedFormatError} from "../../errors";
import {File} from "../../file";
import {Guards} from "../../utils";

/**
 * Base object that provides a basic representation of an ASF object that can be written to and
 * read from the disk.
 */
export default abstract class BaseObject {
    private _id: UuidWrapper;
    private _originalSize: number = 0;

    // #region Initializers

    protected constructor() { /* empty to only allow construction via static constructors */ }

    /**
     * Initializes a new instance by reading the contents from a specified position in a specified
     * file.
     * @param file File which contains the details of the new instance to create
     * @param position Position in `file` where the object begins
     * @protected
     */
    protected initializeFromFile(file: File, position: number): void {
        Guards.truthy(file, "file");
        Guards.uint(position, "position");
        Guards.lessThanInclusive(position, file.length - 24, "position");

        file.seek(position);
        this._id = ReadWriteUtils.readGuid(file);

        const bigOriginalSize = ReadWriteUtils.readQWord(file);
        if (bigOriginalSize > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new UnsupportedFormatError("Object is too large to be handled with this version of library.");
        }
        this._originalSize = Number(bigOriginalSize);
    }

    /**
     * Initializes a new instance with a specified GUID.
     * @param guid GUID to use for the new instance.
     * @protected
     */
    protected initializeFromGuid(guid: UuidWrapper): void {
        this._id = guid;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the GUID that identifies the current instance.
     */
    public get guid(): UuidWrapper { return this._id; }

    /**
     * Gets the type of the object for easy comparison.
     */
    public abstract get objectType(): ObjectType;

    /**
     * Gets the original size of the current instance.
     */
    public get originalSize(): number { return this._originalSize; }

    // #endregion

    // #region Methods

    /**
     * Renders the current instance as a raw ASF object.
     */
    public abstract render(): ByteVector;

    /**
     * Renders the current instance as a raw ASF object containing the specified data.
     * @param data Data to store in the rendered version of the current instance.
     * @remarks Child classes implementing {@see render()} should render their contents and then
     *     send the data through this method to produce the final output.
     */
    protected renderInternal(data: ByteVector): ByteVector {
        const length = BigInt((!!data ? data.length : 0) + 24);
        return ByteVector.concatenate(
            this._id.toBytes(),
            ReadWriteUtils.renderQWord(length),
            data
        );
    }

    // #endregion
}
