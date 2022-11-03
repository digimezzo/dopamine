import IOggCodec from "./iOggCodec";
import XiphComment from "../../xiph/xiphComment";
import {ByteVector, StringType} from "../../byteVector";
import {IAudioCodec, MediaTypes} from "../../properties";
import {Guards} from "../../utils";

/**
 * Types of packets that occur within an Ogg Vorbis bitstream.
 */
enum VorbisPacketType {
    Header = 1,
    Comment= 3
}

/**
 * Represents an Ogg Vorbis bitstream for use in an Ogg file.
 */
export default class Vorbis implements IOggCodec, IAudioCodec {
    private static readonly IDENTIFIER = ByteVector.fromString("vorbis", StringType.Latin1).makeReadOnly();

    private readonly _bitrateMaximum: number;
    private readonly _bitrateMinimum: number;
    private readonly _bitrateNominal: number;
    private readonly _channels: number;
    private readonly _sampleRate: number;
    private readonly _vorbisVersion: number;
    private _commentData: ByteVector;
    private _durationMilliseconds: number;

    /**
     * Constructs and initializes a new instance using the provided header packet.
     * @param headerPacket Packet that contains the Vorbis header data
     */
    public constructor(headerPacket: ByteVector) {
        Guards.truthy(headerPacket, "headerPacket");
        if (!headerPacket.containsAt(Vorbis.IDENTIFIER, 1)) {
            throw new Error("Argument error: header packet must start with Vorbis ID");
        }
        if (headerPacket.get(0) !== VorbisPacketType.Header) {
            throw new Error("Argument error: header packet must be a header packet");
        }

        // NOTE: See https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-630004.2.2 for details on
        //    the Vorbis header.

        this._vorbisVersion = headerPacket.subarray(7, 4).toUint(false);
        this._channels = headerPacket.get(11);
        this._sampleRate = headerPacket.subarray(12, 4).toUint(false);
        this._bitrateMaximum = headerPacket.subarray(16, 4).toInt(false);
        this._bitrateNominal = headerPacket.subarray(20, 4).toInt(false);
        this._bitrateMinimum = headerPacket.subarray(24, 4).toInt(false);
    }

    // #region Properties

    /**
     * @inheritDoc
     * @remarks For Vorbis files, this is the nominal bitrate as specified in the identification
     *     header. This may be significantly different than the actual average since this header
     *     only provides decoding hints.
     */
    public get audioBitrate(): number {
        // NOTE: The original .NET implementation had a + 0.5 at the beginning but this isn't
        //    listed anywhere in the Vorbis spec, so I removed it.
        return this._bitrateNominal / 1000;
    }

    /** @inheritDoc */
    public get audioChannels(): number { return this._channels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._sampleRate; }

    /**
     * Gets the raw Xiph comment data contained in the codec.
     */
    public get commentData(): ByteVector { return this._commentData; }

    /** @inheritDoc */
    public get description(): string { return `Vorbis v${this._vorbisVersion} Audio`; }

    /** @inheritDoc */
    public get durationMilliseconds(): number { return this._durationMilliseconds || 0; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    // #endregion

    // #region Methods

    /**
     * Determines if a packet is a Vorbis header packet.
     * @param packet Packet to check
     */
    public static isHeaderPacket(packet: ByteVector): boolean {
        return packet.get(0) === VorbisPacketType.Header && packet.containsAt(Vorbis.IDENTIFIER, 1);
    }

    /** @inheritDoc */
    public readPacket(packet: ByteVector): boolean {
        Guards.truthy(packet, "packet");
        if (!packet.containsAt(Vorbis.IDENTIFIER, 1)) {
            // Ignore invalid packets
            return false;
        }

        if (!this._commentData && packet.get(0) === VorbisPacketType.Comment) {
            this._commentData = packet.subarray(7).toByteVector();
        }

        return !!this._commentData;
    }

    /** @inheritDoc */
    public setDuration(firstGranularPosition: number, lastGranularPosition: number): void {
        Guards.safeUint(firstGranularPosition, "firstGranularPosition");
        Guards.safeUint(lastGranularPosition, "lastGranularPosition");

        const durationSeconds = this._sampleRate === 0
            ? 0
            : (lastGranularPosition - firstGranularPosition) / this._sampleRate;
        this._durationMilliseconds = durationSeconds * 1000;
    }

    /** @inheritDoc */
    public writeCommentPacket(packets: ByteVector[], comment: XiphComment): void {
        Guards.truthy(packets, "packets");
        Guards.truthy(comment, "xiphComment");

        const data = ByteVector.concatenate(
            VorbisPacketType.Comment,
            Vorbis.IDENTIFIER,
            comment.render(true)
        );
        if (packets.length > 1 && packets[1].get(0) === VorbisPacketType.Comment) {
            packets[1] = data;
        } else {
            packets.splice(1, 0, data);
        }
    }

    // #endregion
}
