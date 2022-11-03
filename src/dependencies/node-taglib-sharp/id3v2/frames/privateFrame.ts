import {ByteVector, StringType} from "../../byteVector";
import {CorruptFileError, NotImplementedError} from "../../errors";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {Guards} from "../../utils";

/**
 * This class extends {@link Frame} implementing support for ID3v2 private (PRIV) frames.
 * A PrivateFrame should be used for storing values specific to the application that cannot or
 * should not be stored in another frame type.
 */
export default class PrivateFrame extends Frame {
    private _owner: string;
    private _privateData: ByteVector;

    // #region Constructors

    private constructor(header: Id3v2FrameHeader) {
        super(header);
    }

    /**
     * Constructs and initializes a new instance with the provided owner
     * @param owner Owner of the private frame
     */
    public static fromOwner(owner: string): PrivateFrame {
        const frame = new PrivateFrame(new Id3v2FrameHeader(FrameIdentifiers.PRIV));
        frame._owner = owner;
        frame._privateData = ByteVector.empty();
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version. This method allows for offset reading from the data byte vector.
     * @param data Raw representation of the new frame
     * @param offset What offset in `data` the frame actually begins. Must be positive,
     *     safe integer
     * @param header Header of the frame found at `data` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): PrivateFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version,  "version");

        const frame = new PrivateFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified
     * ID3v2 version.
     * @param data Raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded with, must be a positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): PrivateFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new PrivateFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Public Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.PrivateFrame; }

    /**
     * Gets the owner of the current instance.
     * There should only be one frame with a given owner per tag.
     */
    public get owner(): string { return this._owner; }

    /**
     * Gets the private data stored in the current instance.
     */
    public get privateData(): ByteVector { return this._privateData; }
    /**
     * Sets the private data stored in the current instance.
     * @param value Private data to store in the current instance
     */
    public set privateData(value: ByteVector) { this._privateData = value; }

    // #endregion

    /**
     * Get a specified private frame from the list of private frames that matches the provided
     * parameters.
     * @param frames List of frames to search
     * @param owner Owner to match when searching
     * @returns PrivateFrame Matching frame or `undefined` if a match was not found
     */
    public static find(frames: PrivateFrame[], owner: string): PrivateFrame {
        Guards.truthy(frames, "frames");

        return frames.find((f) => f._owner === owner);
    }

    /** @inheritDoc */
    public clone(): Frame {
        const frame = PrivateFrame.fromOwner(this._owner);
        frame._privateData = this._privateData.toByteVector();
        return frame;
    }

    /** @inheritDoc */
    protected parseFields(data: ByteVector): void {
        if (data.length < 1) {
            throw new CorruptFileError("A private frame must contain at least 1 byte");
        }

        const l = data.split(ByteVector.getTextDelimiter(StringType.Latin1), 1, 2);
        this._owner = l[0].toString(StringType.Latin1);
        this._privateData = l[1]?.toByteVector() || ByteVector.empty();
    }

    /** @inheritDoc */
    protected renderFields(version: number): ByteVector {
        if (version < 3) {
            throw new NotImplementedError();
        }

        return ByteVector.concatenate(
            ByteVector.fromString(this._owner, StringType.Latin1),
            ByteVector.getTextDelimiter(StringType.Latin1),
            this._privateData
        );
    }
}
