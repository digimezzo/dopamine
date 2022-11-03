import Genres from "../genres";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File, FileAccessMode} from "../file";
import {Tag, TagTypes} from "../tag";
import {Guards} from "../utils";

/**
 * Extends {@link Tag} to provide support for reading and writing tags stored in the ID3v1.1 format.
 */
export default class Id3v1Tag extends Tag {
    // #region Member Fields

    private static readonly COMMENT_LENGTH = 28;
    private static readonly TITLE_ARTIST_ALBUM_LENGTH = 30;
    private static readonly YEAR_LENGTH = 4;

    /**
     * Identifier used to recognize an ID3v1 tag.
     */
    public static readonly FILE_IDENTIFIER = ByteVector.fromString("TAG", StringType.UTF8);

    /**
     * Size of an ID3v1 tag.
     */
    public static readonly TOTAL_SIZE = 128;

    private _album: string;
    private _artist: string;
    private _comment: string;
    private _genre: number;
    private _title: string;
    private _track: number;
    private _year: string;

    // #endregion

    // #region Constructors

    private constructor(data: ByteVector | undefined) {
        super();

        if (data === undefined) {
            return;
        }

        // Some initial sanity checking
        Guards.truthy(data, "data");
        if (!data.startsWith(Id3v1Tag.FILE_IDENTIFIER)) {
            throw new CorruptFileError("Id3v1 data does not start with identifier");
        }

        this.parse(data);
    }

    /**
     * Constructs and initializes a new instance of {@link Id3v1Tag} with no contents.
     */
    public static fromEmpty(): Id3v1Tag {
        const output = new Id3v1Tag(undefined);
        output.clear();
        return output;
    }

    public static fromData(data: ByteVector): Id3v1Tag {
        return new Id3v1Tag(data);
    }

    public static fromFile(file: File, position: number): Id3v1Tag {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");

        file.mode = FileAccessMode.Read;

        if (position > file.length - Id3v1Tag.TOTAL_SIZE) {
            throw new Error("Argument out of range: position must be less than the length of the file");
        }

        file.seek(position);

        // Read the tag, it's always 128 bytes
        const data = file.readBlock(Id3v1Tag.TOTAL_SIZE);

        return new Id3v1Tag(data);
    }

    // #endregion

    /**
     * Renders the current instance as a raw ID3v1 tag.
     */
    public render(): ByteVector {
        return ByteVector.concatenate(
            Id3v1Tag.FILE_IDENTIFIER,
            ... Id3v1Tag.renderField(this._title, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH),
            ... Id3v1Tag.renderField(this._artist, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH),
            ... Id3v1Tag.renderField(this._album, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH),
            ... Id3v1Tag.renderField(this._year, Id3v1Tag.YEAR_LENGTH),
            ... Id3v1Tag.renderField(this._comment, Id3v1Tag.COMMENT_LENGTH),
            0x00,
            this._track,
            this._genre
        );
    }

    // #region Tag Overrides

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.Id3v1; }

    /** @inheritDoc */
    public get sizeOnDisk(): number { return Id3v1Tag.TOTAL_SIZE; }

    /** @inheritDoc */
    public get title(): string { return this._title || undefined; }
    /**
     * @inheritDoc
     * @remarks When stored on disk, only the first 30 bytes of the latin-1 encoded value will
     *     be stored. This may result in lost data.
     */
    public set title(value: string) { this._title = value ? value.trim() : ""; }

    /** @inheritDoc */
    public get performers(): string[] { return this._artist ? this._artist.split(";") : []; }
    /**
     * @inheritDoc
     * @remarks When stored on disk, only the first 30 bytes of the latin-1 encoded value will
     *     be stored, minus a byte for each additional performer (ie, two performers will only have
     *     29 bytes and three performers will only have 28 bytes). This may result in data loss.
     */
    public set performers(value: string[]) { this._artist = value ? value.join(";") : ""; }

    /** @inheritDoc */
    public get album(): string { return this._album || undefined; }
    /**
     * @inheritDoc
     * @remarks When stored on disk, only the first 30 bytes of the latin-1 encoded value will
     *     be stored. This may result in data loss.
     */
    public set album(value: string) { this._album = value ? value.trim() : ""; }

    /** @inheritDoc */
    public get comment(): string { return this._comment || undefined; }
    /**
     * @inheritDoc
     * @remarks When stored on disk, only the first 28 bytes of the latin-1 encoded value will
     *     be stored. This may result in lost data.
     */
    public set comment(value: string) { this._comment = value ? value.trim() : ""; }

    /** @inheritDoc */
    public get genres(): string[] {
        const genreName = Genres.indexToAudio(this._genre, false);
        return genreName ? [genreName] : [];
    }
    /**
     * @inheritDoc
     * @remarks Only first genre will be stored and only if it is an exact match for a value in
     *     the list of audio genres. All other values will result in the property being cleared.
     */
    public set genres(value: string[]) {
        this._genre = !value || value.length === 0
            ? 255
            : Genres.audioToIndex(value[0].trim());
    }

    /** @inheritDoc */
    public get year(): number {
        const value = parseInt(this._year, 10);
        return Number.isNaN(value) ? 0 : value;
    }
    /**
     * @inheritDoc
     * @remarks Only values betweenInclusive 1 and 9999 will be stored. All other values will result in
     *     the property being zeroed.
     */
    public set year(value: number) {
        Guards.uint(value, "value");
        this._year = value < 10000 ? value.toString(10) : "";
    }

    /** @inheritDoc */
    public get track(): number { return this._track; }
    /**
     * @inheritDoc
     * @remarks Only values betweenInclusive 1 and 255 will be stored. All other values will result in
     *     the property being zeroed.
     */
    public set track(value: number) {
        Guards.uint(value, "value");
        this._track = value < 256 ? value : 0;
    }

    /** @inheritDoc */
    public clear(): void {
        this._title = undefined;
        this._album = undefined;
        this._artist = undefined;
        this._year = undefined;
        this._comment = undefined;
        this._track = 0;
        this._genre = 255;
    }

    // #endregion

    // #region Private Helpers

    private parse(data: ByteVector): void {
        this._title = Id3v1Tag.parseString(data.subarray(3, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH));
        this._artist = Id3v1Tag.parseString(data.subarray(33, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH));
        this._album = Id3v1Tag.parseString(data.subarray(63, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH));
        this._year = Id3v1Tag.parseString(data.subarray(93, Id3v1Tag.YEAR_LENGTH));

        // Check for ID3v1.1
        // NOTE: ID3v1 does not support "track zero", this is not a bug in TagLib. Since a zeroed
        //     byte is what we would expect at the end of a C-string, specifically the comment
        //     string, a value of zero must be assumed to be just that.
        if (data.get(125) === 0 && data.get(126) !== 0) {
            // ID3v1.1 detected
            this._comment = Id3v1Tag.parseString(data.subarray(97, Id3v1Tag.COMMENT_LENGTH));
            this._track = data.get(126);
        } else {
            this._comment = Id3v1Tag.parseString(data.subarray(97, Id3v1Tag.TITLE_ARTIST_ALBUM_LENGTH));
            this._track = 0;
        }

        this._genre = data.get(127);
    }

    private static parseString(data: ByteVector): string {
        Guards.truthy(data, "data");

        const output = data.toString(StringType.Latin1).trim();
        const i = output.indexOf("\0");
        return i >= 0
            ? output.substring(0, i)
            : output;
    }

    private static renderField(value: string, maxLength: number): ByteVector[] {
        const valueToWrite = value?.substr(0, maxLength) || "";
        const remainingBytes = maxLength - valueToWrite.length;
        return [
            ByteVector.fromString(valueToWrite, StringType.Latin1),
            remainingBytes > 0 ? ByteVector.fromSize(remainingBytes) : undefined
        ];
    }

    // #endregion
}
