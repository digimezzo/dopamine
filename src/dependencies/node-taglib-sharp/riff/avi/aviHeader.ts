import RiffList from "../riffList";
import {AviStream} from "./aviStream";
import {CorruptFileError} from "../../errors";
import {ICodec} from "../../properties";
import {Guards} from "../../utils";

/**
 * This class represents the headers in an AVI file.
 */
export default class AviHeader {
    /**
     * ID of the chunk in the header list that contains the header data.
     */
    public static readonly HEADER_CHUNK_ID = "avih";

    /**
     * Type of the list that stores an AVI header
     */
    public static readonly HEADER_LIST_TYPE = "hdrl";

    private readonly _codecs: ICodec[];
    private readonly _durationMilliseconds: number;
    private readonly _flags: number;
    private readonly _height: number;
    private readonly _initialFrames: number;
    private readonly _maxBytesPerSecond: number;
    private readonly _microsecondsPerFrame: number;
    private readonly _streamCount: number;
    private readonly _streams: AviStream[];
    private readonly _suggestedBufferSize: number;
    private readonly _totalFrames;
    private readonly _width: number;

    /**
     * Constructs and initializes a new instance by reading information from a RIFF list.
     * @param list List containing the data for the AVI headers
     */
    public constructor(list: RiffList) {
        Guards.truthy(list, "list");
        if (list.type !== AviHeader.HEADER_LIST_TYPE) {
            throw new CorruptFileError(`Expected ${AviHeader.HEADER_LIST_TYPE} list but got ${list.type}`);
        }

        // Read the main header
        const mainHeaderValues = list.getValues(AviHeader.HEADER_CHUNK_ID);
        if (mainHeaderValues.length === 0) {
            throw new CorruptFileError("Could not find AVI main header data");
        }
        const mainHeaderData = mainHeaderValues[0];
        if (mainHeaderData.length < 40) {
            throw new CorruptFileError("AVI header is an invalid length");
        }
        this._microsecondsPerFrame = mainHeaderData.subarray(0, 4).toUint(false);
        this._maxBytesPerSecond = mainHeaderData.subarray(4, 4).toUint(false);
        this._flags = mainHeaderData.subarray(12, 4).toUint(false);
        this._totalFrames = mainHeaderData.subarray(16, 4).toUint(false);
        this._initialFrames = mainHeaderData.subarray(20, 4).toUint(false);
        this._streamCount = mainHeaderData.subarray(24, 4).toUint(false);
        this._suggestedBufferSize = mainHeaderData.subarray(28, 4).toUint(false);
        this._width = mainHeaderData.subarray(32, 4).toUint(false);
        this._height = mainHeaderData.subarray(36, 4).toUint(false);

        this._durationMilliseconds = this._totalFrames * this._microsecondsPerFrame / 1000;

        // Read the streams in the file
        const streamHeaderLists = list.getLists(AviStream.LIST_TYPE);
        this._streams = streamHeaderLists.map((l) => new AviStream(l));
        this._codecs = this._streams.map((s) => s.codec).filter((c) => !!c);
    }

    /**
     * Gets the codecs read from the header list.
     */
    public get codecs(): ICodec[] { return this._codecs; }

    /**
     * Gets the duration of the media in this file, in milliseconds.
     */
    public get durationMilliseconds(): number { return this._durationMilliseconds; }

    /**
     * Gets the file flags.
     */
    public get flags(): number { return this._flags; }

    /**
     * Gets the height of the video in the file, in pixels.
     */
    public get height(): number { return this._height; }

    /**
     * Gets how far ahead audio is from video.
     */
    public get initialFrames(): number { return this._initialFrames; }

    /**
     * Gets the maximum number of bytes per second.
     */
    public get maxBytesPerSecond(): number { return this._maxBytesPerSecond; }

    /**
     * Gets the number of microseconds per frame.
     */
    public get microsecondsPerFrame(): number { return this._microsecondsPerFrame; }

    /**
     * Gets the suggested buffer size for the file, in bytes.
     */
    public get suggestedBufferSize(): number { return this._suggestedBufferSize; }

    /**
     * Gets the number of frames in the file.
     */
    public get totalFrames(): number { return this._totalFrames; }

    /**
     * Gets the width of the video in the file, in pixels.
     */
    public get width(): number { return this._width; }

    /**
     * Gets the total number of streams in the current instance, including ones that are not
     * supported by this library.
     */
    public get streamCount(): number { return this._streamCount; }

    /**
     * Gets the (supported) streams that were read from the header list.
     * @remarks Any modifications made to this list will not be reflected.
     */
    public get streams(): AviStream[] { return this._streams.slice(0); }
}
