import Mpeg4AudioTypes from "../mpeg4/mpeg4AudioTypes";
import {ByteVector} from "../byteVector";
import {File} from "../file";
import {IAudioCodec, MediaTypes} from "../properties";
import {Guards, NumberUtils} from "../utils";

/**
 * This structure implements {@link IAudioCodec} and provides information about an ADTS AAC audio
 * stream. NOTE: This header type should not be used for MPEG-4 encapsulated audio files.
 */
export default class AacAudioHeader implements IAudioCodec {
    private static readonly SAMPLE_RATES = [
        96000, 88200, 64000, 48000, 44100, 32000,
        24000, 22050, 16000, 12000, 11025, 8000, 7350
    ];

    /**
     * An empty an unset header
     */
    public static readonly UNKNOWN = new AacAudioHeader(0, 0, 0, 0);

    private readonly _audioBitrate: number;
    private readonly _audioChannels: number;
    private readonly _audioSampleRate: number;
    private readonly _mpeg4AudioTypeIndex: number;

    private _durationMilliseconds: number;
    private _streamLength: number;

    /**
     * Constructs and initializes a new instance of {@link AacAudioHeader} by populating it with the
     * specified values.
     * @param channels Number of channels in the audio stream
     * @param bitrate Bitrate of the audio stream
     * @param sampleRate Sample rate of the audio stream
     * @param mpegAudioType ID of the MPEG-4 audio type
     */
    public constructor(
        channels: number,
        bitrate: number,
        sampleRate: number,
        mpegAudioType: number
    ) {
        Guards.uint(channels, "channels");
        Guards.greaterThanInclusive(bitrate, 0, "bitrate");
        Guards.uint(sampleRate, "sampleRate");
        Guards.uint(mpegAudioType, "mpegAudioType");

        this._durationMilliseconds = undefined;
        this._streamLength = 0;
        this._audioBitrate = bitrate;
        this._audioChannels = channels;
        this._audioSampleRate = sampleRate;
        this._mpeg4AudioTypeIndex = mpegAudioType;
    }

    // #region Properties

    /** @inheritDoc */
    public get audioBitrate(): number { return this._audioBitrate; }

    /** @inheritDoc */
    public get audioChannels(): number { return this._audioChannels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._audioSampleRate; }

    /** @inheritDoc */
    public get description(): string { return `ADTS AAC: ${Mpeg4AudioTypes[this._mpeg4AudioTypeIndex]}`; }

    /**
     * @inheritDoc
     * @remarks Until the stream length has been set ({@link streamLength}), this will return
     *     `undefined`.
     */
    public get durationMilliseconds(): number { return this._durationMilliseconds; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Audio; }

    /**
     * Sets the length of the audio stream represented by the current instance.
     * @desc Until this value has been set, {@link durationMilliseconds} will return an incorrect
     *     value.
     * @param value Length in bytes of the audio stream represented by the current instance
     */
    public set streamLength(value: number) {
        Guards.safeUint(value, "value");

        this._streamLength = value;
        this._durationMilliseconds = this._streamLength * 8 / this.audioBitrate;
    }

    // #endregion

    /**
     * Searches for an audio header in a {@link File} starting at a specified position and
     * searching through a specified number of bytes.
     * @param file File to search
     * @param position Seek position in `file` in which to start searching
     * @param length maximum number of bytes to search before aborting. Omit to search entire file.
     *     Searching the entire file may take a very long time, it is recommended to always use a
     *     reasonable length here
     * @returns AacAudioHeader Header found or `undefined` if a header could not be found
     */
    public static find(file: File, position: number, length?: number): AacAudioHeader {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (length !== undefined) {
            Guards.uint(length, "length");
        }

        const end = position + length;
        file.seek(position);

        // NOTE: The original .NET implementation used some bizarre (to me) 3 byte offset into each
        //    buffer that was read. I couldn't see any reason why that was being done, so I dropped
        //    it. If it turns out that was necessary for some perf reason or something, feel free
        //    to add it back.
        // NOTE: We're guaranteed to read in an entire buffer, but not scan the entire thing if
        //    there was a max number of bytes set to read.
        let buffer: ByteVector;
        while ((buffer = file.readBlock(File.bufferSize)).length > 0 && (length === undefined || position < end)) {
            for (let i = 0; i < buffer.length && (length === undefined || position + i < end); i++) {
                // Skip if sync word can't be found
                if (buffer.get(i) !== 0xFF || buffer.get(i + 1) < 0xF0) {
                    continue;
                }

                // Sync word found, continue processing
                // NOTE: For details of the header format, see https://wiki.multimedia.cx/index.php/ADTS
                const bytes = buffer.subarray(i, 7);

                // Sample rate
                const sampleRateByte = bytes.get(2);
                const sampleRateIndex = NumberUtils.uintRShift(NumberUtils.uintAnd(sampleRateByte, 0x3C), 2);
                if (sampleRateIndex >= this.SAMPLE_RATES.length) {
                    return undefined;
                }
                const sampleRate = this.SAMPLE_RATES[sampleRateIndex];

                // MPEG-4 Audio Type
                const mpeg4AudioType = NumberUtils.uintRShift(NumberUtils.uintAnd(sampleRateByte, 0xC0), 6) + 1;

                // Channel configuration
                const channelsByte1 = sampleRateByte;
                const channelsByte2 = bytes.get(3);
                const channelCount = NumberUtils.uintOr(
                    NumberUtils.uintLShift(NumberUtils.uintAnd(channelsByte1, 0x01), 2),
                    NumberUtils.uintRShift(NumberUtils.uintAnd(channelsByte2, 0xC0), 6)
                );

                // Frame length
                const frameLengthByte1 = channelsByte2;
                const frameLengthByte2 = bytes.get(4);
                const frameLengthByte3 = bytes.get(5);
                const frameLength = NumberUtils.uintOr(
                    NumberUtils.uintLShift(NumberUtils.uintAnd(frameLengthByte1, 0x03), 11),
                    NumberUtils.uintLShift(frameLengthByte2, 3),
                    NumberUtils.uintRShift(NumberUtils.uintAnd(frameLengthByte3, 0xE0), 5)
                );
                if (frameLength < 7) {
                    return undefined;
                }

                // Number of frames in ADTS frame minus 1
                const framesByte = bytes.get(6);
                const numberOfFrames = NumberUtils.uintAnd(framesByte, 0x03) + 1;

                // Calculate number of samples and bitrate
                const numberOfSamples = numberOfFrames * 1024;
                const bitrate = frameLength * 8 * sampleRate / numberOfSamples / 1000;
                // NOTE: Original .NET implementation used longs for this calculation. Using the
                //     maximum possible values, this would still fit within a JS safe integer. So,
                //     BigInt has not been used here.

                return new AacAudioHeader(channelCount, bitrate, sampleRate, mpeg4AudioType);
            }

            position += buffer.length;
        }

        return undefined;
    }

}
