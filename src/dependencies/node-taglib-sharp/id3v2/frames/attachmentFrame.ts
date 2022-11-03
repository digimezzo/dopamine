import Id3v2Settings from "../id3v2Settings";
import {ByteVector, StringType} from "../../byteVector";
import {CorruptFileError} from "../../errors";
import {IFileAbstraction} from "../../fileAbstraction";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {IPicture, Picture, PictureLazy, PictureType} from "../../picture";
import {Guards} from "../../utils";

export default class AttachmentFrame extends Frame implements IPicture {
    // NOTE: It probably doesn't look necessary to implement IPicture, but it makes converting a
    //     frame to a picture so much easier, which we need in the Id3v2Tag class.

    private _data: ByteVector;
    private _description: string;
    private _encoding: StringType = Id3v2Settings.defaultEncoding;
    private _filename: string;
    private _mimeType: string;
    private _rawData: ByteVector;
    private _rawPicture: IPicture;
    private _rawVersion: number;
    private _type: PictureType;

    // #region Constructors

    private constructor(frameHeader: Id3v2FrameHeader) {
        super(frameHeader);
    }

    /**
     * Constructs and initializes a new attachment frame by populating it with the contents of a
     * section of a file. This constructor is only meant to be used internally. All loading is done
     * lazily.
     * @param file File to load frame data from
     * @param header ID3v2 frame header that defines the frame
     * @param frameStart Index into the file where the frame starts
     * @param size Length of the frame data
     * @param version ID3v2 version the frame was originally encoded with
     * @internal
     */
    // @TODO: Make lazy loading optional
    public static fromFile(
        file: IFileAbstraction,
        header: Id3v2FrameHeader,
        frameStart: number,
        size: number,
        version: number
    ): AttachmentFrame {
        Guards.truthy(file, "file");
        Guards.truthy(header, "header");
        Guards.safeUint(frameStart, "frameStart");
        Guards.safeUint(size, "size");

        const frame = new AttachmentFrame(header);
        frame._rawPicture = PictureLazy.fromFile(file, frameStart, size);
        frame._rawVersion = version;
        return frame;
    }

    /**
     * Constructs and initializes a new attachment frame by reading its raw data in a specified
     * ID3v2 version.
     * @param data ByteVector containing the raw representation of the new frame
     * @param offset Index into `data` where the frame actually begins
     * @param header Header of the frame found at `offset` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): AttachmentFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new AttachmentFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new attachment frame by populating it with the contents of
     * another {@link IPicture} object.
     * @param picture Value to use in the new instance.
     * @remarks When a frame is created, it is not automatically added to the tag. Consider
     *     using {@link get} for more integrated frame creation.
     *     Additionally, see {@link Tag.pictures} provides a generic way of getting and setting
     *     attachments which is preferable to format specific code.
     */
    public static fromPicture(picture: IPicture): AttachmentFrame {
        Guards.truthy(picture, "picture");

        // NOTE: We assume the frame is an APIC frame of size 1 until we parse it and find out
        //     otherwise.
        const frame = new AttachmentFrame(new Id3v2FrameHeader(FrameIdentifiers.APIC, undefined, 1));
        frame._rawPicture = picture;
        return frame;
    }

    /**
     * Constructs and initializes a new attachment frame by reading its raw data in a specified
     * Id3v2 version.
     * @param data ByteVector starting with the raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded with.
     */
    public static fromRawData(data: ByteVector, version: number): AttachmentFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new AttachmentFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.AttachmentFrame; }

    /**
     * Gets the image data stored in the current instance.
     */
    public get data(): ByteVector {
        this.parseFromRaw();
        return this._data ? this._data : ByteVector.empty();
    }
    /**
     * Sets the image data stored in the current instance.
     */
    public set data(value: ByteVector) {
        this.parseFromRaw();
        this._data = value;
    }

    /**
     * Gets the description stored in the current instance.
     */
    public get description(): string {
        this.parseFromRaw();
        return this._description ? this._description : "";
    }
    /**
     * Sets the description stored in the current instance.
     * There should only be one frame with a matching description and type per tag.
     */
    public set description(value: string) {
        this.parseFromRaw();
        this._description = value;
    }

    /**
     * Gets a filename of the picture stored in the current instance.
     */
    public get filename(): string {
        this.parseFromRaw();
        return this._filename;
    }
    /**
     * Sets a filename of the picture stored in the current instance.
     */
    public set filename(value: string) {
        this.parseFromRaw();
        this._filename = value;
    }

    /**
     * Gets the MimeType of the picture stored in the current instance.
     */
    public get mimeType(): string {
        this.parseFromRaw();

        return this._mimeType ? this._mimeType : "";
    }
    /**
     * Sets the MimeType of the picture stored in the current instance.
     * @param value MimeType of the picture stored in the current instance.
     */
    public set mimeType(value: string) {
        this.parseFromRaw();
        this._mimeType = value;
    }

    /**
     * Gets the text encoding to use when storing the current instance.
     * @value Text encoding to use when storing the current instance.
     */
    public get textEncoding(): StringType {
        this.parseFromRaw();
        return this._encoding;
    }
    /**
     * Sets the text encoding to use when storing the current instance.
     * @param value Text encoding to use when storing the current instance.
     *     This encoding is overridden when rendering if
     *     {@link Id3v2Settings.forceDefaultEncoding} is `true` or the render version does not
     *     support it.
     */
    public set textEncoding(value: StringType) {
        this.parseFromRaw();
        this._encoding = value;
    }

    /**
     * Gets the object type stored in the current instance.
     */
    public get type(): PictureType {
        this.parseFromRaw();
        return this._type;
    }
    /**
     * Sets the object type stored in the current instance.
     * For General Object Frame, use {@link PictureType.NotAPicture}. Other types will make it a
     * Picture Frame.
     */
    public set type(value: PictureType) {
        this.parseFromRaw();

        // Change the frame type depending if this is a picture or a general object
        const frameId = value === PictureType.NotAPicture
            ? FrameIdentifiers.GEOB
            : FrameIdentifiers.APIC;
        if (this.header.frameId !== frameId) {
            this.header = new Id3v2FrameHeader(frameId);
        }

        this._type = value;
    }

    // #endregion

    // #region Public Methods

    /** @inheritDoc */
    public clone(): Frame {
        const frame = new AttachmentFrame(new Id3v2FrameHeader(this.frameId));
        frame._data = this._data?.toByteVector();
        frame._description = this._description;
        frame._encoding = this._encoding;
        frame._filename = this._filename;
        frame._mimeType = this._mimeType;
        frame._rawData = this._rawData;
        frame._rawPicture = this._rawPicture;
        frame._rawVersion = this._rawVersion;
        frame._type = this._type;

        return frame;
    }

    /**
     * Get a specified attachment frame from the specified tag, optionally creating it if it does
     * not exist.
     * @param frames List of attachment frames to search
     * @param description Description to match
     * @param type Picture type to match
     * @returns Matching frame or `undefined` if a match wasn't found and `create` is
     *     `false`
     */
    public static find(
        frames: AttachmentFrame[],
        description?: string,
        type: PictureType = PictureType.Other
    ): AttachmentFrame {
        Guards.truthy(frames, "frames");
        return frames.find((f) => {
                if (description && f.description !== description) { return false; }
                // noinspection RedundantIfStatementJS
                if (type !== PictureType.Other && f.type !== type) { return false; }
                return true;
            });
    }

    public toString(): string {
        this.parseFromRaw();

        let builder = "";
        if (this.description) {
            builder += this.description;
            builder += " ";
        }
        builder += `[${this.mimeType}] ${this.data.length} bytes`;

        return builder;
    }

    // #endregion

    protected parseFields(data: ByteVector, version: number): void {
        if (data.length < 5) {
            throw new CorruptFileError("A picture frame must contain at least 5 bytes");
        }

        this._rawData = data;
        this._rawVersion = version;
    }

    protected renderFields(version: number): ByteVector {
        this.parseFromRaw();

        const encoding = AttachmentFrame.correctEncoding(this.textEncoding, version);
        let data;

        if (this.frameId === FrameIdentifiers.APIC) {
            // Render an ID3v2 attached picture
            let extensionData;
            if (version === 2) {
                let ext = Picture.getExtensionFromMimeType(this.mimeType);
                ext = ext && ext.length >= 3 ? ext.substring(ext.length - 3).toUpperCase() : "XXX";
                extensionData = ByteVector.fromString(ext, StringType.Latin1);
            } else {
                extensionData = ByteVector.concatenate(
                    ByteVector.fromString(this.mimeType, StringType.Latin1),
                    ByteVector.getTextDelimiter(StringType.Latin1)
                );
            }

            data = ByteVector.concatenate(
                encoding,
                extensionData,
                this._type,
                ByteVector.fromString(this.description, encoding),
                ByteVector.getTextDelimiter(encoding),
                this._data
            );
        } else if (this.frameId === FrameIdentifiers.GEOB) {
            // Make an ID3v2 general encapsulated object
            data = ByteVector.concatenate(
                encoding,
                this._mimeType ? ByteVector.fromString(this._mimeType, StringType.Latin1) : undefined,
                ByteVector.getTextDelimiter(StringType.Latin1),
                this._filename ? ByteVector.fromString(this._filename, encoding) : undefined,
                ByteVector.getTextDelimiter(encoding),
                this._description ? ByteVector.fromString(this._description, encoding) : undefined,
                ByteVector.getTextDelimiter(encoding),
                this._data
            );
        } else {
            throw new Error("Invalid operation: Bad frame type");
        }

        return data;
    }

    private parseFromRaw(): void {
        if (this._rawData) {
            this.parseFromRawData(false);
        } else if (this._rawPicture) {
            if (this._rawVersion !== undefined) {
                this._rawData = this._rawPicture.data.toByteVector();
                this._rawPicture = undefined;
                this.parseFromRawData(true);
            } else {
                this.parseFromRawPicture();
            }
        }
    }

    private parseFromRawData(shouldRunFieldData: boolean): void {
        // Indicate raw data has been processed
        const data = shouldRunFieldData
            ? super.fieldData(this._rawData, 0, this._rawVersion, false)
            : this._rawData;
        this._rawData = undefined;

        // Determine encoding
        this._encoding = data.get(0);
        const delim = ByteVector.getTextDelimiter(this._encoding);

        let descriptionEndIndex;
        // @TODO: Maybe make two different classes?
        if (this.frameId === FrameIdentifiers.APIC) {
            // Retrieve an ID3v2 attached picture
            if (this._rawVersion > 2) {
                // Text encoding      $xx
                // MIME type          <text string> $00
                // Picture type       $xx
                // Description        <text string according to encoding> $00 (00)
                // Picture data       <binary data>
                const mimeTypeEndIndex = data.offsetFind(ByteVector.getTextDelimiter(StringType.Latin1), 1);
                if (mimeTypeEndIndex < 0) {
                    return;
                }
                const mimeTypeLength = mimeTypeEndIndex - 1;
                this._mimeType = data.subarray(1, mimeTypeLength).toString(StringType.Latin1);

                this._type = data.get(mimeTypeEndIndex + 1);

                descriptionEndIndex = data.offsetFind(delim, mimeTypeEndIndex + 2, delim.length);
                if (descriptionEndIndex < 0) {
                    return;
                }

                const descriptionLength = descriptionEndIndex - mimeTypeEndIndex - 2;
                this._description = data.subarray(mimeTypeEndIndex + 2, descriptionLength).toString(this._encoding);
            } else {
                // Text encoding      $xx
                // Image format       $xx xx xx
                // Picture type       $xx
                // Description        <text_string> $00 (00)
                // Picture data       <binary data>
                const imageFormat = data.subarray(1, 3).toString(StringType.Latin1);
                this._mimeType = Picture.getMimeTypeFromFilename(imageFormat);

                this._type = data.get(4);

                descriptionEndIndex = data.offsetFind(delim, 5, delim.length);
                if (descriptionEndIndex < 0) {
                    return;
                }
                const descriptionLength = descriptionEndIndex - 5;
                this._description = data.subarray(5, descriptionLength).toString(this._encoding);
            }

            this._data = data.subarray(descriptionEndIndex + delim.length).toByteVector();
        } else if (this.frameId === FrameIdentifiers.GEOB) {
            // Retrieve an ID3v2 generic encapsulated object
            // Text encoding          $xx
            // MIME type              <text string> $00
            // Filename               <text string according to encoding> $00 (00)
            // Content description    <text string according to encoding> $00 (00)
            // Encapsulated object    <binary data>
            const mimeTypeEndIndex = data.find(ByteVector.getTextDelimiter(StringType.Latin1));
            if (mimeTypeEndIndex === -1) {
                return;
            }
            const mimeTypeLength = mimeTypeEndIndex - 1;
            this._mimeType = data.subarray(1, mimeTypeLength)
                .toString(StringType.Latin1);

            const filenameEndIndex = data.offsetFind(delim, mimeTypeEndIndex + 1, delim.length);
            const filenameLength = filenameEndIndex - mimeTypeEndIndex - 1;
            this._filename = data.subarray(mimeTypeEndIndex + 1, filenameLength)
                .toString(this._encoding);

            descriptionEndIndex = data.offsetFind(delim, filenameEndIndex + delim.length, delim.length);
            const descriptionLength = descriptionEndIndex - filenameEndIndex - delim.length;
            this._description = data.subarray(filenameEndIndex + delim.length, descriptionLength)
                .toString(this._encoding);

            this._data = data.subarray(descriptionEndIndex + delim.length).toByteVector();
            this._type = PictureType.NotAPicture;
        } else {
            // Unsupported
            throw new Error("Unsupported: AttachmentFrame cannot be used for frame IDs other than GEOB or APIC");
        }
    }

    private parseFromRawPicture(): void {
        // Indicate raw picture has been processed
        const picture = this._rawPicture;
        this._rawPicture = undefined;

        // Bring over values from the picture
        this._data = picture.data.toByteVector();
        this._description = picture.description;
        this._filename = picture.filename;
        this._mimeType = picture.mimeType;
        this._type = picture.type;
        this.header.frameSize = this._data.length;

        this._encoding = Id3v2Settings.defaultEncoding;

        // Switch the frame ID if we discovered the attachment isn't an image
        if (this._type === PictureType.NotAPicture) {
            this.header.frameId = FrameIdentifiers.GEOB;
        }
    }
}
