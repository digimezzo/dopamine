import {ByteVector} from "../byteVector";
import {CorruptFileError} from "../errors";
import {ILosslessAudioCodec, MediaTypes} from "../properties";
import {Guards, NumberUtils} from "../utils";

/**
 * Provides information about a FLAC audio stream.
 */
export default class FlacStreamHeader implements ILosslessAudioCodec {
    private readonly _audioChannels: number;
    private readonly _audioSampleRate: number;
    private readonly _bitsPerSample: number;
    private readonly _streamLength: number;
    private readonly _totalSamples: number;

    /**
     * Constructs and initializes a new instance by reading a raw stream header structure and using
     * the stream length.
     * @param data Object containing the raw stream header
     * @param streamLength Length of the stream, must be a safe, positive integer.
     */
    public constructor(data: ByteVector, streamLength: number) {
        Guards.truthy(data, "data");
        Guards.safeUint(streamLength, "streamLength");
        if (data.length < 18) {
            throw new CorruptFileError("Not enough data in FLAC stream header");
        }

        // See https://www.xiph.org/flac/format.html#metadata_block_streaminfo for the details of
        // how the header is defined
        // NOTE: We're completely ignoring block/frame size
        const int2 = data.subarray(8, 4).toUint(true);
        const int3 = data.subarray(12, 4).toUint(true);
        const int4 = data.subarray(16, 4).toUint(true);

        // # of channels is bits 100-103
        this._audioChannels = NumberUtils.uintRShift(NumberUtils.uintAnd(int3, 0x0E000000), 25) + 1;

        // Sample rate is bits 80-100
        this._audioSampleRate = NumberUtils.uintOr(
            NumberUtils.uintLShift(NumberUtils.uintAnd(int2, 0x0000FFFF), 4),
            NumberUtils.uintRShift(NumberUtils.uintAnd(int3, 0xF0000000), 28)
        );
        if (this._audioSampleRate === 0) {
            throw new CorruptFileError("Sample rate cannot be zero");
        }

        // Bits per sample is bits 103-108
        this._bitsPerSample = NumberUtils.uintRShift(NumberUtils.uintAnd(int3, 0x01F00000), 20) + 1;

        // Total samples is 108-144
        const samplesHigh = NumberUtils.uintAnd(int3, 0x000FFFFF) * Math.pow(2, 16);
        const samplesLow = NumberUtils.uintRShift(NumberUtils.uintAnd(int4, 0xFFFF0000), 16);
        this._totalSamples = samplesHigh + samplesLow;

        this._streamLength = streamLength;
    }

    // #region Properties

    /**
     * @inheritDoc
     * @remarks This value is calculated based on duration which may be zero if total number
     *     of samples is unknown. Therefore, the bitrate may be 0 indicating it is unknown.
     */
    public get audioBitrate(): number {
        return this.durationMilliseconds > 0
            ? (this._streamLength * 8) / (this.durationMilliseconds / 1000) / 1000
            : 0;
    }

    /** @inheritDoc */
    public get audioChannels(): number { return this._audioChannels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._audioSampleRate; }

    /** @inheritDoc */
    public get bitsPerSample(): number { return this._bitsPerSample; }

    /** @inheritDoc */
    public get description(): string { return "FLAC Audio"; }

    /**
     * @inheritDoc
     * @remarks This value is calculated based on total samples, which may be 0 if the number of
     *     samples is unknown. Therefore, the duration may be unknown.
     */
    public get durationMilliseconds(): number { return this._totalSamples / this._audioSampleRate * 1000; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.LosslessAudio; }

    // #endregion
}
