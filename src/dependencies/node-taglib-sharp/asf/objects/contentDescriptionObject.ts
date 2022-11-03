import BaseObject from "./baseObject";
import ReadWriteUtils from "../readWriteUtils";
import {ByteVector} from "../../byteVector";
import {Guids, ObjectType} from "../constants";
import {CorruptFileError} from "../../errors";
import {File} from "../../file";

/**
 * This class extends {@see BaseObject} to provide a representation of an ASF content description
 * object. The content description object is optional and provides standard bibliographic
 * information such as title, author, copyright, description, rating information.
 */
export default class ContentDescriptionObject extends BaseObject {
    private _author: string = "";
    private _copyright: string = "";
    private _description: string = "";
    private _rating: string = "";
    private _title: string = "";

    // #region Constructors

    private constructor() {
        super();
    }

    public static fromEmpty(): ContentDescriptionObject {
        const instance = new ContentDescriptionObject();
        instance.initializeFromGuid(Guids.ASF_CONTENT_DESCRIPTION_OBJECT);

        return instance;
    }

    public static fromFile(file: File, position: number): ContentDescriptionObject {
        const instance = new ContentDescriptionObject();
        instance.initializeFromFile(file, position);

        if (!instance.guid.equals(Guids.ASF_CONTENT_DESCRIPTION_OBJECT)) {
            throw new CorruptFileError("Object GUID is not the expected content description object guid");
        }
        if (instance.originalSize < 34) {
            throw new CorruptFileError("Object size too small for content description object");
        }

        const titleLength = ReadWriteUtils.readWord(file);
        const authorLength = ReadWriteUtils.readWord(file);
        const copyrightLength = ReadWriteUtils.readWord(file);
        const descriptionLength = ReadWriteUtils.readWord(file);
        const ratingLength = ReadWriteUtils.readWord(file);

        instance._title = ReadWriteUtils.readUnicode(file, titleLength);
        instance._author = ReadWriteUtils.readUnicode(file, authorLength);
        instance._copyright = ReadWriteUtils.readUnicode(file, copyrightLength);
        instance._description = ReadWriteUtils.readUnicode(file, descriptionLength);
        instance._rating = ReadWriteUtils.readUnicode(file, ratingLength);

        return instance;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the author of the media described by the current instance.
     * @returns Author of the media or `undefined` if it is not set.
     */
    public get author(): string { return this._author || undefined; }
    /**
     * Sets the author of the media described by the current instance.
     */
    public set author(value: string) { this._author = value ?? ""; }

    /**
     * Gets the copyright information of the media described by the current instance.
     * @returns Copyright information of the media or `undefined` if it is not set.
     */
    public get copyright(): string { return this._copyright || undefined; }
    /**
     * Sets the copyright information of the media described by the current instance.
     */
    public set copyright(value: string) { this._copyright = value ?? ""; }

    /**
     * Gets the description of the media described by the current instance.
     * @returns Description of the media or `undefined` if it is not set.
     */
    public get description(): string { return this._description || undefined; }
    /**
     * Sets the description of the media described by the current instance.
     */
    public set description(value: string) { this._description = value ?? ""; }

    /**
     * Gets whether or not the current instance is empty.
     * @returns `true` if all the values are cleared. Otherwise `false` is returned.
     */
    public get isEmpty(): boolean {
        return !this._title
            && !this._author
            && !this._copyright
            && !this._description
            && !this._rating;
    }

    /** @inheritDoc */
    public get objectType(): ObjectType { return ObjectType.ContentDescriptionObject; }

    /**
     * Gets the rating of the media described by the current instance.
     * @returns Rating of the media or `undefined` if it is not set.
     */
    public get rating(): string { return this._rating || undefined; }
    /**
     * Sets the rating of the media described by the current instance.
     */
    public set rating(value: string) { this._rating = value ?? ""; }

    /**
     * Gets the title of the media described by the current instance.
     * @returns Title of the media or `undefined` if it is not set.
     */
    public get title(): string { return this._title || undefined; }
    /**
     * Sets the title of the media described by the current instance.
     */
    public set title(value: string) { this._title = value ?? ""; }

    // #endregion

    /**
     * Renders the current instance as a raw ASF object.
     */
    public render(): ByteVector {
        const titleBytes = ReadWriteUtils.renderUnicode(this._title);
        const authorBytes = ReadWriteUtils.renderUnicode(this._author);
        const copyrightBytes = ReadWriteUtils.renderUnicode(this._copyright);
        const descriptionBytes = ReadWriteUtils.renderUnicode(this._description);
        const ratingBytes = ReadWriteUtils.renderUnicode(this._rating);

        const data = ByteVector.concatenate(
            ReadWriteUtils.renderWord(titleBytes.length),
            ReadWriteUtils.renderWord(authorBytes.length),
            ReadWriteUtils.renderWord(copyrightBytes.length),
            ReadWriteUtils.renderWord(descriptionBytes.length),
            ReadWriteUtils.renderWord(ratingBytes.length),
            titleBytes,
            authorBytes,
            copyrightBytes,
            descriptionBytes,
            ratingBytes
        );

        return super.renderInternal(data);
    }
}
