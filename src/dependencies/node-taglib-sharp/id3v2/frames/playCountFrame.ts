import {ByteVector} from "../../byteVector";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {Guards} from "../../utils";

/**
 * This class extends {@link Frame} implementing support for ID3v2 play count (PCNT) frames.
 */
export default class PlayCountFrame extends Frame {
    private _playCount: bigint;

    private constructor(header: Id3v2FrameHeader) {
        super(header);
        this._playCount = BigInt(0);
    }

    // #region Constructors

    /**
     * Constructs and initializes a new instance with a count of zero
     */
    public static fromEmpty(): PlayCountFrame {
        return new PlayCountFrame(new Id3v2FrameHeader(FrameIdentifiers.PCNT));
    }

    /**
     * Constructs and initializes a new instance of frame by reading its raw data in a specified
     * ID3v2 version starting at a specified offset.
     * @param data Raw representation of the new frame.
     * @param offset Offset into `data` where the frame actually begins. Must be a
     *     positive, safe integer
     * @param header Header of the frame found at `offset` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): PlayCountFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new PlayCountFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version
     * @param data ByteVector starting with the raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded in, must be a positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): PlayCountFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new PlayCountFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Public Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.PlayCountFrame; }

    /**
     * Gets the play count of the current instance.
     */
    public get playCount(): bigint { return this._playCount; }
    /**
     * Sets the play count of the current instance.
     * @param value Number of times this track has been played
     */
    public set playCount(value: bigint) {
        Guards.ulong(value, "value");
        this._playCount = value;
    }

    // #endregion

    /** @inheritDoc */
    public clone(): Frame {
        const frame = new PlayCountFrame(new Id3v2FrameHeader(FrameIdentifiers.PCNT));
        frame.playCount = this.playCount;
        return frame;
    }

    /** @inheritDoc */
    protected parseFields(data: ByteVector): void {
        this.playCount = data.toUlong();
    }

    /** @inheritDoc */
    protected renderFields(): ByteVector {
        const data = ByteVector.fromUlong(this.playCount);

        let ptr = 0;
        while (ptr < data.length - 4 && data.get(ptr) === 0) {
            ptr++;
        }

        return data.subarray(ptr);
    }
}
