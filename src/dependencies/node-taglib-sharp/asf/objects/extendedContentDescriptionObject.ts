import BaseObject from "./baseObject";
import ReadWriteUtils from "../readWriteUtils";
import {ByteVector} from "../../byteVector";
import {Guids, ObjectType} from "../constants";
import {DataType, DescriptorBase, DescriptorValue} from "./descriptorBase";
import {CorruptFileError} from "../../errors";
import {File} from "../../file";
import {Guards} from "../../utils";

/**
 * This class provides a representation of an ASF content descriptor to be used in combination with
 * {@link ExtendedContentDescriptionObject}.
 * @remarks This class can store various types of information. Although {@link toString} provides
 *     a representation of all types of values, it is recommended to determine which of the `get*`
 *     methods to use by accessing {@link type}
 */
export class ContentDescriptor extends DescriptorBase {

    // #region Constructors

    public constructor(name: string, type: DataType, value: DescriptorValue) {
        super (name, type, value);
    }

    /**
     * Instantiates a new instance by reading in the contents from a file.
     * @param file The file to read the raw ASF description record from
     * @internal
     */
    public static fromFile(file: File): ContentDescriptor {
        Guards.truthy(file, "file");

        const nameLength = ReadWriteUtils.readWord(file);
        const name = ReadWriteUtils.readUnicode(file, nameLength);

        const type = <DataType> ReadWriteUtils.readWord(file);

        const valueLength = ReadWriteUtils.readWord(file);
        let value: DescriptorValue;
        switch (type) {
            case DataType.Word:
                value = ReadWriteUtils.readWord(file);
                break;
            case DataType.Bool:
                // NOTE: for content descriptors, bool is a DWORD!!!!
                value = ReadWriteUtils.readDWord(file) > 0;
                break;
            case DataType.DWord:
                value = ReadWriteUtils.readDWord(file);
                break;
            case DataType.QWord:
                value = ReadWriteUtils.readQWord(file);
                break;
            case DataType.Unicode:
                value = ReadWriteUtils.readUnicode(file, valueLength);
                break;
            case DataType.Bytes:
                value = file.readBlock(valueLength);
                break;
            case DataType.Guid:
                value = ReadWriteUtils.readGuid(file);
                break;
            default:
                throw new CorruptFileError("Failed to parse description record.");
        }

        return new ContentDescriptor(name, type, value);
    }

    // #endregion

    /** @inheritDoc */
    public render(): ByteVector {
        let value: ByteVector;
        switch (this.type) {
            case DataType.QWord:
                value = ReadWriteUtils.renderQWord(this.ulongValue);
                break;
            case DataType.DWord:
                value = ReadWriteUtils.renderDWord(this.uintValue);
                break;
            case DataType.Word:
                value = ReadWriteUtils.renderWord(this.ushortValue);
                break;
            case DataType.Bool:
                // NOTE: for content descriptors, bool is a DWORD!!!!
                value = ReadWriteUtils.renderDWord(this.boolValue ? 1 : 0);
                break;
            case DataType.Unicode:
                value = ReadWriteUtils.renderUnicode(this.stringValue);
                break;
            case DataType.Bytes:
                value = this.byteValue;
                break;
            case DataType.Guid:
                value = this.guidValue.toBytes();
                break;
        }

        const nameBytes = ReadWriteUtils.renderUnicode(this.name);
        return ByteVector.concatenate(
            ReadWriteUtils.renderWord(nameBytes.length),
            nameBytes,
            ReadWriteUtils.renderWord(this.type),
            ReadWriteUtils.renderWord(value.length),
            value
        );
    }
}

/**
 * This class provides a representation of an ASF extended contend description object which can be
 * read from and written to disk.
 */
export class ExtendedContentDescriptionObject extends BaseObject {
    private _descriptors: ContentDescriptor[] = [];

    // #region Constructors

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new, empty extended content description object.
     */
    public static fromEmpty(): ExtendedContentDescriptionObject {
        const instance = new ExtendedContentDescriptionObject();
        instance.initializeFromGuid(Guids.ASF_EXTENDED_CONTENT_DESCRIPTION_OBJECT);
        return instance;
    }

    /**
     * Constructs and initializes a new instance that is read in from the provided file at the
     * provided position.
     * @param file File to read the instance from. Must not be falsey
     * @param position Position in the file where the instance begins. Must be a positive, safe
     *     integer.
     */
    public static fromFile(file: File, position: number): ExtendedContentDescriptionObject {
        const instance = new ExtendedContentDescriptionObject();
        instance.initializeFromFile(file, position);

        if (!instance.guid.equals(Guids.ASF_EXTENDED_CONTENT_DESCRIPTION_OBJECT)) {
            throw new CorruptFileError("Object GUID does not match expected content description object GUID");
        }
        if (instance.originalSize < 26) {
            throw new CorruptFileError("Metadata library object is too small");
        }

        const count = ReadWriteUtils.readWord(file);
        for (let i = 0; i < count; i++) {
            instance._descriptors.push(ContentDescriptor.fromFile(file));
        }

        return instance;
    }

    // #endregion

    // #region properties

    /**
     * Gets all descriptors stored in the current instance.
     */
    public get descriptors(): ContentDescriptor[] { return this._descriptors; }

    /**
     * Gets whether or not the current instance contains any records.
     * @returns boolean `true` if the current instance does not contain any records, `false`
     *     otherwise.
     */
    public get isEmpty(): boolean { return this._descriptors.length === 0; }

    /** @inheritDoc */
    public get objectType(): ObjectType { return ObjectType.ExtendedContentDescriptionObject; }

    // #endregion

    // #region Methods

    /**
     * Adds a descriptor to the current instance.
     * @param descriptor Record to add to the current instance
     */
    public addDescriptor(descriptor: ContentDescriptor): void {
        Guards.truthy(descriptor, "descriptor");
        this._descriptors.push(descriptor);
    }

    /**
     * Gets all descriptors with a name matching one of the provided collection of names the
     * current instance.
     * @param names List of names of the records to return
     */
    public getDescriptors(... names: string[]): ContentDescriptor[] {
        Guards.truthy(names, "names");

        const results = [];

        // Iterate over *names* first to get an implicit sorting of preferred descriptor name first
        for (const name of names) {
            for (const descriptor of this._descriptors) {
                if (descriptor.name === name) {
                    results.push(descriptor);
                }
            }
        }

        return results;
    }

    /**
     * Removes all descriptors with a given name from the current instance.
     * @param name Name of the descriptor to be removed
     */
    public removeDescriptors(name: string): void {
        Guards.notNullOrUndefined(name, "name");
        for (let i = this._descriptors.length - 1; i >= 0; i--) {
            if (this._descriptors[i].name === name) {
                this._descriptors.splice(i, 1);
            }
        }
    }

    /** @inheritDoc */
    public render(): ByteVector {
        const output = ByteVector.concatenate(
            ReadWriteUtils.renderWord(this._descriptors.length),
            ... this._descriptors.map((r) => r.render())
        );
        return super.renderInternal(output);
    }

    /**
     * Sets a collection of descriptors for a given name, removing the existing matching records.
     * @param name Name of the descriptors to be added/removed
     * @param descriptors Descriptors to add to the new instance
     * @remarks All added descriptors should have their name set to `name` but this is not
     *     verified by the method. The descriptors will be added with their own names and not the
     *     one provided as an argument, which is only used for removing existing values and
     *     determining where to position the new descriptors.
     */
    public setDescriptors(name: string, ... descriptors: ContentDescriptor[]): void {
        Guards.notNullOrUndefined(name, "name");

        let position = this._descriptors.length;
        for (let i = this._descriptors.length - 1; i >= 0; i--) {
            // Remove matching records
            const descriptor = this._descriptors[i];
            if (descriptor.name === name) {
                this._descriptors.splice(i, 1);
                position = i;
            }
        }

        // Insert the new records
        this._descriptors.splice(position, 0, ... descriptors);
    }

    // #endregion
}
