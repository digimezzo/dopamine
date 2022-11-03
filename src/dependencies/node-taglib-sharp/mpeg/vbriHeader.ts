import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {Guards} from "../utils";

/**
 * Information about a variable bitrate MPEG audio stream encoded by the Fraunhofer encoder
 */
export default class VbriHeader {
    /**
     * Identifier that appears in the file to indicate the start of the VBRI header.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("VBRI", StringType.Latin1).makeReadOnly();

    /**
     * An empty and unset VBRI header.
     */
    public static readonly UNKNOWN = VbriHeader.fromInfo(0, 0);

    /**
     * Offset at which a VBRI header would appear in an MPEG audio packet. Always 32 bytes after
     * the end of the first MPEG header.
     */
    public static readonly VBRI_HEADER_OFFSET = 0x24;

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
    public static fromInfo(frames: number, size: number): VbriHeader {
        Guards.uint(frames, "frame");
        Guards.uint(size, "size");

        const header = new VbriHeader();
        header._isPresent = false;
        header._totalFrames = frames;
        header._totalSize = size;
        return header;
    }

    /**
     * Constructs a new instance from the raw data of the header.
     * @param data Data to read the VBRI header from
     */
    public static fromData(data: ByteVector): VbriHeader {
        Guards.truthy(data, "data");

        // Check to see if a valid VBRI header is available
        if (!data.startsWith(VbriHeader.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Not a valid VBRI header");
        }

        // Size start at position 10
        const header = new VbriHeader();
        header._totalSize = data.subarray(10, 4).toUint();
        header._totalFrames = data.subarray(14, 4).toUint();
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
}
