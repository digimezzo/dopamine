import Id3v2Settings from "./id3v2Settings";
import SyncData from "./syncData";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {Guards, NumberUtils} from "../utils";

export enum Id3v2TagHeaderFlags {
    /**
     * The header contains no flags.
     */
    None = 0x0,

    /**
     * The tag described by the header contains a footer.
     */
    FooterPresent = 0x10,

    /**
     * The tag described by the header is experimental.
     */
    ExperimentalIndicator = 0x20,

    /**
     * The tag described by the header contains an extended header.
     */
    ExtendedHeader = 0x40,

    /**
     * The tag described by the header has been unsynchronized using the ID3v2 unsynchronization
     * scheme.
     */
    Unsynchronization = 0x80,
}

export class Id3v2TagHeader {
    /**
     * The identifier used to recognize an ID3v2 header.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("ID3", StringType.Latin1).makeReadOnly();

    private _flags: Id3v2TagHeaderFlags = Id3v2TagHeaderFlags.None;
    private _majorVersion: number = 0;
    private _revisionNumber: number = 0;
    private _tagSize: number = 0;

    /**
     * Constructs and initializes a new instance by reading it from the raw header data.
     * @param data Object containing the raw data to build the new instance from.
     */
    public static fromData(data: ByteVector): Id3v2TagHeader {
        Guards.truthy(data, "data");
        if (data.length < Id3v2Settings.headerSize) {
            throw new CorruptFileError("Provided data is smaller than object size");
        }
        if (!data.startsWith(Id3v2TagHeader.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Provided data does not start with the file identifier");
        }

        const header = new Id3v2TagHeader();
        header._majorVersion = data.get(3);
        header._revisionNumber = data.get(4);
        header._flags = data.get(5);

        // Make sure flags provided are legal
        if (header._majorVersion === 2 && NumberUtils.hasFlag(header._flags, 63)) {
            throw new CorruptFileError("Invalid flags set on version 2 tag");
        }
        if (header._majorVersion === 3 && NumberUtils.hasFlag(header._flags, 15)) {
            throw new CorruptFileError("Invalid flags set on version 3 tag");
        }
        if (header._majorVersion === 4 && NumberUtils.hasFlag(header._flags, 7)) {
            throw new CorruptFileError("Invalid flags set on version 4 tag");
        }

        // Make sure the bytes for the size of the tag are legal
        for (let i = 6; i < 10; i++) {
            if (data.get(i) >= 128) {
                throw new CorruptFileError("One of the bytes in the tag size was greater than the allowed 128");
            }
        }
        header.tagSize = SyncData.toUint(data.subarray(6, 4));

        return header;
    }

    // #region Properties

    /**
     * Gets the complete size of the tag described by the current instance including the header
     * and footer.
     */
    public get completeTagSize(): number {
        return NumberUtils.hasFlag(this._flags, Id3v2TagHeaderFlags.FooterPresent)
            ? this.tagSize + Id3v2Settings.headerSize + Id3v2Settings.footerSize
            : this.tagSize + Id3v2Settings.headerSize;
    }

    /**
     * Gets the flags applied to the current instance.
     */
    public get flags(): Id3v2TagHeaderFlags { return this._flags; }
    /**
     * Sets the flags applied to the current instance.
     * @param value Bitwise combined {@link Id3v2TagHeaderFlags} value containing the flags to apply to the
     *     current instance.
     */
    public set flags(value: Id3v2TagHeaderFlags) {
        // @TODO: Does it make sense to check for flags for major version <4?
        const version3Flags = Id3v2TagHeaderFlags.ExtendedHeader | Id3v2TagHeaderFlags.ExperimentalIndicator;
        if (NumberUtils.hasFlag(value, version3Flags) && this.majorVersion < 3) {
            throw new Error("Feature only supported in version 2.3+");
        }
        const version4Flags = Id3v2TagHeaderFlags.FooterPresent;
        if (NumberUtils.hasFlag(value, version4Flags) && this.majorVersion < 4) {
            throw new Error("Feature only supported in version 2.4+");
        }

        this._flags = value;
    }

    /**
     * Gets the major version of the tag described by the current instance.
     */
    public get majorVersion(): number {
        return this._majorVersion === 0 || Id3v2Settings.forceDefaultVersion
            ? Id3v2Settings.defaultVersion
            : this._majorVersion;
    }
    /**
     * Sets the major version of the tag described by the current instance.
     * When the version is set, unsupported header flags will automatically be removed from the
     * tag.
     * @param value ID3v2 version of tag. Must be a positive 8-bit integer betweenInclusive 2 and 4.
     */
    public set majorVersion(value: number) {
        Guards.byte(value, "value");
        Guards.betweenInclusive(value, 2, 4, "value");

        // @TODO: do we need to support setting to versions <4?
        if (value < 3) {
            this._flags &= ~(Id3v2TagHeaderFlags.ExtendedHeader | Id3v2TagHeaderFlags.ExperimentalIndicator);
        }
        if (value < 4) {
            this._flags &= ~Id3v2TagHeaderFlags.FooterPresent;
        }

        this._majorVersion = value;
    }

    /**
     * Gets the version revision number of the tag represented by the current instance.
     */
    public get revisionNumber(): number { return this._revisionNumber; }
    /**
     * Sets the version revision number of the tag represented by the current instance.
     * This value should always be zero. Non-zero values indicate an experimental or new version of
     * the format which may not be completely understood by the current version of
     * node-taglib-sharp. Some software may refuse to read tags with a non-zero value.
     * @param value Version revision number of the tag represented by the current instance. Must be
     *     an 8-bit unsigned integer.
     */
    public set revisionNumber(value: number) {
        Guards.byte(value, "value");
        this._revisionNumber = value;
    }

    /**
     * Gets the complete size of the tag described by the current instance, minus the header and
     * footer.
     */
    public get tagSize(): number { return this._tagSize; }
    /**
     * Sets the complete size of the tag described by the current instance, minus the header
     * footer. NOTE THIS MUST BE A 28-BIT UNSIGNED INTEGER.
     * @param value Size of the tag in bytes. Must be an unsigned 28-bit integer
     */
    public set tagSize(value: number) {
        Guards.uint(value, "value");
        if (NumberUtils.hasFlag(value, 0xF0000000)) {
            throw new Error("Argument out of range: value must be a 28-bit unsigned integer");
        }

        this._tagSize = value;
    }

    // #endregion

    /**
     * Renders the current instance as a raw ID3v2 header
     */
    public render(): ByteVector {
        return ByteVector.concatenate(
            Id3v2TagHeader.FILE_IDENTIFIER,
            this.majorVersion,
            this.revisionNumber,
            this.flags,
            SyncData.fromUint(this.tagSize)
        );
    }
}
