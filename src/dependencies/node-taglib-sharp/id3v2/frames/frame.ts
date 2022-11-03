import Id3v2Settings from "../id3v2Settings";
import SyncData from "../syncData";
import {ByteVector, StringType} from "../../byteVector";
import {CorruptFileError, NotImplementedError} from "../../errors";
import {Id3v2FrameFlags, Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifier} from "../frameIdentifiers";
import {Guards, NumberUtils} from "../../utils";

export enum FrameClassType {
    AttachmentFrame,
    CommentsFrame,
    EventTimeCodeFrame,
    MusicCdIdentifierFrame,
    PlayCountFrame,
    PopularimeterFrame,
    PrivateFrame,
    RelativeVolumeFrame,
    SynchronizedLyricsFrame,
    TermsOfUseFrame,
    TextInformationFrame,
    UniqueFileIdentifierFrame,
    UnknownFrame,
    UnsynchronizedLyricsFrame,
    UrlLinkFrame,
    UserTextInformationFrame,
    UserUrlLinkFrame
}

export abstract class Frame {
    // #region Member Variables

    private _encryptionId: number;
    private _header: Id3v2FrameHeader;
    private _groupId: number;

    // #endregion

    // #region Constructors

    protected constructor(header: Id3v2FrameHeader) {
        this._header = header;
    }

    // #endregion Constructors

    // #region Properties

    /**
     * Gets the encryption ID applied to the current instance.
     * @returns number Value containing the encryption identifier for the current instance or
     *     `undefined` if not set.
     */
    public get encryptionId(): number | undefined {
        return NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Encryption)
            ? this._encryptionId
            : undefined;
    }
    /**
     * Sets the encryption ID applied to the current instance.
     * @param value Value containing the encryption identifier for the current instance. Must be an
     *     8-bit unsigned integer. Setting to `undefined` will remove the encryption header and ID
     */
    public set encryptionId(value: number | undefined) {
        Guards.optionalByte(value, "value");
        this._encryptionId = value;
        if (value !== undefined) {
            this.flags |= Id3v2FrameFlags.Encryption;
        } else {
            this.flags &= ~Id3v2FrameFlags.Encryption;
        }
    }

    /**
     * Gets the frame flags applied to the current instance.
     */
    public get flags(): Id3v2FrameFlags { return this._header.flags; }
    /**
     * Sets the frame flags applied to the current instance.
     * If the value includes either {@link Id3v2FrameFlags.Encryption} or
     * {@link Id3v2FrameFlags.Compression}, {@link render} will throw.
     */
    public set flags(value: Id3v2FrameFlags) { this._header.flags = value; }

    /**
     * Gets the header for the frame. For new frames this should not exist.
     * @protected
     */
    protected get header(): Id3v2FrameHeader { return this._header; }
    /**
     * Sets the header for the frame.
     * @param value Header for the frame
     * @protected
     */
    protected set header(value: Id3v2FrameHeader) { this._header = value; }

    public abstract get frameClassType(): FrameClassType;

    /**
     * Gets the frame ID for the current instance.
     * @returns FrameIdentifier Object representing of the identifier of the frame
     */
    public get frameId(): FrameIdentifier { return this._header.frameId; }

    /**
     * Gets the grouping ID applied to the current instance.
     * @returns number Value containing the grouping identifier for the current instance, or
     *     `undefined` if not set.
     */
    public get groupId(): number | undefined {
        return NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.GroupingIdentity)
            ? this._groupId
            : undefined;
    }
    /**
     * Sets the grouping ID applied to the current instance.
     * @param value Grouping identifier for the current instance. Must be a 8-bit unsigned integer.
     *     Setting to `undefined` will remove the grouping identity header and ID
     */
    public set groupId(value: number | undefined) {
        Guards.optionalByte(value, "value");
        this._groupId = value;
        if (value !== undefined) {
            this.flags |= Id3v2FrameFlags.GroupingIdentity;
        } else {
            this.flags &= ~Id3v2FrameFlags.GroupingIdentity;
        }
    }

    /**
     * Gets the size of the current instance as it was last stored on disk.
     * NOTE: This value is not used outside of reading a frame from disk, so newly created frames
     *     should not have this value set.
     */
    public get size(): number { return this._header.frameSize; }

    // #endregion

    /**
     * Creates a deep copy of the current instance.
     * This method is implemented by rendering the current instance as an ID3v2.4 frame and using
     * the frame factory to create a new frame. As such, this method should be overridden by child
     * classes.
     */
    public abstract clone(): Frame;

    /**
     * Renders the current instance, encoded in a specified ID3v2 version.
     * @param version Version of ID3v2 to use when encoding the current instance
     */
    public render(version: number): ByteVector {
        Guards.byte(version, "version");

        // Remove flags that are not supported by older versions of ID3v2
        if (version < 4) {
            const v4Flags = Id3v2FrameFlags.DataLengthIndicator | Id3v2FrameFlags.Unsynchronized;
            this.flags &= ~(v4Flags);
        }
        if (version < 3) {
            const v3Flags = Id3v2FrameFlags.Compression
                | Id3v2FrameFlags.Encryption
                | Id3v2FrameFlags.FileAlterPreservation
                | Id3v2FrameFlags.GroupingIdentity
                | Id3v2FrameFlags.ReadOnly
                | Id3v2FrameFlags.TagAlterPreservation;
            this.flags &= ~(v3Flags);
        }

        let fieldData = this.renderFields(version);

        // If we don't have any content, don't render anything. This will cause the frame to not be
        // rendered
        if (fieldData.length === 0) {
            return ByteVector.empty();
        }

        const frontData: Array<ByteVector|number> = [];
        if (NumberUtils.hasFlag(this.flags, (Id3v2FrameFlags.Compression | Id3v2FrameFlags.DataLengthIndicator))) {
            frontData.push(ByteVector.fromUint(fieldData.length));
        }
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.GroupingIdentity)) {
            frontData.push(this._groupId);
        }
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Encryption)) {
            frontData.push(this._encryptionId);
        }
        // @TODO: Implement compression
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Compression)) {
            throw new NotImplementedError("Compression is not yet supported");
        }
        // @TODO: Implement encryption
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Encryption)) {
            throw new NotImplementedError("Encryption is not yet supported");
        }
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Unsynchronized)) {
            fieldData = SyncData.unsyncByteVector(fieldData);
        }

        // Update the header size with the size of the rendered bytes and any "front" data
        const frontDataSize = frontData.reduce<number>(
            (accum, e) => accum += e instanceof ByteVector ? e.length : 1,
            0
        );
        this._header.frameSize = fieldData.length + frontDataSize;


        return ByteVector.concatenate(
            this._header.render(version),
            ...frontData,
            fieldData
        );
    }

    // #region Protected Methods

    /**
     * Converts an encoding to be a supported encoding for a specified tag version.
     * @param type Value containing the original encoding
     * @param version Value containing the ID3v2 version to be encoded.
     * @returns StringType Value containing the correct encoding to use, based on
     *     {@link Id3v2Settings.forceDefaultEncoding} and what is supported by
     *     `version`
     */
    protected static correctEncoding(type: StringType, version: number): StringType {
        Guards.byte(version, "version");

        if (Id3v2Settings.forceDefaultEncoding) {
            type = Id3v2Settings.defaultEncoding;
        }

        return version < 4 && type === StringType.UTF8
            ? StringType.UTF16
            : type;
    }

    /**
     * Extracts the field data from the raw portion of an ID3v2 frame.
     * This method is necessary for extracting extra data prepended to the frame such the as
     * grouping ID.
     * @param frameData Raw frame data
     * @param offset Index at which the data is contained
     * @param version Version of the ID3v2 tag the data was originally encoded with
     * @param dataIncludesHeader `true` if `frameData` includes the header, `false`
     *     otherwise
     */
    protected fieldData(
        frameData: ByteVector,
        offset: number,
        version: number,
        dataIncludesHeader: boolean
    ): ByteVector {
        let dataOffset = offset + (dataIncludesHeader ? Id3v2FrameHeader.getSize(version) : 0);
        let dataLength = this.size;

        if (NumberUtils.hasFlag(this.flags, (Id3v2FrameFlags.Compression | Id3v2FrameFlags.DataLengthIndicator))) {
            dataOffset += 4;
            dataLength -= 4;
        }

        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.GroupingIdentity)) {
            if (frameData.length <= dataOffset) {
                throw new CorruptFileError("Frame data incomplete");
            }
            this.groupId = frameData.get(dataOffset++);
            dataLength--;
        }

        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Encryption)) {
            if (frameData.length <= dataOffset) {
                throw new CorruptFileError("Frame data incomplete");
            }
            this._encryptionId = frameData.get(dataOffset++);
            dataLength--;
        }

        dataLength = Math.min(dataLength, frameData.length - dataOffset);
        if (dataLength < 0) {
            throw new CorruptFileError("Frame size less than zero");
        }

        let data = frameData.subarray(dataOffset, dataLength);
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Unsynchronized)) {
            data = SyncData.resyncByteVector(data);
        }

        // @FIXME: Implement encryption
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Encryption)) {
            throw new NotImplementedError("Encryption is not supported");
        }

        // @FIXME: Implement compression
        if (NumberUtils.hasFlag(this.flags, Id3v2FrameFlags.Compression)) {
            throw new NotImplementedError("Compression is not supported");
        }

        return data;
    }

    /**
     * Populates the values in this frame by parsing its field data in a specified version.
     * @param data Extracted field data
     * @param version ID3v2 version the field data is encoded in
     */
    protected abstract parseFields(data: ByteVector, version: number): void;

    /**
     * Renders the values in the current instance into field data for a specified version.
     * @param version ID3v2 version the field data is to be encoded in.
     */
    protected abstract renderFields(version: number): ByteVector;

    /**
     * Populates the current instance by reading the raw frame from disk, optionally reading the
     * header.
     * @param data Raw ID3v2 frame
     * @param offset Offset in `data` at which the frame begins.
     * @param readHeader Whether or not to read the reader into the current instance.
     * @param version Version of the ID3v2 tag the data was encoded with
     */
    protected setData(data: ByteVector, offset: number, readHeader: boolean, version: number): void {
        if (readHeader) {
            this._header = Id3v2FrameHeader.fromData(data, version);
        }
        this.parseFields(this.fieldData(data, offset, version, true), version);
    }

    // #endregion
}
