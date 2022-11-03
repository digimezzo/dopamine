import BaseObject from "./baseObject";
import ContentDescriptionObject from "./contentDescriptionObject";
import FilePropertiesObject from "./filePropertiesObject";
import HeaderExtensionObject from "./headerExtensionObject";
import PaddingObject from "./paddingObject";
import ReadWriteUtils from "../readWriteUtils";
import StreamPropertiesObject from "./streamPropertiesObject";
import UnknownObject from "./unknownObject";
import {ByteVector} from "../../byteVector";
import {Guids, ObjectType} from "../constants";
import {CorruptFileError} from "../../errors";
import {File} from "../../file";
import {ICodec, Properties} from "../../properties";
import {Guards} from "../../utils";
import {ExtendedContentDescriptionObject} from "./extendedContentDescriptionObject";

/**
 * This class provides a representation of an ASF header object which can be read from and written
 * to disk.
 */
export default class HeaderObject extends BaseObject {
    private readonly _children: BaseObject[] = [];
    private _properties: Properties;
    private _reserved: number;

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new instance by reading the contents from a specified position
     * in the provided file.
     * @param file File containing contents that will be read into the new instance
     * @param position Position in the file where the instance begins
     */
    public static fromFile(file: File, position: number): HeaderObject {
        const instance = new HeaderObject();
        instance.initializeFromFile(file, position);

        if (!instance.guid.equals(Guids.ASF_HEADER_OBJECT)) {
            throw new CorruptFileError("Object GUID does not match expected header object GUID");
        }
        if (instance.originalSize < 26) {
            throw new CorruptFileError("Header object is too small");
        }

        const childCount = ReadWriteUtils.readDWord(file);
        instance._reserved = ReadWriteUtils.readWord(file);
        if (instance._reserved !== 0x0201) {
            throw new CorruptFileError("Header object is missing reserved bytes");
        }

        instance._children.push(... HeaderObject.readObjects(file, childCount, file.position));

        return instance;
    }

    // #region Properties

    /**
     * Gets that child objects of this instance.
     * @remarks The returned array is a copy of the array of children inside this object. Any
     *     changes to this array will not be reflected in the object.
     *
     *     Only certain objects are valid inside a header object. Any objects that are not valid or
     *     not supported are read as {@link UnknownObject}.
     */
    public get children(): BaseObject[] { return this._children.slice(); }

    /**
     * Gets the header extension object contained in the current instance.
     * @returns HeaderExtensionObject Header extension contained in this instance, if it exists.
     *     `undefined` is returned if it doesn't exist
     */
    public get extension(): HeaderExtensionObject {
        const extensionObj = this._children.find((o) => o.objectType === ObjectType.HeaderExtensionObject);
        return <HeaderExtensionObject> extensionObj;
    }

    /**
     * Gets whether or not the current instance contains either type of content descriptors.
     * @returns boolean `true` if a content description object or extended content description
     *     object exists in this instance. `false` otherwise
     */
    public get hasContentDescriptors(): boolean {
        return this._children.findIndex((o) => {
            return o.objectType === ObjectType.ContentDescriptionObject
                || o.objectType === ObjectType.ExtendedContentDescriptionObject;
        }) >= 0;
    }

    /** @inheritDoc */
    public get objectType(): ObjectType { return ObjectType.HeaderObject; }

    /**
     * Get the media properties contained within the current instance.
     */
    public get properties(): Properties {
        if (!this._properties) {
            const codecs: ICodec[] = [];
            let durationMilliseconds = 0;

            for (const obj of this._children) {
                if (obj.objectType === ObjectType.FilePropertiesObject) {
                    const fpObj = <FilePropertiesObject> obj;
                    durationMilliseconds = fpObj.playDurationMilliseconds - fpObj.prerollMilliseconds;
                } else if (obj.objectType === ObjectType.StreamPropertiesObject) {
                    codecs.push((<StreamPropertiesObject> obj).codec);
                }
            }

            this._properties = new Properties(durationMilliseconds, codecs);
        }

        return this._properties;
    }

    // #endregion

    // #region Methods

    /**
     * Adds a unique child object to the current instance, replacing an existing child if present.
     * @param obj Object to add to the current instance
     */
    public addUniqueObject(obj: BaseObject): void {
        // TODO: Make sure only permitted objects are allowed (and probably make sure only writable
        //    objects can be added)

        const existingIndex = this._children.findIndex((o) => o.objectType === obj.objectType);
        if (existingIndex >= 0) {
            this._children[existingIndex] = obj;
        } else {
            this._children.push(obj);
        }
    }

    /**
     * Removes the content description objects from the current instance.
     */
    public removeContentDescriptor(): void {
        for (let i = this._children.length - 1; i >= 0; i--) {
            if (this._children[i].objectType === ObjectType.ContentDescriptionObject ||
                this._children[i].objectType === ObjectType.ExtendedContentDescriptionObject) {
                this._children.splice(i, 1);
            }
        }
    }

    /** @inheritDoc */
    public render(): ByteVector {
        // Render the non-padding children
        const substantiveChildren = this._children.filter((o) => o.objectType !== ObjectType.PaddingObject);
        const childrenData = ByteVector.concatenate(... substantiveChildren.map((o) => o.render()));

        // Render any required padding
        let childCount = substantiveChildren.length;
        const sizeDifference = childrenData.length + 30 - this.originalSize;
        if (sizeDifference !== 0) {
            const paddingLength = sizeDifference > 0 ? 4096 : -sizeDifference - PaddingObject.HEADER_LENGTH;
            const obj = PaddingObject.fromSize(paddingLength);
            childrenData.addByteVector(obj.render());
            childCount++;
        }

        // Put it all together
        const output = ByteVector.concatenate(
            ReadWriteUtils.renderDWord(childCount),
            ReadWriteUtils.renderWord(this._reserved),
            childrenData
        );
        return super.renderInternal(output);
    }

    /**
     * Reads a single object from the current instance.
     * @remarks If the object read is invalid to be under the top level header object, the object
     *     will be read in as an {@link UnknownObject}.
     * @param file File to read the objects from
     * @param position Position within the file at which the object begins
     * @returns BaseObject An object of the appropriate type as read from the current instance
     */
    private static readObject(file: File, position: number): BaseObject {
        file.seek(position);
        const guid = ReadWriteUtils.readGuid(file);

        if (guid.equals(Guids.ASF_FILE_PROPERTIES_OBJECT)) {
            return FilePropertiesObject.fromFile(file, position);
        }
        if (guid.equals(Guids.ASF_STREAM_PROPERTIES_OBJECT)) {
            return StreamPropertiesObject.fromFile(file, position);
        }
        if (guid.equals(Guids.ASF_HEADER_EXTENSION_OBJECT)) {
            return HeaderExtensionObject.fromFile(file, position);
        }
        if (guid.equals(Guids.ASF_CONTENT_DESCRIPTION_OBJECT)) {
            return ContentDescriptionObject.fromFile(file, position);
        }
        if (guid.equals(Guids.ASF_EXTENDED_CONTENT_DESCRIPTION_OBJECT)) {
            return ExtendedContentDescriptionObject.fromFile(file, position);
        }
        if (guid.equals(Guids.ASF_PADDING_OBJECT)) {
            return PaddingObject.fromFile(file, position);
        }

        // There are other objects that are valid here, if any of them are needed, please create an
        // issue.
        // NOTE: Objects that are not valid under the header object should be stored as an
        //     UnknownObject

        return UnknownObject.fromFile(file, position);
    }

    /**
     * Reads a collection of objects from the current instance.
     * @param file File to read objects from
     * @param count Number of objects to read, must be a positive, 32-bit integer
     * @param position Position within the file at which to start reading objects
     * @returns BaseObject[] Array of objects read from the file
     */
    private static readObjects(file: File, count: number, position: number): BaseObject[] {
        Guards.uint(count, "count");

        const objects = [];
        for (let i = 0; i < count; i++) {
            const obj = HeaderObject.readObject(file, position);
            position += obj.originalSize;
            objects.push(obj);
        }

        return objects;
    }

    // #endregion
}
