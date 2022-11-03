import {ByteVector, StringType} from "../byteVector";
import {ILosslessAudioCodec, MediaTypes} from "../properties";
import {Guards, NumberUtils} from "../utils";
import {CorruptFileError} from "../errors";

/**
 * Implements {@link ILosslessAudioCodec} to provide support for reading Apple's AIFF stream
 * properties.
 */
export default class AiffStreamHeader implements ILosslessAudioCodec {
    /**
     * Identifier used to recognize an AIFF file. Although an AIFF file starts with "FORM2", we're
     * interested in the common chunk only, which contains the properties we need.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("COMM", StringType.UTF8).makeReadOnly();

    /**
     * Size of an AIFF common chunk in bytes
     */
    public static readonly SIZE = 26;

    // #region Private members

    private readonly _channels: number;
    private readonly _bitsPerSample: number;
    private readonly _sampleRate: number;
    private readonly _streamLength: number;
    private readonly _totalFrames: number;

    // #endregion

    /**
     * Constructs and initializes a new instance of {@link AiffStreamHeader} for a specified header
     * block and stream length.
     * @param data Stream header data
     * @param streamLength Length of the AIFF audio stream in bytes
     */
    public constructor(data: ByteVector, streamLength: number) {
        Guards.truthy(data, "data");
        Guards.uint(streamLength, "streamLength");
        if (!data.startsWith(AiffStreamHeader.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Data does not begin with identifier");
        }

        this._streamLength = streamLength;

        // The first 8 bytes contain the common chunk identifier "COMM" and the size of the common
        // chunk, which is always 18
        this._channels = data.subarray(8, 2).toUshort(true);
        this._totalFrames = data.subarray(10, 4).toUint(true);
        this._bitsPerSample = data.subarray(14, 2).toUshort(true);
        this._sampleRate = NumberUtils.convertFromIeeeExtended(data.subarray(16, 10));
    }

    // #region Properties

    /** @inheritDoc */
    // @TODO: streamlength is total file data length, not sound length.
    public get audioBitrate(): number {
        return this.durationMilliseconds <= 0
            ? 0
            : (this._streamLength * 8) / (this.durationMilliseconds / 1000) / 1000;
    }

    /** @inheritDoc */
    public get audioChannels(): number { return this._channels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._sampleRate; }

    /** @inheritDoc */
    public get bitsPerSample(): number { return this._bitsPerSample; }

    /** @inheritDoc */
    // @TODO: Add support for detecting the compression type
    public get description(): string { return "AIFF Audio"; }

    /** @inheritDoc */
    public get durationMilliseconds(): number {
        return this._sampleRate <= 0 || this._totalFrames <= 0
            ? 0
            : this._totalFrames / this._sampleRate * 1000;
    }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    // #endregion
}
