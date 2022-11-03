import XingHeader from "./xingHeader";
import VbriHeader from "./vbriHeader";
import {ByteVector} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File} from "../file";
import {IAudioCodec, MediaTypes} from "../properties";
import {ChannelMode, MpegVersion} from "./mpegEnums";
import {Guards, NumberUtils} from "../utils";

/**
 * Provides information about an MPEG audio stream. For more information and definition of the
 * header, see http://www.mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm
 */
export default class MpegAudioHeader implements IAudioCodec {
    // @TODO: make an enum for header flags

    public static readonly UNKNOWN: MpegAudioHeader = MpegAudioHeader.fromInfo(
        0,
        0,
        XingHeader.UNKNOWN,
        VbriHeader.UNKNOWN
    );

    private static readonly BITRATES: number[][][] = [
        [ // Version 1
            [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1], // layer 1
            [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, -1], // layer 2
            [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, -1]  // layer 3
        ],
        [ // Version 2 or 2.5
            [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, -1], // layer 1
            [0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, -1], // layer 2
            [0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, -1]  // layer 3
        ]
    ];

    private static readonly BLOCK_SIZES: number[][] = [
        [0, 384, 1152, 1152], // Version 1
        [0, 384, 1152,  576], // Version 2
        [0, 384, 1152,  576]  // Version 2.5
    ];

    private static readonly SAMPLE_RATES: number[][] = [
        [44100, 48000, 32000, 0], // Version 1
        [22050, 24000, 16000, 0], // Version 2
        [11025, 12000,  8000, 0]  // Version 2.5
    ];

    private _durationMilliseconds: number;
    private _flags: number;
    private _streamLength: number;
    private _vbriHeader: VbriHeader;
    private _xingHeader: XingHeader;

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs and initializes a new instance by reading its contents from a data
     * {@link ByteVector} and its Xing header from the appropriate location in the
     * specified file.
     * @param data The header data to read
     * @param file File to read the Xing/VBRI header from
     * @param position Position into `file` where the header begins, must be a positive
     *     8-bit integer.
     */
    public static fromData(data: ByteVector, file: File, position: number): MpegAudioHeader {
        Guards.truthy(data, "data");
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");

        const header = new MpegAudioHeader();
        header._durationMilliseconds = 0;
        header._streamLength = 0;

        const error = this.getHeaderError(data);
        if (error) {
            throw new CorruptFileError(error);
        }

        header._flags = data.toUint();
        header._xingHeader = XingHeader.UNKNOWN;
        header._vbriHeader = VbriHeader.UNKNOWN;

        // Check for a Xing header that will help us in gathering info about a VBR stream
        file.seek(position + XingHeader.xingHeaderOffset(header.version, header.channelMode));

        const xingData = file.readBlock(16);
        if (xingData.length === 16 && xingData.startsWith(XingHeader.FILE_IDENTIFIER)) {
            header._xingHeader = XingHeader.fromData(xingData);
        }

        if (header._xingHeader.isPresent) {
            return header;
        }

        // A Xing header could not be found, next check for a Fraunhofer VBRI header
        file.seek(position + VbriHeader.VBRI_HEADER_OFFSET);

        // Only get the first 24 bytes of the header. We're not interested in the TOC entries.
        const vbriData = file.readBlock(24);
        if (vbriData.length === 24 && vbriData.startsWith(VbriHeader.FILE_IDENTIFIER)) {
            header._vbriHeader = VbriHeader.fromData(vbriData);
        }

        return header;
    }

    /**
     * Constructs and initializes a new instance by populating it with specified values.
     * @param flags Flags for the new instance
     * @param streamLength Stream length of the new instance
     * @param xingHeader Xing header associated with the new instance
     * @param vbriHeader VBRI header associated with the new instance
     */
    public static fromInfo(
        flags: number,
        streamLength: number,
        xingHeader: XingHeader,
        vbriHeader: VbriHeader
    ): MpegAudioHeader {
        Guards.uint(flags, "flags");
        Guards.safeUint(streamLength, "streamLength");
        Guards.truthy(xingHeader, "xingHeader");
        Guards.truthy(vbriHeader, "vbriHeader");

        const header = new MpegAudioHeader();
        header._flags = flags;
        header._streamLength = streamLength;
        header._xingHeader = xingHeader;
        header._vbriHeader = vbriHeader;
        header._durationMilliseconds = 0;

        return header;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc IAudioCodec.audioBitrate */
    public get audioBitrate(): number {
        // NOTE: Although it would be *amazing* to store `this.durationMilliseconds / 1000` in a
        //    variable, we can't b/c it causes a stack overflow. Oh well.
        if (
            this._xingHeader.totalSize > 0 &&
            this._xingHeader.totalFrames > 0 &&
            this.durationMilliseconds / 1000 > 0
        ) {
            return Math.round(this._xingHeader.totalSize * 8 / (this.durationMilliseconds / 1000) / 1000);
        }
        if (
            this._vbriHeader.totalSize > 0 &&
            this._vbriHeader.totalFrames > 0 &&
            this.durationMilliseconds / 1000 > 0
        ) {
            return Math.round(this._vbriHeader.totalSize * 8 / (this.durationMilliseconds / 1000) / 1000);
        }

        const index1 = this.version === MpegVersion.Version1 ? 0 : 1;
        const index2 = this.audioLayer - 1;
        const index3 = NumberUtils.uintAnd(NumberUtils.uintRShift(this._flags, 12), 0x0f);
        return MpegAudioHeader.BITRATES[index1][index2][index3];
    }

    /** @inheritDoc IAudioCodec.audioChannels */
    public get audioChannels(): number { return this.channelMode === ChannelMode.SingleChannel ? 1 : 2; }

    /**
     * Gets the length of the frames in the audio represented by the current instance.
     */
    public get audioFrameLength(): number {
        const audioLayer = this.audioLayer;
        if (audioLayer === 1) {
            return Math.floor(48000 * this.audioBitrate / this.audioSampleRate) + (this.isPadded ? 4 : 0);
        }
        if (audioLayer === 2 || this.version === MpegVersion.Version1) {
            return Math.floor(144000 * this.audioBitrate / this.audioSampleRate) + (this.isPadded ? 1 : 0);
        }
        if (audioLayer === 3) {
            return Math.floor(72000 * this.audioBitrate / this.audioSampleRate) + (this.isPadded ? 1 : 0);
        }
        return 0;
    }

    /**
     * Gets the MPEG audio layer used to encode the audio represented by the current instance.
     */
    public get audioLayer(): number {
        switch (NumberUtils.uintAnd(NumberUtils.uintRShift(this._flags, 17), 0x03)) {
            case 1:
                return 3;
            case 2:
                return 2;
            default:
                return 1;
        }
    }

    /** @inheritDoc IAudioCodec.audioSampleRate */
    public get audioSampleRate(): number {
        const index1 = this.version;
        const index2 = NumberUtils.uintAnd(NumberUtils.uintRShift(this._flags, 10), 0x03);
        return MpegAudioHeader.SAMPLE_RATES[index1][index2];
    }

    /**
     * Gets the MPEG audio channel mode of the audio represented by the current instance.
     */
    public get channelMode(): ChannelMode { return NumberUtils.uintAnd(NumberUtils.uintRShift(this._flags, 6), 0x03); }

    /** @inheritDoc ICodec.description */
    public get description(): string {
        let builder = "MPEG Version ";
        switch (this.version) {
            case MpegVersion.Version1:
                builder += "1";
                break;
            case MpegVersion.Version2:
                builder += "2";
                break;
            case MpegVersion.Version25:
                builder += "2.5";
                break;
        }
        builder += ` Audio, Layer ${this.audioLayer}`;

        if (this._xingHeader.isPresent || this._vbriHeader.isPresent) {
            builder += " VBR";
        }

        return builder;
    }

    /** @inheritDoc ICodec.duration */
    public get durationMilliseconds(): number {
        if (this._durationMilliseconds > 0) { return this._durationMilliseconds; }

        const blockSizeForVersionAndLayer = MpegAudioHeader.BLOCK_SIZES[this.version][this.audioLayer];
        if (this._xingHeader.totalFrames > 0) {
            // Read the length and the bitrate from the Xing header
            const timePerFrameSeconds = blockSizeForVersionAndLayer / this.audioSampleRate;
            const durationSeconds = timePerFrameSeconds * this._xingHeader.totalFrames;
            this._durationMilliseconds = durationSeconds * 1000;
        } else if (this._vbriHeader.totalFrames > 0) {
            // Read the length and the bitrate from the VBRI header
            const timePerFrameSeconds = blockSizeForVersionAndLayer / this.audioSampleRate;
            const durationSeconds = Math.round(timePerFrameSeconds * this._vbriHeader.totalFrames);
            this._durationMilliseconds = durationSeconds * 1000;
        } else if (this.audioFrameLength > 0 && this.audioBitrate > 0) {
            // Since there was no valid Xing or VBRI header found, we hope that we're in a constant
            // bitrate file

            // Round off to upper integer value
            const frames = Math.floor((this._streamLength + this.audioFrameLength - 1) / this.audioFrameLength);
            const durationSeconds = (this.audioFrameLength * frames) / (this.audioBitrate * 125);
            this._durationMilliseconds = durationSeconds * 1000;
        }

        return this._durationMilliseconds;
    }

    // TODO: Introduce an MPEG flags enum

    /**
     * Whether or not the current audio is copyrighted.
     */
    public get isCopyrighted(): boolean { return ((this._flags >> 3) & 1) === 1; }

    /**
     * Whether or not the current audio is original.
     */
    public get isOriginal(): boolean { return ((this._flags >> 2) & 1) === 1; }

    /**
     * Whether or not the audio represented by the current instance is padded.
     */
    public get isPadded(): boolean { return ((this._flags >> 9) & 1) === 1; }

    /**
     * Gets whether the audio represented by the current instance is protected by CRC.
     */
    public get isProtected(): boolean { return ((this._flags >> 16) & 1) === 0; }

    /** @inheritDoc ICodec.mediaTypes */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    /**
     * Sets the length of the audio stream represented by the current instance.
     * If this value has not been set, {@link durationMilliseconds} will return an incorrect value.
     * @internal This is intended to be set when the file is read.
     */
    public set streamLength(value: number) {
        Guards.safeUint(value, "value");
        this._streamLength = value;

        // Force the recalculation of duration if it depends on the stream length.
        if (this._xingHeader.totalFrames === 0 && this._vbriHeader.totalFrames === 0) {
            this._durationMilliseconds = 0;
        }
    }

    /**
     * Gets the VBRI header found in the audio. {@link VbriHeader.UNKNOWN} is returned if no header
     * was found.
     */
    public get vbriHeader(): VbriHeader { return this._vbriHeader; }

    /**
     * Gets the MPEG version used to encode the audio represented by the current instance.
     */
    public get version(): MpegVersion {
        switch ((this._flags >> 19) & 0x03) {
            case 0:
                return MpegVersion.Version25;
            case 2:
                return MpegVersion.Version2;
            default:
                return MpegVersion.Version1;
        }
    }

    /**
     * Gets the Xing header found in the audio. {@link XingHeader.UNKNOWN} is returned if no header
     * was found.
     */
    public get xingHeader(): XingHeader { return this._xingHeader; }

    // #endregion

    /**
     * Searches for an audio header in a file starting at a specified position and searching
     * through a specified number of bytes.
     * @param file File to search
     * @param position Position in `file` at which to start searching
     * @param length Maximum number of bytes to search before giving up. Defaults to `-1` to
     *     have no maximum
     * @returns the header that was found or `undefined` if a header was not found
     */
    public static find(file: File, position: number, length?: number): MpegAudioHeader {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (length !== undefined) {
            Guards.uint(length, "length");
        }

        const end = position + (length || 0);

        file.seek(position);
        let buffer = file.readBlock(3);

        if (buffer.length < 3) {
            return undefined;
        }

        do {
            // @TODO: ugh, this has that bizarre 3 byteoffset into each read, remove it
            file.seek(position + 3);
            buffer = buffer.subarray(buffer.length - 3);
            buffer.addByteVector(file.readBlock(File.bufferSize));

            for (let i = 0; i < buffer.length - 3 && (length === undefined || position + i < end); i++) {
                if (buffer.get(i) === 0xFF && buffer.get(i + 1) > 0xE0) {
                    const data = buffer.subarray(i, 4);
                    if (!this.getHeaderError(data)) {
                        try {
                            return MpegAudioHeader.fromData(data, file, position + i);
                        } catch (e) {
                            if (!CorruptFileError.errorIs(e)) {
                                throw e;
                            }
                        }
                    }
                }
            }

            position += File.bufferSize;
        } while (buffer.length > 3 && (length === undefined || position < end));

        return undefined;
    }

    private static getHeaderError(data: ByteVector): string {
        if (data.length < 4) {
            return "Insufficient header length";
        }
        if (data.get(0) !== 0xFF) {
            return "First byte did not match MPEG sync";
        }

        // Checking bits from high to low:
        // - First 3 bytes MUST be set
        // - Bits 4 and 5 can be 00, 10, or 11 but not 01
        // - One or more of bits 6 and 7 must be set
        // - Bit 8 can be anything
        if (NumberUtils.uintAnd(data.get(1), 0xE6) <= 0xE0 || NumberUtils.uintAnd(data.get(1), 0x18) === 0x08) {
            return "Second byte did not match MPEG sync";
        }

        const flags = data.toUint();
        if (NumberUtils.hasFlag(NumberUtils.uintRShift(flags, 12), 0x0F, true)) {
            return "Header uses invalid bitrate index";
        }
        if (NumberUtils.hasFlag(NumberUtils.uintRShift(flags, 10), 0x03, true)) {
            return "Invalid sample rate";
        }

        return undefined;
    }
}
