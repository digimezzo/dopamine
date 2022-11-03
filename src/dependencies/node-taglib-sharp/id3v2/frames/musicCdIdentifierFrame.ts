import {ByteVector} from "../../byteVector";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {Guards} from "../../utils";

/**
 * Class extends {@link Frame}, implementing support for ID3v2 Music CD Identifier (MCDI) frames.
 * Music CD identifier frames should contain the table of contents data as stored on the physical
 * CD. It is primarily used for track information lookup through web sources like CDDB.
 */
export default class MusicCdIdentifierFrame extends Frame {
    private _data: ByteVector;

    private constructor(header: Id3v2FrameHeader) {
        super(header);
    }

    /**
     * Constructs and initializes a new instance of MusicCdIdentifier frame by reading its raw data
     * in a specified ID3v2 version starting at a specified offset.
     * @param data Raw representation of the new frame.
     * @param offset Offset into `data` where the frame actually begins. Must be a
     *     positive, safe integer
     * @param header Header of the frame found at `offset` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader, version: number
    ): MusicCdIdentifierFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new MusicCdIdentifierFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance of MusicCdIdentifierFrame by reading its raw data
     * in a specified ID3v2 version.
     * @param data ByteVector object starting with the raw representation of the new frame
     * @param version The ID3v2 version the raw frame is encoded in. Must be positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): MusicCdIdentifierFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new MusicCdIdentifierFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.MusicCdIdentifierFrame; }

    /**
     * Gets the identifier data stored in the current instance
     */
    public get data(): ByteVector { return this._data; }
    /**
     * Sets the identifier data stored in the current instance
     * @param value ByteVector containing the identifier stored in the current instance
     */
    public set data(value: ByteVector) { this._data = value; }

    /** @inheritDoc */
    public clone(): Frame {
        const frame = new MusicCdIdentifierFrame(new Id3v2FrameHeader(FrameIdentifiers.MCDI));
        frame.data = this._data?.toByteVector();
        return frame;
    }

    /** @inheritDoc */
    protected parseFields(data: ByteVector): void {
        this._data = data;
    }

    /** @inheritDoc */
    protected renderFields(): ByteVector {
        return this._data || ByteVector.empty();
    }
}
