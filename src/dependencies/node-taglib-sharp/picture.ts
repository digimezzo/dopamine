import * as path from "path";
import {ByteVector} from "./byteVector";
import {IFileAbstraction, LocalFileAbstraction} from "./fileAbstraction";
import {ILazy} from "./interfaces";
import {FileUtils, Guards} from "./utils";
import {SeekOrigin} from "./stream";

/**
 * The type of content appearing in an {@link IPicture} instance.
 */
export enum PictureType {
    /**
     * @summary The picture is of a type other than those specified.
     */
    Other = 0x00,

    /**
     * @summary The picture is a 32x32 PNG image that should be used when displaying the file in a browser.
     */
    FileIcon = 0x01,

    /**
     * @summary The picture is of an icon different from {@link FileIcon}
     */
    OtherFileIcon = 0x02,

    /**
     * @summary The picture is of the front cover of the album.
     */
    FrontCover = 0x03,

    /**
     * @summary The picture is of the back cover of the album.
     */
    BackCover = 0x04,

    /**
     * @summary The picture is of a leaflet page including with the album.
     */
    LeafletPage = 0x05,

    /**
     * @summary The picture is of the album or disc itself.
     */
    Media = 0x06,

    /**
     * @summary The picture is of the lead artist or soloist.
     */
    LeadArtist = 0x07,

    /**
     * @summary The picture is of the artist or performer.
     */
    Artist = 0x08,

    /**
     * @summary The picture is of the conductor.
     */
    Conductor = 0x09,

    /**
     * @summary The picture is of the band or orchestra.
     */
    Band = 0x0A,

    /**
     * @summary The picture is of the composer.
     */
    Composer = 0x0B,

    /**
     * @summary The picture is of the lyricist or text writer.
     */
    Lyricist = 0x0C,

    /**
     * @summary The picture is of the recording location or studio.
     */
    RecordingLocation = 0x0D,

    /**
     * @summary The picture is one taken during the track's recording.
     */
    DuringRecording = 0x0E,

    /**
     * @summary The picture is one taken during the track's performance.
     */
    DuringPerformance = 0x0F,

    /**
     * @summary The picture is a capture from a movie screen.
     */
    MovieScreenCapture = 0x10,

    /**
     * @summary The picture is of a large, colored fish.
     */
    ColoredFish = 0x11,

    /**
     * @summary The picture is an illustration related to the track.
     */
    Illustration = 0x12,

    /**
     * @summary The picture contains the logo of the band or performer.
     */
    BandLogo = 0x13,

    /**
     * @summary The picture is the logo of the publisher or record
     */
    PublisherLogo = 0x14,

    /**
     * @summary In fact, this is not a Picture, but another file-type.
     */
    NotAPicture = 0xff
}

/**
 * Interface that provides generic information about a picture, including its contents, as used by
 * various formats.
 */
export interface IPicture {
    /**
     * Gets and sets the mime-type of the picture data stored in the current instance.
     */
    mimeType: string;

    /**
     * Gets and sets the type of the content visible in the picture stored in the current instance.
     */
    type: PictureType;

    /**
     * Gets and sets a filename of the picture stored in the current instance. Optional.
     */
    filename: string;

    /**
     * Gets and sets a description of the picture stored in the current instance. Optional.
     */
    description: string;

    /**
     * Gets and sets the picture data stored in the current instance.
     */
    data: ByteVector;
}

/**
 * This class implements {@link IPicture} and provides a mechanism for loading pictures from files.
 */
export class Picture implements IPicture {
    // #region Constants

    // @TODO: Just do this as a friggin dictionary
    private static readonly EXTENSION_TO_MIMETYPES: string[] = [
        "bin", "application/octet-stream", // Any kind of binary data - placed at top to act as default
        "aac", "audio/aac", // AAC audio file
        "abw", "application/x-abiword", // AbiWord document
        "arc", "application/octet-stream", // Archive document (multiple files embedded)
        "avi", "video/x-msvideo", // AVI: Audio Video Interleave
        "azw", "application/vnd.amazon.ebook", // Amazon Kindle eBook format
        "bmp", "image/bmp", // BMP image data
        "bmp", "image/x-windows-bmp", // BMP image data
        "bm", "image/bmp", // BMP image data
        "bz", "application/x-bzip", // BZip archive
        "bz2", "application/x-bzip2", // BZip2 archive
        "csh", "application/x-csh", // C-Shell script
        "css", "text/css", // Cascading Style Sheets (CSS)
        "csv", "text/csv", // Comma-separated values (CSV)
        "doc", "application/msword", // Microsoft Word
        "eot", "application/vnd.ms-fontobject", // MS Embedded OpenType fonts
        "epub", "application/epub+zip", // Electronic publication (EPUB)
        "gif", "image/gif", // Graphics Interchange Format (GIF)
        "htm", "text/html", // HyperText Markup Language (HTML)text / html
        "html", "text/html", // HyperText Markup Language (HTML)text / html
        "ico", "image/x-icon", // Icon format
        "ics", "text/calendar", // iCalendar format
        "jar", "application/java-archive", // Java Archive (JAR)
        "jpg", "image/jpeg", // JPEG images
        "jpeg", "image/jpeg", // JPEG images
        "js", "application/javascript", // JavaScript (ECMAScript)
        "json", "application/json", // JSON format
        "mid", "audio/midi", // Musical Instrument Digital Interface (MIDI)
        "midi", "audio/midi", // Musical Instrument Digital Interface (MIDI)
        "mp3", "audio/mpeg", // MPEG audio, mp3 is first since it's most likely
        "mp1", "audio/mpeg",
        "mp2", "audio/mpeg",
        "mpg", "video/mpeg",
        "mpeg", "video/mpeg", // MPEG Video
        "m4a", "audio/mp4",
        "mp4", "video/mp4",
        "m4v", "video/mp4",
        "mpkg", "application/vnd.apple.installer+xml", // Apple Installer Package
        "odp", "application/vnd.oasis.opendocument.presentation", // OpenDocument presentation document
        "ods", "application/vnd.oasis.opendocument.spreadsheet", // OpenDocument spreadsheet document
        "odt", "application/vnd.oasis.opendocument.text", // OpenDocument text document
        "oga", "audio/ogg", // OGG audio
        "ogg", "audio/ogg",
        "ogx", "application/ogg", // OGG
        "ogv", "video/ogg",
        "otf", "font/otf", // OpenType font
        "png", "image/png", // Portable Network Graphics
        "pdf", "application/pdf", // Adobe Portable Document Format (PDF)
        "ppt", "application/vnd.ms-powerpoint", // Microsoft PowerPoint
        "rar", "application/x-rar-compressed", // RAR archive
        "rtf", "application/rtf", // Rich Text Format (RTF)
        "sh", "application/x-sh", // Bourne shell script
        "svg", "image/svg+xml", // Scalable Vector Graphics (SVG)
        "swf", "application/x-shockwave-flash", // Small web format (SWF) or Adobe Flash document
        "tar", "application/x-tar", // Tape Archive (TAR)
        "tif", "image/tiff", //  Tagged Image File Format(TIFF)
        "tiff", "image/tiff", //  Tagged Image File Format(TIFF)
        "ts", "video/vnd.dlna.mpeg-tts", // Typescript file @TODO: Uh not in this context...
        "ttf", "font/ttf", // TrueType Font
        "vsd", "application/vnd.visio", // Microsoft Visio
        "wav", "audio/x-wav", // Waveform Audio Format
        "weba", "audio/webm", // WEBM audio
        "webm", "video/webm", // WEBM video
        "webp", "image/webp", // WEBP image
        "woff", "font/woff", // Web Open Font Format (WOFF)
        "woff2", "font/woff2", // Web Open Font Format (WOFF)
        "xhtml", "application/xhtml+xml", // XHTML
        "xls", "application/vnd.ms", // excel application
        "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // excel 2007 application
        "xml", "application/xml", // XML
        "xul", "application/vnd.mozilla.xul+xml", // XUL
        "zip", "application/zip", // ZIP archive
        "3gp", "video/3gpp", // 3GPP audio/video container
        "3g2", "video/3gpp2", // 3GPP2 audio/video container
        "7z", "application/x-7z-compressed", // 7-zip archive
    ];

    // #endregion

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs and initializes a new instance from a file located at the provided path. The type
     * and description of the picture are determined by the extension of the file. The file is
     * loaded completely.
     * @param filePath Path to the file to use for the file
     */
    public static fromPath(filePath: string): Picture {
        Guards.truthy(filePath, "filePath");

        const picture = new Picture();
        picture.data = ByteVector.fromPath(filePath);
        picture.filename = path.basename(filePath);
        picture.description = picture.filename;
        picture.mimeType = Picture.getMimeTypeFromFilename(picture.filename);
        picture.type = picture.mimeType.startsWith("image/") ? PictureType.FrontCover : PictureType.NotAPicture;
        return picture;

    }

    /**
     * Constructs and initializes a new instance from the data provided. The data is processed to
     * discover the type of the picture.
     * @param data Raw bytes of the picture to store in the instance. Cannot be falsey
     */
    public static fromData(data: ByteVector): Picture {
        Guards.truthy(data, "data");

        const picture = new Picture();
        picture.data = data.toByteVector();

        const ext = Picture.getExtensionFromData(data);
        picture.mimeType = Picture.getMimeTypeFromFilename(ext);
        if (ext) {
            picture.type = PictureType.FrontCover;
            picture.filename = picture.description = "cover" + ext;
        } else {
            picture.type = PictureType.NotAPicture;
            picture.filename = "UnknownType";
        }

        return picture;
    }

    /**
     * Constructs a new instance with the data provided. No processing of the data is done.
     * @param data Raw bytes of the picture to store in the instance. Cannot be falsey
     * @param type Type of the picture. Cannot be null or undefined
     * @param mimeType MimeType of the picture. Cannot be falsey
     * @param description Description of the picture. Cannot be null or undefined
     */
    public static fromFullData(data: ByteVector, type: PictureType, mimeType: string, description: string): Picture {
        Guards.truthy(data, "data");
        Guards.notNullOrUndefined(type, "type");
        Guards.truthy(mimeType, "mimeType");
        Guards.notNullOrUndefined(description, "description");

        const picture = new Picture();
        picture.data = data.toByteVector();
        picture.type = type;
        picture.mimeType = mimeType;
        picture.description = description;

        return picture;
    }

    /**
     * Constructs and initializes a new instance from a file abstraction. The description and type
     * of the file are determined by the name of the abstraction.
     * @param abstraction File abstraction to load the picture from.
     */
    public static fromFileAbstraction(abstraction: IFileAbstraction): Picture {
        Guards.truthy(abstraction, "abstraction");

        const picture = new Picture();
        picture.data = ByteVector.fromFileAbstraction(abstraction);
        picture.filename = abstraction.name;
        picture.description = abstraction.name;

        if (picture.filename && picture.filename.indexOf(".") >= 0) {
            picture.mimeType = Picture.getMimeTypeFromFilename(picture.filename);
            picture.type = picture.mimeType.startsWith("image/") ? PictureType.FrontCover : PictureType.NotAPicture;
        } else {
            const ext = Picture.getExtensionFromData(picture.data);
            picture.mimeType = Picture.getMimeTypeFromFilename(ext);
            if (ext) {
                picture.type = PictureType.FrontCover;
                picture.filename = picture.description = "cover" + ext;
            } else {
                picture.type = PictureType.NotAPicture;
                picture.filename = "UnknownType";
            }
        }

        return picture;
    }

    // #endregion

    // #region Public Properties

    /** @inheritDoc */
    public data: ByteVector;

    /** @inheritDoc */
    public description: string;

    /** @inheritDoc */
    public filename: string;

    /** @inheritDoc */
    public mimeType: string;

    /**
     * Gets and sets the type of the content visible in the picture stored in the current instance.
     */
    public type: PictureType;

    // #endregion

    // #region Public Static Methods

    /**
     * Retrieve a mimetype from raw file data by reading the first few bytes of the file. Less
     * accurate than {@link getExtensionFromMimeType} since this is limited to image file types.
     * @param data Bytes of the file to read to identify the extension
     * @returns string Extension of the file with dot at the beginning based on the first few bytes
     *     of the data. If the extension cannot be determined, `undefined` is returned
     */
    public static getExtensionFromData(data: ByteVector): string {
        let ext: string;

        // No picture unless it is corrupted, can fit in a file of less than 4 bytes
        if (data && data.length >= 4) {
            if (data.get(1) === 0x50 && data.get(2) === 0x4E && data.get(3) === 0x47) {
                ext = ".png";
            } else if (data.get(0) === 0x47 && data.get(1) === 0x49 && data.get(2) === 0x46) {
                ext = ".gif";
            } else if (data.get(0) === 0x42 && data.get(1) === 0x4D) {
                ext = ".bmp";
            } else if (data.get(0) === 0xFF && data.get(1) === 0xD8) {
                ext = ".jpg";
            }
        }

        return ext;
    }

    /**
     * Gets the file extension for a specific mimetype.
     * @param mime Mimetype to lookup the extension for
     * @returns string Extension of the file based on the mimetype with a dot at the beginning. If
     *     the extension cannot be determined, `undefined` is returned
     */
    public static getExtensionFromMimeType(mime: string): string {
        let ext: string;

        for (let i = 0; i < this.EXTENSION_TO_MIMETYPES.length; i += 2) {
            if (this.EXTENSION_TO_MIMETYPES[i + 1] === mime) {
                ext = this.EXTENSION_TO_MIMETYPES[i];
                break;
            }
        }

        return ext ? `.${ext}` : ext;
    }

    /**
     * Gets the mimetype of a file based on its extension. If the mimetype cannot be determined, it
     * is assumed to be a basic binary file.
     * @param name Filename with extension or just the extension of the file
     * @returns string Mimetype of the file based on the extension. If mimetype cannot be
     *     determined, application/octet-stream is returned.
     */
    public static getMimeTypeFromFilename(name: string): string {
        let mimeType: string = "application/octet-stream";

        if (!name)  {
            return mimeType;
        }

        const ext = FileUtils.getExtension(name);
        for (let i = 0; i < this.EXTENSION_TO_MIMETYPES.length; i += 2) {
            if (this.EXTENSION_TO_MIMETYPES[i] === ext) {
                mimeType = this.EXTENSION_TO_MIMETYPES[i + 1];
                break;
            }
        }

        return mimeType;
    }

    // #endregion
}

/**
 * This class implements {@link IPicture} and provides mechanisms for loading pictures from files.
 * Contrary to {@link Picture}, a reference to a file where the picture is located can be given and
 * the picture is lazily loaded from the file, meaning that it will be read from the file only when
 * needed. This saves time and memory if the picture loading is not required.
 */
export class PictureLazy implements IPicture, ILazy {
    private _data: ByteVector;
    private _description: string;
    private _file: IFileAbstraction;
    private _filename: string;
    private _mimeType: string;
    private _streamOffset: number;
    private _streamSize: number;
    private _type: PictureType;

    // #region Constructors

    private constructor() { /* private to enforce construction via static methods */ }

    /**
     * Constructs a new picture using data that's already been read into memory. The content
     * will not be lazily loaded.
     * @param data ByteVector Object containing picture data
     */
    public static fromData(data: ByteVector): PictureLazy {
        Guards.truthy(data, "data");

        const picture = new PictureLazy();
        picture._data = data.toByteVector();

        const extension = Picture.getExtensionFromData(data);
        if (extension) {
            picture._type = PictureType.FrontCover;
            picture._filename = `cover${extension}`;
            picture._description = picture._filename;
        } else {
            picture._type = PictureType.NotAPicture;
            picture._filename = "UnknownType";
        }
        picture._mimeType = Picture.getMimeTypeFromFilename(picture._filename);

        return picture;
    }

    /**
     * Constructs a new instance from a file abstraction. The content will be lazily loaded.
     * @param file File abstraction containing the file to read
     * @param offset Index into the file where the picture is located, must be a 32-bit integer
     * @param size Optionally, size of the picture in bytes. If omitted, all bytes of file will be
     *     read when lazily loaded. Must be a 32-bit integer or `undefined`
     */
    public static fromFile(file: IFileAbstraction, offset: number, size?: number): PictureLazy {
        Guards.truthy(file, "file");
        Guards.safeInt(offset, "offset");
        if (size !== undefined) {
            Guards.safeUint(offset, "size");
        }

        const picture = new PictureLazy();
        picture._file = file;
        picture._streamOffset = offset;
        picture._streamSize = size;
        picture._filename = file.name;
        picture._description = file.name;

        if (picture._filename && picture._filename.indexOf(".") > -1) {
            picture._mimeType = Picture.getMimeTypeFromFilename(picture._filename);
            picture._type = picture._mimeType.startsWith("image/") ? PictureType.FrontCover : PictureType.NotAPicture;
        }

        return picture;
    }

    /**
     * Constructs a new instance that will be lazily loaded from the filePath provided.
     * @param filePath Path to the file to read
     */
    public static fromPath(filePath: string): PictureLazy {
        Guards.truthy(filePath, "path");

        const picture = new PictureLazy();
        picture._file = new LocalFileAbstraction(filePath);
        picture._filename = path.basename(filePath);
        picture._description = picture._filename;
        picture._mimeType = Picture.getMimeTypeFromFilename(picture._filename);
        picture._type = picture._mimeType.startsWith("image/") ? PictureType.FrontCover : PictureType.NotAPicture;

        return picture;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get data(): ByteVector {
        this.load();
        return this._data;
    }
    /** @inheritDoc */
    public set data(value: ByteVector) { this._data = value; }

    /** @inheritDoc */
    public get description(): string { return this._description; }
    /** @inheritDoc */
    public set description(value: string) { this._description = value; }

    /** @inheritDoc */
    public get filename(): string {
        this.load();
        return this._filename;
    }
    /** @inheritDoc */
    public set filename(value: string) { this._filename = value; }

    /** @inheritDoc */
    public get isLoaded(): boolean { return !!this._data; }

    /** @inheritDoc */
    public get mimeType(): string {
        if (!this._mimeType) { this.load(); }
        return this._mimeType;
    }
    /** @inheritDoc */
    public set mimeType(value: string) { this._mimeType = value; }

    /** @inheritDoc */
    public get type(): PictureType {
        if (this._type === PictureType.Other && !this._mimeType) { this.load(); }
        return this._type;
    }
    /** @inheritDoc */
    public set type(value: PictureType) { this._type = value; }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public load(): void {
        // Already loaded?
        if (this._data) {
            return;
        }

        // Load the picture from the stream for the file
        let stream;
        try {
            if (this._streamSize === 0) {
                // Picture is 0 bytes, just use an empty byte vector for the data
                this._data = ByteVector.empty();
            } else if (this._streamSize !== undefined) {
                // Picture length was defined, read those bytes as the data
                stream = this._file.readStream;
                stream.seek(this._streamOffset, SeekOrigin.Begin);

                let count = 0;
                let read = 0;
                let needed = this._streamSize;
                const buffer = new Uint8Array(needed);

                do {
                    count = stream.read(buffer, read, needed);
                    read += count;
                    needed -= count;
                } while (needed > 0 && count !== 0);

                this._data = ByteVector.fromByteArray(buffer, read).toByteVector();
            } else {
                // Picture length was not defined, read entire stream as the data
                stream = this._file.readStream;
                stream.seek(this._streamOffset, SeekOrigin.Begin);
                this._data = ByteVector.fromInternalStream(stream);
            }
        } finally {
            // Free any open resources
            if (stream && this._file) {
                this._file.closeStream(stream);
            }
            this._file = undefined;
        }

        // Retrieve remaining properties from data (if required)
        if (!this._mimeType) {
            const ext = Picture.getExtensionFromData(this._data);
            this._mimeType = Picture.getMimeTypeFromFilename(ext);
            if (ext) {
                this._type = PictureType.FrontCover;
                if (!this._filename) {
                    this._filename = `cover${ext}`;
                    this._description = this._filename;
                }
            } else {
                this._type = PictureType.NotAPicture;
                if (!this._filename) {
                    this._filename = "UnknownType";
                }
            }
        }
    }

    // #endregion
}
