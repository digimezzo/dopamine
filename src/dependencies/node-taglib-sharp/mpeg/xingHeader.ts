import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {ChannelMode, MpegVersion} from "./mpegEnums";
import {Guards, NumberUtils} from "../utils";

/**
 * Information about a variable bitrate MPEG audio stream
 */
export default class XingHeader {
    /**
     * Identifier that appears in a file to indicate the start of a Xing header.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("Xing", StringType.Latin1).makeReadOnly();

    /**
     * An empty an unset Xing header
     */
    public static readonly UNKNOWN = XingHeader.fromInfo(0, 0);

    private _isPresent: boolean;
    private _totalFrames: number;
    private _totalSize: number;

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs a new instance with a specified frame count and size.
     * @param frames Frame count of the audio
     * @param size Stream size of the audio
     */
    public static fromInfo(frames: number, size: number): XingHeader {
        Guards.uint(frames, "frames");
        Guards.uint(size, "size");

        const header = new XingHeader();
        header._isPresent = false;
        header._totalFrames = frames;
        header._totalSize = size;
        return header;
    }

    /**
     * Constructs a new instance by reading its raw contents.
     * @param data Raw data of the Xing header
     */
    public static fromData(data: ByteVector): XingHeader {
        Guards.truthy(data, "data");

        // Check to see if a valid Xing header is available
        if (!data.startsWith(XingHeader.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Not a valid Xing header");
        }

        const header = new XingHeader();
        let position = 8;

        if (NumberUtils.hasFlag(data.get(7), 0x01)) {
            header._totalFrames = data.subarray(position, 4).toUint();
            position += 4;
        } else {
            header._totalFrames = 0;
        }

        if (NumberUtils.hasFlag(data.get(7), 0x02)) {
            header._totalSize = data.subarray(position, 4).toUint();
        } else {
            header._totalSize = 0;
        }

        header._isPresent = true;

        return header;
    }

    // #endregion

    // #region Properties

    /**
     * Whether or not a physical VBRI header is present in the file.
     */
    public get isPresent(): boolean { return this._isPresent; }

    /**
     * Gets the total number of frames in the file, as indicated by the current instance.
     */
    public get totalFrames(): number { return this._totalFrames; }

    /**
     * Gets the total size of the file, as indicated by the current instance.
     */
    public get totalSize(): number { return this._totalSize; }

    // #endregion

    /**
     * Gets the offset at which a Xing header would appear in an MPEG audio packet based on the
     * version and channel mode.
     * @param version Version of the MPEG audio packet
     * @param channelModel Channel mode of the MPEG audio packet
     * @returns Offset into an MPEG audio packet where the Xing header would appear.
     */
    public static xingHeaderOffset(version: MpegVersion, channelModel: ChannelMode): number {
        const singleChannel = channelModel === ChannelMode.SingleChannel;

        return version === MpegVersion.Version1
            ? (singleChannel ? 0x15 : 0x24)
            : (singleChannel ? 0x0D : 0x15);
    }

}
