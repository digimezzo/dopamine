import IOggCodec from "./iOggCodec";
import XiphComment from "../../xiph/xiphComment";
import {ByteVector, StringType} from "../../byteVector";
import {IVideoCodec, MediaTypes} from "../../properties";
import {Guards, NumberUtils} from "../../utils";

/**
 * Types of packets that occur within an Ogg Theora bitstream.
 */
enum TheoraPacketType {
    IdentificationHeader = 0x80,
    CommentHeader = 0x81
}

/**
 * Represents an Ogg Theora bitstream for use in an Ogg file.
 */
export default class Theora implements IOggCodec, IVideoCodec {
    private static readonly IDENTIFIER = ByteVector.fromString("theora", StringType.Latin1).makeReadOnly();

    private readonly _fpsDenominator: number;
    private readonly _fpsNumerator: number;
    private readonly _height: number;
    private readonly _keyframeGranuleShift: number;
    private readonly _majorVersion: number;
    private readonly _minorVersion: number;
    private readonly _reversionVersion: number;
    private readonly _width: number;
    private _commentData: ByteVector;
    private _durationMilliseconds: number;

    /**
     * Constructs and initializes a new instance using the provided header packet.
     * @param headerPacket Packet that contains the Theora header data
     */
    public constructor(headerPacket: ByteVector) {
        Guards.truthy(headerPacket, "headerPacket");
        if (!Theora.isHeaderPacket(headerPacket)) {
            throw new Error("Argument error: packet must have proper signature for Theora header packet");
        }

        // NOTE: See https://www.theora.org/doc/Theora.pdf section 6.2 for header spec

        this._majorVersion = headerPacket.get(7);
        this._minorVersion = headerPacket.get(8);
        this._reversionVersion = headerPacket.get(9);
        this._width = NumberUtils.uintAnd(headerPacket.subarray(14, 3).toUint(), 0x0FFFFF);
        this._height = NumberUtils.uintAnd(headerPacket.subarray(17, 3).toUint(), 0x0FFFFF);
        this._fpsNumerator = headerPacket.subarray(22, 4).toUint();
        this._fpsDenominator = headerPacket.subarray(26, 4).toUint();

        const lastBits = headerPacket.subarray(40, 2).toShort();
        this._keyframeGranuleShift = NumberUtils.uintAnd(NumberUtils.uintRShift(lastBits, 5), 0x1F);
    }

    /** @inheritDoc */
    public get commentData(): ByteVector { return this._commentData; }

    /** @inheritDoc */
    public get description(): string { return `Theora v${this._majorVersion}.${this._minorVersion} Video`; }

    /** @inheritDoc */
    public get durationMilliseconds(): number { return this._durationMilliseconds || 0; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Video; }

    /** @inheritDoc */
    public get videoHeight(): number { return this._height; }

    /** @inheritDoc */
    public get videoWidth(): number { return this._width; }

    /**
     * Checks to see if packet is a Theora header packet.
     * @param packet Packet to check
     */
    public static isHeaderPacket(packet: ByteVector): boolean {
        return packet.get(0) === TheoraPacketType.IdentificationHeader && packet.containsAt(Theora.IDENTIFIER, 1);
    }

    /** @inheritDoc */
    public readPacket(packet: ByteVector): boolean {
        Guards.truthy(packet, "packet");

        if (!this._commentData && packet.get(0) === TheoraPacketType.CommentHeader) {
            this._commentData = packet.subarray(7).toByteVector();
        }

        return !!this._commentData;
    }

    /** @inheritDoc */
    public setDuration(firstGranularPosition: number, lastGranularPosition: number): void {
        Guards.safeUint(firstGranularPosition, "firstGranularPosition");
        Guards.safeUint(lastGranularPosition, "lastGranularPosition");

        const durationSeconds = this.getGranuleTime(lastGranularPosition) - this.getGranuleTime(firstGranularPosition);
        this._durationMilliseconds = durationSeconds * 1000;
    }

    /** @inheritDoc */
    public writeCommentPacket(packets: ByteVector[], comment: XiphComment): void {
        Guards.truthy(packets, "packets");
        Guards.truthy(comment, "comment");

        const data = ByteVector.concatenate(
            TheoraPacketType.CommentHeader,
            Theora.IDENTIFIER,
            comment.render(true)
        );

        if (packets.length > 1 && packets[1].get(0) === TheoraPacketType.CommentHeader) {
            packets[1] = data;
        } else {
            packets.splice(1, 0, data);
        }
    }

    private getGranuleTime(granularPosition: number): number {
        const iFrame = NumberUtils.uintRShift(granularPosition, this._keyframeGranuleShift);
        const pFrame = granularPosition - NumberUtils.uintLShift(iFrame, this._keyframeGranuleShift);
        return (iFrame + pFrame) * (this._fpsDenominator / this._fpsNumerator);
    }
}
