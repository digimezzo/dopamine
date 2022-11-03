import BaseObject from "./baseObject";
import ReadWriteUtils from "../readWriteUtils";
import UnknownObject from "./unknownObject";
import {ByteVector} from "../../byteVector";
import {Guids, ObjectType} from "../constants";
import {CorruptFileError} from "../../errors";
import {File} from "../../file";
import {MetadataLibraryObject} from "./metadataLibraryObject";

/**
 * This class extends {@link BaseObject} to provide a representation of an ASF header extension
 * object which can be read from and written to disk.
 */
export default class HeaderExtensionObject extends BaseObject {
    private _children: BaseObject[] = [];

    private constructor() {
        super();
    }

    /**
     * Constructs and initialized a new instance by reading the contents from a specified position
     * in the provided file.
     * @param file File containing contents that will be read into the new instance
     * @param position Position in the file where the instance begins
     */
    public static fromFile(file: File, position: number): HeaderExtensionObject {
        const instance = new HeaderExtensionObject();
        instance.initializeFromFile(file, position);

        if (!instance.guid.equals(Guids.ASF_HEADER_EXTENSION_OBJECT)) {
            throw new CorruptFileError("Object GUID does not match expected header extension object GUID");
        }
        if (!ReadWriteUtils.readGuid(file).equals(Guids.ASF_RESERVED)) {
            throw new CorruptFileError("Expected reserved1 GUID was not found");
        }
        if (ReadWriteUtils.readWord(file) !== 6) {
            throw new CorruptFileError("Invalid reserved word, expected '6'");
        }

        let sizeRemaining = ReadWriteUtils.readDWord(file);
        position += 0x170 / 8;

        while (sizeRemaining > 0) {
            const obj = HeaderExtensionObject.readObject(file, position);
            position += obj.originalSize;
            sizeRemaining -= obj.originalSize;
            instance._children.push(obj);
        }

        return instance;
    }

    /**
     * Gets the child ASF objects contained in the current instance.
     * @remarks The returned array is a copy of the array of children inside this object. Any
     *     changes to this array will not be reflected in the object.
     *
     *     Only certain objects are valid inside a header extension object. Any objects that are
     *     not valid or not supported are read as {@link UnknownObject}.
     */
    public get children(): BaseObject[] { return this._children.slice(); }

    /** @inheritDoc */
    public get objectType(): ObjectType { return ObjectType.HeaderExtensionObject; }

    /**
     * Adds a unique child object to the current instance, replacing an existing child if present.
     * @param obj Object to add to the current instance
     */
    public addUniqueObject(obj: BaseObject): void {
        // @TODO: Check against a list of valid object types for this object

        const existingIndex = this._children.findIndex((o) => o.objectType === obj.objectType);
        if (existingIndex >= 0) {
            this._children[existingIndex] = obj;
        } else {
            this._children.push(obj);
        }
    }

    /** @inheritDoc */
    public render(): ByteVector {
        const renderedChildren = ByteVector.concatenate(...(this._children.map((o) => o.render())));
        const output = ByteVector.concatenate(
            Guids.ASF_RESERVED.toBytes(),
            ReadWriteUtils.renderWord(6),
            ReadWriteUtils.renderDWord(renderedChildren.length),
            renderedChildren
        );
        return super.renderInternal(output);
    }

    private static readObject(file: File, position: number): BaseObject {
        file.seek(position);
        const guid = ReadWriteUtils.readGuid(file);

        if (guid.equals(Guids.ASF_METADATA_LIBRARY_OBJECT)) {
            return MetadataLibraryObject.fromFile(file, position);
        }

        // There are other objects that are valid here, if any of them are needed, please create an
        // issue. However, only objects that are valid inside this extension object should be added

        return UnknownObject.fromFile(file, position);
    }
}
