import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {Genres} from "../index";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * Represents a DivX tag that behaves similar to an ID3v1 tag.
 */
export default class DivxTag extends Tag {
    /**
     * FOURCC ID for a DivX tag chunk
     */
    public static readonly CHUNK_FOURCC = "IDVX";

    /**
     * Identifier used to recognize DivX tags.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("DIVXTAG", StringType.Latin1).makeReadOnly();

    /**
     * Size of a DivX tag in bytes.
     */
    public static readonly SIZE = 128;

    private _artist: string = "";
    private _comment: string = "";
    private _extraData: ByteVector = ByteVector.fromSize(6);
    private _genre: string = "";
    private _title: string = "";
    private _year: string = "";

    // #region Constructors

    private constructor() {
        super();
    }

    /**
     * Constructs and initializes a new instance by reading the raw tag data stored in a specified
     * {@link ByteVector} object.
     * @param data {@link ByteVector} that contains the raw tag data
     */
    public static fromData(data: ByteVector): DivxTag {
        Guards.truthy(data, "data");
        if (data.length < DivxTag.SIZE) {
            throw new CorruptFileError("DivX tag data is less than minimum DivX tag length");
        }
        if (!data.endsWith(this.FILE_IDENTIFIER)) {
            throw new CorruptFileError("DivX tag does not end with identifier");
        }

        const tag = new DivxTag();
        tag._title = data.subarray(0, 32).toString(StringType.Latin1).trim();
        tag._artist = data.subarray(32, 28).toString(StringType.Latin1).trim();
        tag._year = data.subarray(60, 4).toString(StringType.Latin1).trim();
        tag._comment = data.subarray(64, 48).toString(StringType.Latin1).trim();
        tag._genre = data.subarray(112, 3).toString(StringType.Latin1).trim();
        tag._extraData = data.subarray(115, 6);

        return tag;
    }

    /**
     * Constructs and initializes a new instance with no contents.
     */
    public static fromEmpty(): DivxTag {
        return new DivxTag();
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.DivX; }

    /** @inheritDoc */
    public get sizeOnDisk(): number { return DivxTag.SIZE; }

    /** @inheritDoc */
    public get title(): string { return this._title || undefined; }
    /** @inheritDoc */
    public set title(value: string) { this._title = value ? value.trim() : ""; }

    /** @inheritDoc */
    public get performers(): string[] { return this._artist ? this._artist.split(";") : []; }
    /** @inheritDoc */
    public set performers(value: string[]) { this._artist = value ? value.join(";") : ""; }

    /** @inheritDoc */
    public get comment(): string { return this._comment || undefined; }
    /** @inheritDoc */
    public set comment(value: string) { this._comment = value ? value.trim() : ""; }

    /**
     * @inheritDoc
     * @remarks Genre is stored as a numeric genre. This is translated into the human-
     *     readable genre.
     */
    public get genres(): string[] {
        const genreName = Genres.indexToVideo(this._genre, false);
        return genreName ? [genreName] : [];
    }
    /**
     * @inheritDoc
     * @remarks Genre is stored as a numeric genre, so only video genres are supported. Only
     *     one genre can be stored.
     */
    public set genres(value: string[]) {
        this._genre = value && value.length > 0
            ? Genres.videoToIndex(value[0].trim()).toString()
            : "";
    }

    /** @inheritDoc */
    public get year(): number {
        const numericYear = Number.parseInt(this._year, 10);
        return Number.isNaN(numericYear) ? 0 : numericYear;
    }
    /** @inheritDoc */
    public set year(value: number) {
        Guards.uint(value, "value");
        this._year = value > 0 && value < 10000
            ? value.toString()
            : "";
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public clear(): void {
        this._title = "";
        this._artist = "";
        this._genre = "";
        this._year = "";
        this._comment = "";
        this._extraData = ByteVector.fromSize(6);
    }

    /**
     * Renders the current instance as a raw DivX tag.
     */
    public render(): ByteVector {
        return ByteVector.concatenate(
            ByteVector.fromString(this._title.padEnd(32, " ").substr(0, 32), StringType.Latin1),
            ByteVector.fromString(this._artist.padEnd(28, " ").substr(0 , 28), StringType.Latin1),
            ByteVector.fromString(this._year.padEnd(4, " ").substr(0, 4), StringType.Latin1),
            ByteVector.fromString(this._comment.padEnd(48, " ").substr(0, 48), StringType.Latin1),
            ByteVector.fromString(this._genre.padEnd(3, " ").substr(0, 3), StringType.Latin1),
            this._extraData,
            DivxTag.FILE_IDENTIFIER
        );
    }

    // #endregion
}
