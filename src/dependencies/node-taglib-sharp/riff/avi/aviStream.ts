import RiffBitmapInfoHeader from "../riffBitmapInfoHeader";
import RiffList from "../riffList";
import RiffWaveFormatEx from "../riffWaveFormatEx";
import {CorruptFileError} from "../../errors";
import {ICodec} from "../../properties";
import {Guards} from "../../utils";

export enum AviStreamType {
    /** Audio Stream */
    /* auds */ AudioStream = 0x73647561,

    /** MIDI Stream */
    /* mids */ MidiStream = 0x7264696D,

    /** Text stream */
    /* txts */ TextStream = 0x73747874,

    /** Video stream */
    /* vids */ VideoStream = 0x73646976
}

/**
 * Base class representing a stream in an AVI file. Provides basic support for parsing a raw AVI
 * stream list.
 */
export class AviStream {
    public static readonly FORMAT_CHUNK_ID = "strf";
    public static readonly HEADER_CHUNK_ID = "strh";
    public static readonly LIST_TYPE = "strl";

    private readonly _bottom: number;
    private readonly _codec: ICodec;
    private readonly _flags: number;
    private readonly _handler: number;
    private readonly _initialFrames: number;
    private readonly _language: number;
    private readonly _left: number;
    private readonly _length: number;
    private readonly _priority: number;
    private readonly _quality: number;
    private readonly _rate: number;
    private readonly _right: number;
    private readonly _sampleSize: number;
    private readonly _scale: number;
    private readonly _start: number;
    private readonly _suggestedBufferSize: number;
    private readonly _top: number;
    private readonly _type: number;

    /**
     * Constructs and initializes a new instance with a specified stream header.
     * @param list RiffList containing the stream headers
     */
    public constructor(list: RiffList) {
        Guards.truthy(list, "list");
        if (list.type !== AviStream.LIST_TYPE) {
            throw new CorruptFileError("Stream header list does not have correct type");
        }

        // Parse the stream header
        const streamHeaderData = list.getValues(AviStream.HEADER_CHUNK_ID);
        if (streamHeaderData.length !== 1) {
            throw new CorruptFileError("Stream header list does not contain valid stream header chunks");
        }
        const streamHeaderDatum = streamHeaderData[0];
        if (streamHeaderDatum.length !== 56) {
            throw new CorruptFileError("Stream header does not contain correct number of bytes");
        }

        this._type = streamHeaderDatum.subarray(0, 4).toUint(false);
        this._handler = streamHeaderDatum.subarray(4, 4).toUint(false);
        this._flags = streamHeaderDatum.subarray(8, 4).toUint(false);
        this._priority = streamHeaderDatum.subarray(12, 2).toUshort(false);
        this._language = streamHeaderDatum.subarray(14, 2).toUshort(false);
        this._initialFrames = streamHeaderDatum.subarray(16, 4).toUint(false);
        this._scale = streamHeaderDatum.subarray(20, 4).toUint(false);
        this._rate = streamHeaderDatum.subarray(24, 4).toUint(false);
        this._start = streamHeaderDatum.subarray(28, 4).toUint(false);
        this._length = streamHeaderDatum.subarray(32, 4).toUint(false);
        this._suggestedBufferSize = streamHeaderDatum.subarray(36, 4).toUint(false);
        this._quality = streamHeaderDatum.subarray(40, 4).toUint(false);
        this._sampleSize = streamHeaderDatum.subarray(44, 4).toUint(false);
        this._left = streamHeaderDatum.subarray(48, 2).toUshort(false);
        this._top = streamHeaderDatum.subarray(50, 2).toUshort(false);
        this._right = streamHeaderDatum.subarray(52, 2).toUshort(false);
        this._bottom = streamHeaderDatum.subarray(54, 2).toUshort(false);

        // Parse the stream construct
        const streamFormatData = list.getValues(AviStream.FORMAT_CHUNK_ID);
        if (streamFormatData.length !== 1) {
            throw new CorruptFileError("Stream header list is missing stream format chunk");
        }
        switch (this._type) {
            case AviStreamType.VideoStream:
                this._codec = new RiffBitmapInfoHeader(streamFormatData[0], 0);
                break;
            case AviStreamType.AudioStream:
                this._codec = new RiffWaveFormatEx(streamFormatData[0]);
                break;
            case AviStreamType.MidiStream:
            case AviStreamType.TextStream:
                // These types don't have codecs, but we still care about the headers, I think
                // If there's more information needed for these types, please open a issue
                break;
        }
    }

    // #region Properties

    /**
     * Gets the offset from the bottom of the main movie rectangle where this stream should be
     * positioned.
     */
    public get bottom(): number { return this._bottom; }

    /**
     * Gets the codec information for this stream.
     */
    public get codec(): ICodec { return this._codec; }

    /**
     * Gets any flags for the data stream.
     */
    public get flags(): number { return this._flags; }

    /**
     * Gets an optional FOURCC that identifies a specific data handler. The data handler is the
     * preferred handler for the stream. For audio/video streams, this specifies the codec for
     * decoding the stream.
     */
    public get handler(): number { return this._handler; }

    /**
     * Gets how far audio data is skewed ahead of the video frames in an interleaved file. This
     * value generally 0 for non-interleaved files.
     */
    public get initialFrames(): number { return this._initialFrames; }

    /**
     * Gets the language tag for the stream.
     */
    public get language(): number { return this._language; }

    /**
     * Gets the offset from the left of the main movie rectangle where this stream should be
     * positioned.
     */
    public get left(): number { return this._left; }

    /**
     * Gets the length of the stream. The units are defined by `rate` and `scale` in the main file
     * header.
     */
    public get length(): number { return this._length; }

    /**
     * Gets the priority of a stream type. For example, in a file with multiple audio streams,
     * the one with the highest priority might be the default stream.
     */
    public get priority(): number { return this._priority; }

    /**
     * Gets an indicator of the quality of the data in the stream. Quality is represented as a
     * number between `0` and `10000`. -1 indicates the default quality values should be used.
     * @remarks For compressed data, this typically represents the value of the quality parameter
     *     passed to the compression software.
     */
    public get quality(): number { return this._quality; }

    /**
     * Used with {@see scale} to specify the time scale that this stream will use.
     * @remarks Dividing {@see rate} by this gives the number of samples per second. For video
     *     streams, this is the frame rate. For audio streams, this rate corresponds to the time
     *     needed to play {@see RiffWaveFormatEx.blockAlign} bytes of audio. For PCM audio this is
     *     just the sample rate.
     */
    public get rate(): number { return this._rate; }

    /**
     * Gets the offset from the right of the main movie rectangle where this stream should be
     * positioned.
     */
    public get right(): number { return this._right; }

    /**
     * Gets the size of a single sample of data. If the sample size varies, this will be `0`.
     */
    public get sampleSize(): number { return this._sampleSize; }

    /**
     * Used with {@see rate} to specify the time scale that this stream will use.
     * @remarks Dividing {@see rate} by this gives the number of samples per second. For video
     *     streams, this is the frame rate. For audio streams, this rate corresponds to the time
     *     needed to play `nBlockAlign` bytes of audio. For PCM audio is just the sample rate.
     */
    public get scale(): number { return this._scale; }

    /**
     * Gets the starting time for this stream. The units are defined by `rate` and `scale` in the
     * main file header.
     * @remarks Usually this is zero, but it can specify a delay time for a stream that does not
     *     start concurrently with the file.
     */
    public get start(): number { return this._start; }

    /**
     * Gets how large of a buffer should be used to read this stream.
     * @remarks Typically, this contains a value corresponding to the largest chunk present in the
     *     stream.
     */
    public get suggestedSampleSize(): number { return this._suggestedBufferSize; }

    /**
     * Gets the offset from the top of the main movie rectangle where this stream should be
     * positioned.
     */
    public get top(): number { return this._top; }

    /**
     * Gets a FOURCC that species the type of data contained in the stream.
     */
    public get type(): AviStreamType { return this._type; }

    // #endregion
}
