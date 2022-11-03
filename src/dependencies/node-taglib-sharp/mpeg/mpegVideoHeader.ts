import {CorruptFileError} from "../errors";
import {File} from "../file";
import {IVideoCodec, MediaTypes} from "../properties";
import {Guards, NumberUtils} from "../utils";

/**
 * Provides information about an MPEG video stream.
 */
export default class MpegVideoHeader implements IVideoCodec {
    private static readonly FRAME_RATES = [
        0, 24000 / 1001, 24, 25, 30000 / 1001, 30, 50, 60000 / 1001, 60
    ];

    private readonly _frameRateIndex: number;
    private readonly _videoBitrate: number;
    private readonly _videoHeight: number;
    private readonly _videoWidth: number;

    /**
     * Constructs and initializes a new instance of {@link MpegVideoHeader} by reading it from a
     * specified location in a specified file.
     * @param file File to read the header from
     * @param position Position in `file` at which the header begins
     */
    public constructor(file: File, position: number) {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");

        file.seek(position);
        const data = file.readBlock(7);

        if (data.length < 7) {
            throw new CorruptFileError("Insufficient data in header");
        }

        this._videoWidth = data.subarray(0, 2).toUshort() >>> 4;
        this._videoHeight = NumberUtils.uintAnd(data.subarray(1, 2).toUshort(), 0x0FFF);
        this._frameRateIndex = NumberUtils.uintAnd(data.get(3), 0x0F);
        this._videoBitrate = NumberUtils.uintAnd(NumberUtils.uintRShift(data.subarray(4, 3).toUint(), 6), 0x3FFFF);
    }

    // #region

    /** @inheritDoc */
    public get description(): string { return "MPEG Video"; }

    /**
     * @inheritDoc
     * For MPEG, this is always 0
     * @TODO: Can we calculate the duration?
     */
    public get durationMilliseconds(): number { return 0; }

    /** @inheritDoc */
    public get mediaTypes(): MediaTypes { return MediaTypes.Video; }

    /** @inheritDoc */
    public get videoBitrate(): number { return this._videoBitrate; }

    /** @inheritDoc */
    public get videoFrameRate(): number {
        return this._frameRateIndex < 9 ? MpegVideoHeader.FRAME_RATES[this._frameRateIndex] : 0;
    }

    /** @inheritDoc */
    public get videoHeight(): number { return this._videoHeight; }

    /** @inheritDoc */
    public get videoWidth(): number { return this._videoWidth; }

    // #endregion
}
