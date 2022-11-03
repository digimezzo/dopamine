import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {Guards, NumberUtils} from "../utils";

/**
 * Indicates the flags applied to a {@link ApeTagFooter} object.
 */
export enum ApeTagFooterFlags {
    /**
     * Tag lacks a footer.
     */
    FooterAbsent = 0x40000000,

    /**
     * Tag contains a header.
     */
    HeaderPresent = 0x80000000,

    /**
     * This footer is actually a header.
     */
    IsHeader = 0x20000000
}

// @TODO: Verify that this is specifically APEv2.
/**
 * Representation of an APEv2 tag footer or header which can be read from and written to disk.
 */
export class ApeTagFooter {
    /**
     * Identifier used to fina an APEv2 footer in a file.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("APETAGEX", StringType.Latin1).makeReadOnly();

    /**
     * Size of an APEv2 footer.
     */
    public static readonly SIZE = 32;

    private _flags: ApeTagFooterFlags = 0;
    private _itemCount: number = 0;
    private _itemSize: number = 0;
    private _version: number = 0;

    // #region Constructors

    private constructor() { /* empty to enforce static construction */ }

    /**
     * Constructs and initializes a new instance of {@link ApeTagFooter} by reading it from raw
     * footer data.
     * @param data Raw data to build the new instance from.
     */
    public static fromData(data: ByteVector): ApeTagFooter {
        Guards.truthy(data, "data");
        if (data.length < ApeTagFooter.SIZE) {
            throw new CorruptFileError("Provided data is smaller than object size");
        }
        if (!data.startsWith(ApeTagFooter.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Provided data does not start with file identifier");
        }

        const footer = new ApeTagFooter();
        footer._version = data.subarray(8, 4).toUint(false);
        footer._itemCount = data.subarray(16, 4).toUint(false);
        footer._flags = <ApeTagFooterFlags> data.subarray(20, 4).toUint(false);

        const itemPlusFooterSize = footer._itemSize = data.subarray(12, 4).toUint(false);
        if (itemPlusFooterSize < ApeTagFooter.SIZE) {
            throw new CorruptFileError("Tag size is out of bounds");
        }
        footer._itemSize = itemPlusFooterSize - ApeTagFooter.SIZE;

        return footer;
    }

    /**
     * Constructs and initializes a new, blank instance of {@link ApeTagFooter}.
     */
    public static fromEmpty(): ApeTagFooter {
        const footer = new ApeTagFooter();

        // Always default to version 2000
        footer._version = 2000;
        return footer;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the flags that apply to the current instance.
     */
    public get flags(): ApeTagFooterFlags { return this._flags; }
    /**
     * Sets the flags that apply to the current instance.
     */
    public set flags(value: ApeTagFooterFlags) { this._flags = value; }

    /**
     * Gets the number of items in the tag represented by this footer.
     */
    public get itemCount(): number { return this._itemCount; }
    /**
     * Sets the number of items in the tag represented by this footer.
     * @param value
     */
    public set itemCount(value: number) {
        Guards.uint(value, "value");
        this._itemCount = value;
    }

    /**
     * Gets the size in bytes of the items contained in the tag represented by this footer.
     */
    public get itemSize(): number { return this._itemSize; }
    /**
     * Sets the size in bytes of the items contained in the tag represented by this footer.
     * @param value
     */
    public set itemSize(value: number) {
        Guards.uint(value, "value");
        this._itemSize = value;
    }

    /**
     * Gets the size in bytes of the items contained in the tag and the footer. This is the minimum
     * amount of data required to read the entire tag.
     */
    public get requiredDataSize(): number { return this.itemSize + ApeTagFooter.SIZE; }

    /**
     * Gets the complete size of the tag represented by the current instance, including the header
     * and footer.
     */
    public get tagSize(): number {
        // @TODO: Shouldn't this take into consideration footer missing flags?
        return this._itemSize + ApeTagFooter.SIZE +
            (NumberUtils.hasFlag(this._flags, ApeTagFooterFlags.HeaderPresent) ? ApeTagFooter.SIZE : 0);
    }

    /**
     * Gets the version of APE tag described by the current instance.
     */
    public get version(): number { return this._version === 0 ? 2000 : this._version; }

    // #endregion

    // #region Methods

    public renderFooter(): ByteVector {
        return this.render(false);
    }

    public renderHeader(): ByteVector {
        return NumberUtils.hasFlag(this.flags, ApeTagFooterFlags.HeaderPresent)
            ? this.render(true)
            : ByteVector.empty();
    }

    private render(isHeader: boolean): ByteVector {
        const v = ByteVector.concatenate(
            // File identifier
            ApeTagFooter.FILE_IDENTIFIER,

            // Add the version number -- we always render a 2.000 tag regardless of what the tag
            // originally was.
            ByteVector.fromUint(2000, false),

            // Add the tag size
            ByteVector.fromUint(this.itemSize + ApeTagFooter.SIZE, false),

            // Add the item count
            ByteVector.fromUint(this.itemCount, false)
        );

        // Render and add the flags
        let flags = 0;
        if (NumberUtils.hasFlag(this.flags, ApeTagFooterFlags.HeaderPresent)) {
            flags = NumberUtils.uintOr(flags, ApeTagFooterFlags.HeaderPresent);
        }

        // Footer is always present
        if (isHeader) {
            flags = NumberUtils.uintOr(flags, ApeTagFooterFlags.IsHeader);
        } else {
            flags = NumberUtils.uintAnd(flags, ~ApeTagFooterFlags.IsHeader);
        }
        v.addByteVector(ByteVector.fromUint(flags, false));

        // Add the reserved 64bit
        v.addByteVector(ByteVector.fromSize(8));

        return v;
    }

    // #endregion
}
