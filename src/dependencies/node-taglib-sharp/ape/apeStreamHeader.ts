import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {IAudioCodec, ILosslessAudioCodec, MediaTypes} from "../properties";
import {Guards} from "../utils";

/**
 * Indicates the compression level used when encoding a Monkey's Audio APE file
 */
export enum ApeCompressionLevel {
    /**
     * Audio is not compressed
     */
    None = 0,

    /**
     * Audio is mildly compressed
     */
    Fast = 1000,

    /**
     * Audio is compressed at a normal level
     */
    Normal = 2000,

    /**
     * Audio is highly compressed
     */
    High = 3000,

    /**
     * Audio is extremely highly compressed
     */
    ExtraHigh = 4000,

    /**
     * Audio is compressed to an insane level
     */
    Insane = 5000
}

/**
 * Provides support for reading Monkey's Audio APE stream properties.
 */
export class ApeStreamHeader implements IAudioCodec, ILosslessAudioCodec {
    /**
     * Identifier used to recognize a Monkey's Audio file
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("MAC ", StringType.Latin1).makeReadOnly();

    /**
     * Size of a Monkey Audio Header
     */
    public static readonly SIZE = 76;

    // #region Member variables

    /**
     * Contains the number of bits per sample, stored in bytes (67-68) and is typically 16.
     * @private
     */
    private readonly _bitsPerSample: number;

    /**
     * Number of audio blocks in one frame, stored in bytes (55-58).
     * @private
     */
    private readonly _blocksPerFrame: number;

    /**
     * Number of channels, stored in bytes (69,70) and is typically 1 or 2.
     * @private
     */
    private readonly _channels: number;

    private readonly _compression: ApeCompressionLevel;

    /**
     * Contains the num,ber of audio blocks in the final frame, stored in bytes (59-62)
     * @private
     */
    private readonly _finalFrameBlocks: number;

    /**
     * Contains the sample rate, stored in bytes (71-74) and is typically 44100.
     * @private
     */
    private readonly _sampleRate: number;

    /**
     * Contains the length of the audio stream
     * @private
     */
    private readonly _streamLength: number;

    /**
     * Total number of frames, stored in bytes (63-66)
     * @private
     */
    private readonly _totalFrames: number;

    /**
     * APE version stored in bytes (4,5) of the file and is 1000 times the actual version, so 3810
     * indicates version 3.81.
     * @private
     */
    private readonly _version: number;

    // #endregion

    /**
     * Constructs and initializes a new {@link ApeStreamHeader} from a raw header block and stream
     * length.
     * @param data Raw stream header data beginning with {@link ApeStreamHeader.FILE_IDENTIFIER}
     * @param streamLength Length of the stream in bytes
     */
    // @TODO: Consider tweaking to have this take a file
    public constructor(data: ByteVector, streamLength: number) {
        Guards.truthy(data, "data");
        Guards.safeUint(streamLength, "streamLength");
        if (!data.startsWith(ApeStreamHeader.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Data does not begin with identifier");
        }
        if (data.length < ApeStreamHeader.SIZE) {
            throw new CorruptFileError("Insufficient data in stream header");
        }

        this._streamLength = streamLength;
        this._version = data.subarray(4, 2).toUshort(false);
        this._compression = <ApeCompressionLevel> data.subarray(52, 2).toUshort(false);
        this._blocksPerFrame = data.subarray(56, 4).toUint(false);
        this._finalFrameBlocks = data.subarray(60, 4).toUint(false);
        this._totalFrames = data.subarray(64, 4).toUint(false);
        this._bitsPerSample = data.subarray(68, 2).toUshort(false);
        this._channels = data.subarray(70, 2).toUshort(false);
        this._sampleRate = data.subarray(72, 4).toUint(false);
    }

    // #region Properties

    /** @inheritDoc */
    public get audioBitrate(): number {
        const durationMilliseconds = this.durationMilliseconds;
        if (durationMilliseconds <= 0) { return 0; }

        const durationSeconds = durationMilliseconds / 1000;
        return (this._streamLength * 8 / durationSeconds) / 1000;
    }

    /** @inheritDoc */
    public get audioChannels(): number { return this._channels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._sampleRate; }

    /** @inheritDoc */
    public get bitsPerSample(): number { return this._bitsPerSample; }

    /**
     * Gets the level of compression used when encoding the audio represented by the current
     * instance
     */
    public get compressionLevel(): ApeCompressionLevel { return this._compression; }

    /** @inheritDoc */
    public get description(): string { return `Monkey's Audio APE Version ${this.version.toFixed(3)}`; }

    /** @inheritDoc */
    public get durationMilliseconds(): number {
        if (this._sampleRate <= 0) { return 0; }

        const samples = (this._totalFrames - 1) * this._blocksPerFrame + this._finalFrameBlocks;
        const durationSeconds = samples / this._sampleRate;
        return durationSeconds * 1000;
    }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    /**
     * Gets the APE version of the audio represented by the current instance
     */
    public get version(): number { return this._version / 1000; }

    // #endregion
}
