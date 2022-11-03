import IOggCodec from "./iOggCodec";
import XiphComment from "../../xiph/xiphComment";
import {ByteVector, StringType} from "../../byteVector";
import {IAudioCodec, MediaTypes} from "../../properties";
import {Guards} from "../../utils";

/**
 * Represents an Ogg Opus bitstream for use within an Ogg file.
 */
export default class Opus implements IOggCodec, IAudioCodec {
    private static readonly HEADER_IDENTIFIER = ByteVector.fromString("OpusHead", StringType.Latin1).makeReadOnly();
    private static readonly COMMENT_IDENTIFIER = ByteVector.fromString("OpusTags", StringType.Latin1).makeReadOnly();

    private readonly _channelCount: number;
    private readonly _inputSampleRate: number;
    private readonly _opusVersion: number;
    private readonly _preSkip: number;
    private readonly _streamCount: number;
    private _commentData: ByteVector;
    private _durationMilliseconds: number;

    /**
     * Constructs and initializes a new instance using the provided header packet to read the
     * codec's header information.
     * @param headerPacket Packet containing the header of the stream
     */
    public constructor(headerPacket: ByteVector) {
        Guards.truthy(headerPacket, "headerPacket");
        if (!headerPacket.startsWith(Opus.HEADER_IDENTIFIER)) {
            throw new Error(`Argument error: Header packet must start with magic signature`);
        }

        // Head the header
        this._opusVersion = headerPacket.get(8);
        this._channelCount = headerPacket.get(9);
        this._preSkip = headerPacket.subarray(10, 2).toUint(false);
        this._inputSampleRate = headerPacket.subarray(12, 4).toUint(false);

        const channelMappingFamily = headerPacket.get(18);
        if (channelMappingFamily === 0) {
            this._streamCount = 1;
        } else {
            this._streamCount = headerPacket.get(19);
        }
    }

    // #region Properties

    /**
     * @inheritDoc
     * @remarks Always returns zero since bitrate is variable and no information is stored in the
     *     Ogg header (unlike Vorbis).
     */
    public get audioBitrate(): number { return 0; }

    /**
     * @inheritDoc
     * @remarks This is the *input* sample rate used when the file was created. Opus uses a variety
     *     of sample rates internally, and as such the output sample rate is dependent on the
     *     decoder used. In most modern hardware cases, this will be 48kHz.
     */
    public get audioSampleRate(): number { return this._inputSampleRate; }

    /** @inheritDoc */
    public get audioChannels(): number { return this._channelCount; }

    /**
     * Gets the raw Xiph comment data contained in the codec.
     */
    public get commentData(): ByteVector { return this._commentData; }

    /** @inheritDoc */
    public get description(): string { return `Opus v${this._opusVersion} Audio`; }

    /** @inheritDoc */
    public get durationMilliseconds(): number { return this._durationMilliseconds || 0; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    /**
     * Gets the number of streams contained in the bitstream.
     */
    public get streamCount(): number { return this._streamCount; }

    // #endregion

    // #region Methods

    /**
     * Determines whether an Opus header packet based on the presence of the Opus header
     * packet magic signature.
     * @param headerPacket Packet to check
     */
    public static isHeaderPacket(headerPacket: ByteVector): boolean {
        return headerPacket.startsWith(Opus.HEADER_IDENTIFIER);
    }

    /** @inheritDoc */
    public readPacket(packet: ByteVector): boolean {
        Guards.truthy(packet, "packet");

        if (!this._commentData && packet.startsWith(Opus.COMMENT_IDENTIFIER)) {
            this._commentData = packet.subarray(Opus.COMMENT_IDENTIFIER.length).toByteVector();
        }

        return !!this._commentData;
    }

    /** @inheritDoc */
    // NOTE: This is not static b/c it must be part of the interface.
    public writeCommentPacket(packets: ByteVector[], comment: XiphComment): void {
        Guards.truthy(packets, "packets");
        Guards.truthy(comment, "comment");

        const data = ByteVector.concatenate(
            Opus.COMMENT_IDENTIFIER,
            comment.render(true)
        );

        if (packets.length > 1 && packets[1].startsWith(Opus.COMMENT_IDENTIFIER)) {
            // Replace the comments packet as the 2nd packet
            packets[1] = data;
        } else {
            // Insert the comments packet as the 2nd packet
            packets.splice(1, 0, data);
        }
    }

    public setDuration(firstGranularPosition: number, lastGranularPosition: number): void {
        Guards.safeUint(firstGranularPosition, "firstGranularPosition");
        Guards.safeUint(lastGranularPosition, "lastGranularPosition");

        // NOTE: It probably looks wrong to use 48kHz all the time, but this is actually correct as
        //    per the Opus guide https://wiki.xiph.org/OpusFAQ
        const durationSeconds = (lastGranularPosition - firstGranularPosition - this._preSkip) / 48000;
        this._durationMilliseconds = durationSeconds * 1000;
    }

    // #endregion
}
