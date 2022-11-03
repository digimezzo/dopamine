import {ByteVector} from "./byteVector";
import {IFileAbstraction, LocalFileAbstraction} from "./fileAbstraction";
import {IDisposable} from "./interfaces";
import {Properties} from "./properties";
import {IStream, SeekOrigin} from "./stream";
import {Tag, TagTypes} from "./tag";
import {FileUtils, Guards} from "./utils";

/**
 * Specifies the options to use when reading the media. Can be treated as flags.
 */
export enum ReadStyle {
    /**
     * The media properties will not be read.
     */
    None = 0,

    // Fast = 1,

    /**
     * The media properties will be read with average accuracy.
     */
    Average = 2,

    /**
     * Use the {@link PictureLazy} class in the the property {@link Tag.pictures}. This will avoid
     * loading picture content when reading the tag. Picture will be read lazily, when the picture
     * content is accessed.
     */
    PictureLazy = 4
}

/**
 * Specifies the type of file access operations currently permitted on an instance of {@link File}
 */
export enum FileAccessMode {
    /**
     * Read operations can be performed.
     */
    Read,

    /**
     * Read and write operations can be performed
     */
    Write,

    /**
     * The file is closed for both read and write operations
     */
    Closed
}

/**
 * Delegate is used for intervening in {@link File.createFromPath} by resolving the filetype before
 * any standard resolution operations.
 * @param abstraction File to be read.
 * @param mimeType MimeType of the file.
 * @param style How to read media properties from the file
 * @return New instance of {@link File} or `undefined` if the resolver could not be matched
 * @remarks A FileTypeResolver is one way of altering the behavior of
 *     {@link File.createFromPath} When {@link File.createFromPath} is called, the registered
 *     resolvers are invoked in reverse order in which they were registered. The resolver may then
 *     perform any operations necessary, including other type-finding methods. If the resolver
 *     returns a new {@link File} it will instantly be returned, by {@link File.createFromPath}. If
 *     it returns `undefined`, {@link File.createFromPath} will continue to process. If the resolver
 *     throws an exception, it will be uncaught. To register a resolver, use
 *     {@link File.addFileTypeResolver}.
 */
export type FileTypeResolver = (abstraction: IFileAbstraction, mimetype: string, style: ReadStyle) => File;

export type FileTypeConstructor = new (abstraction: IFileAbstraction, style: ReadStyle) => File;

/**
 * This abstract class provides a basic framework for reading and writing to a file, as well as
 * accessing basic tagging and media properties.
 * @remarks This class is agnostic to all specific media types. Its child classes, on the other
 *     hand, support the intricacies of different media and tagging formats. For example
 *     {@link Mpeg4File} supports the MPEG-4 specification and Apple's tagging format. Each file
 *     type can be created using its format specific constructors, but the preferred method is to
 *     use {@link File.createFromPath} or {@link File.createFromAbstraction} as it automatically
 *     detects the appropriate class from the file extension or provided MimeType.
 */
export abstract class File implements IDisposable {
    // #region Member Variables

    private static readonly BUFFER_SIZE: number = 1024;
    private static _fileTypes: {[mimeType: string]: FileTypeConstructor} = {};
    private static _fileTypeResolvers: FileTypeResolver[] = [];

    // @TODO: Remove protected member variables
    private readonly _fileAbstraction: IFileAbstraction;

    private _fileStream: IStream;
    private _tagTypesOnDisk: TagTypes = TagTypes.None;
    private _corruptionReasons: string[] = [];
    private _mimeType: string;

    // #endregion

    protected constructor(file: IFileAbstraction | string) {
        Guards.truthy(file, "file");
        this._fileAbstraction = typeof(file) === "string"
            ? <IFileAbstraction> new LocalFileAbstraction(file)
            : file;
    }

    /**
     * Creates a new instance of a {@link File} subclass for a specified file abstraction, MimeType,
     * and property read style.
     * @param abstraction Object to use when reading/writing from the current instance.
     * @param mimeType Optional, MimeType to use for determining the subclass of {@link File} to
     *     return. If omitted, the MimeType will be guessed based on the file's extension.
     * @param propertiesStyle Optional, level of detail to use when reading the media information
     *     from the new instance. If omitted, {@link ReadStyle.Average} is used.
     * @returns New instance of {@link File} as read from the specified abstraction.
     */
    public static createFromAbstraction(
        abstraction: IFileAbstraction,
        mimeType?: string,
        propertiesStyle: ReadStyle = ReadStyle.Average
    ): File {
        return File.createInternal(abstraction, mimeType, propertiesStyle);
    }

    /**
     * Creates a new instance of {@link File} subclass for a specified file path, MimeType, and
     * property read style.
     * @param filePath Path to the file to read/write.
     * @param mimeType Optional, MimeType to use for determining the subclass of {@link File} to
     *     return. If omitted, the MimeType will be guessed based on the file's extension.
     * @param propertiesStyle Optional, level of detail to use when reading the media information
     *     from the new instance. If omitted {@link ReadStyle.Average} is used.
     * @returns New instance of {@link File} as read from the specified path.
     */
    public static createFromPath(
        filePath: string,
        mimeType?: string,
        propertiesStyle: ReadStyle = ReadStyle.Average
    ): File {
        return File.createInternal(new LocalFileAbstraction(filePath), mimeType, propertiesStyle);
    }

    private static createInternal(abstraction: IFileAbstraction, mimeType: string, propertiesStyle: ReadStyle): File {
        Guards.truthy(abstraction, "abstraction");

        // Step 1) Calculate the MimeType based on the extension of the file if it was not provided
        if (!mimeType) {
            const ext = FileUtils.getExtension(abstraction.name);
            mimeType = `taglib/${ext.toLowerCase()}`;
        }

        // Step 2) Use file type resolvers if we have any
        for (const resolver of File._fileTypeResolvers) {
            const file = resolver(abstraction, mimeType, propertiesStyle);
            if (file) {
                return file;
            }
        }

        // Step 3) Use the lookup table of MimeTypes => types and attempt to instantiate it
        const fileType = File._fileTypes[mimeType];
        if (!fileType) {
            throw new Error(`Unsupported format: mimetype for ${abstraction.name} (${mimeType}) is not supported`);
        }
        return new fileType(abstraction, propertiesStyle);
    }

    // #region Properties

    /**
     * Gets the buffer size to use when reading large blocks of data
     */
    public static get bufferSize(): number { return File.BUFFER_SIZE; }

    /**
     * Reasons for which this file is marked as corrupt.
     */
    public get corruptionReasons(): string[] { return this._corruptionReasons; }

    /**
     * Gets the {@link IFileAbstraction} representing the file.
     */
    public get fileAbstraction(): IFileAbstraction { return this._fileAbstraction; }

    /**
     * Shortcut property to determine if a file has tags in memory.
     * NOTE: Just because `tag !== undefined` does not mean there are tags in memory.
     */
    public get hasTags(): boolean { return this.tagTypes !== TagTypes.None; }

    /**
     * Indicates whether or not this file may be corrupt. Files with unknown corruptions should not
     * be written.
     */
    public get isPossiblyCorrupt(): boolean { return this._corruptionReasons && this._corruptionReasons.length > 0; }

    /**
     * Indicates whether or not tags can be written back to the current file.
     */
    public get isWritable(): boolean { return !this.isPossiblyCorrupt; }

    /**
     * Gets the length of the file represented by the current instance. Value will be 0 if the file
     * is not open for reading;
     */
    public get length(): number { return this.mode === FileAccessMode.Closed ? 0 : this._fileStream.length; }

    /**
     * Gets the MimeType of the file as determined during creation of the instance.
     */
    public get mimeType(): string { return this._mimeType; }

    /**
     * Gets the file access mode in use by the current instance.
     */
    public get mode(): FileAccessMode {
        if (!this._fileStream) {
            return FileAccessMode.Closed;
        }
        if (this._fileStream.canWrite) {
            return FileAccessMode.Write;
        }
        return FileAccessMode.Read;
    }

    /**
     * Sets the file access mode in use by the current instance. Changing the value will cause the
     * stream currently in use to be closed, except when a change is made from
     * {@link FileAccessMode.Write} to {@link FileAccessMode.Read} which has no effect.
     * @param val File access mode to change to
     */
    public set mode(val: FileAccessMode) {
        // Skip processing if the mode we're changing to is the same as what we're already on, or
        // if we're in write mode changing to read mode (requesting less access)
        if (this.mode === val || (this.mode === FileAccessMode.Write && val === FileAccessMode.Read)) {
            return;
        }

        // Close any existing stream
        if (this._fileStream) {
            this._fileAbstraction.closeStream(this._fileStream);
        }

        this._fileStream = undefined;

        // Open a new stream that corresponds to the access mode requested
        if (val === FileAccessMode.Read) {
            this._fileStream = this._fileAbstraction.readStream;
        } else if (val === FileAccessMode.Write) {
            this._fileStream = this._fileAbstraction.writeStream;
        }

        // @TODO: Verify if we need this recursive call. I don't know what it intends to do for us
        this.mode = val;
    }

    /**
     * Gets the name of the file as stored in its file abstraction.
     */
    public get name(): string { return this._fileAbstraction.name; }

    /**
     * Gets the seek position in the internal stream used by the current instance. Value will be 0
     * if the file is not open for reading
     */
    public get position(): number { return this.mode === FileAccessMode.Closed ? 0 : this._fileStream.position; }

    /**
     * Gets the media properties of the file represented by the current instance.
     */
    public abstract get properties(): Properties;

    /**
     * Gets an abstract representation of all tags stored in the current instance.
     * @remarks This property provides generic and general access to the most common tagging
     *     features of a file. To access or add a specific type of tag in the file, use
     *     {@link File.getTag}.
     */
    public abstract get tag(): Tag;

    /**
     * Gets the tag types contained in the current instance.
     */
    public get tagTypes(): TagTypes { return !this.tag ? TagTypes.None : this.tag.tagTypes; }

    /**
     * Gets the tag types contained in the physical file represented by the current instance.
     */
    public get tagTypesOnDisk(): TagTypes { return this._tagTypesOnDisk; }
    protected set tagTypesOnDisk(value: TagTypes) { this._tagTypesOnDisk = value; }

    // #endregion

    // #region Public Methods

    /**
     * Registers the constructor for a subclass of {@link File} with the MimeType it is associated
     * with. Optionally, the MimeType can be forcefully overridden if it was already registered.
     * @param mimeType MimeType to register this subclass constructor to.
     * @param constructor Constructor for a subclass of {@link File} that will be called if a file
     *     with a MimeType of `mimeType` is created.
     * @param override If `true` and a subclass of {@link File} was already registered to
     *     `mimeType`, it will be forcefully overridden. If `false`, an {@link Error} will be
     *     thrown if a subclass already registered to the MimeType.}
     */
    public static addFileType(mimeType: string, constructor: FileTypeConstructor, override: boolean = false): void {
        Guards.truthy(mimeType, "mimeType");
        Guards.truthy(constructor, "constructor");
        if (!override && File._fileTypes[mimeType]) {
            throw new Error(`Invalid operation: MimeType ${mimeType} already has a file type associated with it`);
        }
        File._fileTypes[mimeType] = constructor;
    }

    /**
     * Registers a {@link FileTypeResolver} to the front of the list of file type resolvers.
     * @param resolver Function to handle resolving a subclass of {@link File} from an
     *     {@link IFileAbstraction}
     */
    public static addFileTypeResolver(resolver: FileTypeResolver): void {
        Guards.truthy(resolver, "resolver");
        File._fileTypeResolvers.unshift(resolver);
    }

    /**
     * Used for removing a file type constructor during unit testing
     */
    public static removeFileType(mimeType: string): void {
        delete File._fileTypes[mimeType];
    }

    /**
     * Used for removing a file type resolver during unit testing
     */
    public static removeFileTypeResolver(resolver: FileTypeResolver): void {
        const index = File._fileTypeResolvers.indexOf(resolver);
        if (index >= 0) {
            File._fileTypeResolvers.splice(index, 1);
        }
    }

    /**
     * Dispose the current instance. Equivalent to setting the mode to closed.
     */
    public dispose(): void {
        this.mode = FileAccessMode.Closed;
    }

    /**
     * Searches forward through a file for a specified pattern, starting at a specified offset.
     * @param pattern Pattern to search for in the current instance. Must be smaller than the
     * @param startPosition Seek position to start searching. Must be positive, safe integer.
     * @param before Optional pattern that the searched for pattern must appear before. If this
     *     pattern is found first, `-1` is returned.
     * @throws Error Thrown if `pattern` is not provided or `startPosition` is not a
     *     positive, safe integer.
     * @returns Index at which the value was found. If not found, `-1` is returned.
     */
    public find(pattern: ByteVector, startPosition: number = 0, before?: ByteVector): number {
        Guards.truthy(pattern, "pattern");
        Guards.safeUint(startPosition, "startPosition");

        this.mode = FileAccessMode.Read;

        if (pattern.length > File.BUFFER_SIZE) {
            return -1;
        }

        // The position in the file that the current buffer starts at
        const originalPosition = this._fileStream.position;
        let bufferOffset = startPosition;

        try {
            // Start the search at the offset.
            this._fileStream.position = startPosition;
            let buffer = this.readBlock(File.BUFFER_SIZE);
            for (buffer; buffer.length > 0; buffer = this.readBlock(File.BUFFER_SIZE)) {
                const location = buffer.find(pattern);
                if (before) {
                    const beforeLocation = buffer.find(before);
                    if (beforeLocation < location) {
                        return -1;
                    }
                }

                if (location >= 0) {
                    return bufferOffset + location;
                }

                // Ensure that we always rewind the stream a little so we never have a partial
                // match where our data exists betweenInclusive the end of read A and the start of read B.
                bufferOffset += File.BUFFER_SIZE - pattern.length;
                if (before && before.length > pattern.length) {
                    bufferOffset -= before.length - pattern.length;
                }
                this._fileStream.position = bufferOffset;
            }

            return -1;
        } finally {
            this._fileStream.position = originalPosition;
        }
    }

    /**
     * Gets a tag of the specified type from the current instance, optionally creating a new tag if
     * possible.
     * @param types Type of tag to read.
     * @param create Whether or not to try and create the tag if one is not found. `true` does not
     *     guarantee the tag will be created. For example, trying to create an ID3v2 tag on an OGG
     *     Vorbis file will always fail.
     * @returns Tag object containing the tag that was found in or added to the current instance.
     *     If no matching tag was found and none was created, `undefined` is returned. It is safe
     *     to assume that if `undefined` is not returned, the returned tag can be cast to the
     *     appropriate type.
     * @example ```
     *     id3 = file.getTag(TagTypes.ID3v2, true);
     *     if (id3) { (<ID3v2.Tag> id3).setTextFrame("TMOO", moods); }
     *
     *     asf = file.getTag(TagTypes.Asf, true);
     *     if (asf) { (<Asf.Tag> adf).setDescriptorStrings(moods, "WM/Mood", "Mood"); }
     *
     *     ape = file.getTag(TagTypes.Ape);
     *     if (ape) { (<Ape.Tag>).setValue("MOOD", moods); }
     * ```
     */
    // @TODO Implementation should define a default for create
    public abstract getTag(types: TagTypes, create: boolean): Tag;

    /**
     * Inserts a specified block of data into the file represented by the current instance, at a
     * specified location, replacing a specified number of bytes.
     * @param data Data to insert into the file.
     * @param start Index into the file at which to insert the data. Must be safe positive integer.
     * @param replace Number of bytes to replace. Typically this is the original size of the data
     *     block so that a new block will replace the old one.
     * @throws Error Thrown when: 1) data is falsey, 2) start is not a safe, positive number, or 3)
     *     replace is not a safe, positive number
     */
    public insert(data: ByteVector, start: number, replace: number = 0): void {
        Guards.truthy(data, "data");
        Guards.safeUint(start, "start");
        Guards.safeUint(replace, "replace");

        this.mode = FileAccessMode.Write;
        this._fileStream.position = start;

        if (data.length === replace) {
            // Case 1: We're writing the same number of bytes as we're replacing
            // Simply overwrite the block
            this.writeBlock(data);
            return;
        }
        if (data.length < replace) {
            // Case 2: We're writing less bytes than we are replacing
            // Write the block and then remove the rest of it
            this.writeBlock(data);
            this.removeBlock(start + data.length, replace - data.length);
            return;
        }

        // Case 3: We're writing more bytes than we're replacing
        // We need to write out as much as we're replacing, then shuffle the rest to the end

        // Step 1: Write the number of bytes to replace
        if (replace > 0) {
            this._fileStream.write(data, 0, replace);
        }

        // Step 2: Resize the file to fit all the new bytes
        const bytesToAdd = data.length - replace;
        this._fileStream.setLength(this._fileStream.length + bytesToAdd);

        // Step 3: Shuffle bytes to the end
        const buffer = new Uint8Array(File.bufferSize);
        const stopShufflingIndex = start + replace + bytesToAdd;
        let shuffleIndex = this._fileStream.length;
        while (shuffleIndex > stopShufflingIndex) {
            const bytesToReplace = Math.min(shuffleIndex - stopShufflingIndex, File.bufferSize);

            // Fill up the buffer
            this._fileStream.seek(shuffleIndex - bytesToReplace - bytesToAdd, SeekOrigin.Begin);
            this._fileStream.read(buffer, 0, bytesToReplace);

            // Write the buffer back
            this._fileStream.seek(shuffleIndex - bytesToReplace, SeekOrigin.Begin);
            this._fileStream.write(buffer, 0, bytesToReplace);

            shuffleIndex -= bytesToReplace;
        }

        // Step 4: Write the remainder of the data
        this._fileStream.seek(start + replace, SeekOrigin.Begin);
        this._fileStream.write(data, replace, data.length - replace);
    }

    /**
     * Mark the current instance as corrupt. NOTE: Not intended to be used outside of this library.
     * @param reason Reason why this file is considered to be corrupt
     */
    public markAsCorrupt(reason: string): void {
        this._corruptionReasons.push(reason);
    }

    /**
     * Reads a specified number of bytes at the current seek position from the current position.
     * This method reads the block of data at the current seek position. To change the seek
     * position, use {@link File.seek}.
     * @param length Number of bytes to read.
     * @returns ByteVector Object containing the data read from the current instance.
     * @throws Error Thrown when `length` is not a positive, safe integer.
     */
    public readBlock(length: number): ByteVector {
        Guards.safeUint(length, "length");
        if (length === 0) {
            return ByteVector.empty();
        }

        this.mode = FileAccessMode.Read;

        const buffer = new Uint8Array(length);
        let count = 0;
        let read = 0;
        let needed = length;
        do {
            count = this._fileStream.read(buffer, read, needed);
            read += count;
            needed -= count;
        } while (needed > 0 && count !== 0);

        return ByteVector.fromByteArray(buffer, read);
    }

    /**
     * Removes a specified block of data from the file represented by the current instance.
     * @param start Index into the file at which to remove data. Must be safe, positive integer.
     * @param length Number of bytes to remove. Must be a safe integer.
     * @throws Error thrown if 1) start is not a safe, positive integer or 2) length must be a safe
     *     integer.
     */
    public removeBlock(start: number, length: number): void {
        Guards.safeUint(start, "start");
        Guards.safeInt(length, "length");

        if (length <= 0) {
            return;
        }

        this.mode = FileAccessMode.Write;

        const bufferLength = File.BUFFER_SIZE;
        let readPosition = start + length;
        let writePosition = start;
        let buffer: ByteVector;
        // noinspection JSUnusedAssignment Short circuit evaluation prevents attempt to access uninitialized variable
        while (!buffer || buffer.length !== 0) {
            this._fileStream.position = readPosition;
            buffer = this.readBlock(bufferLength);
            readPosition += buffer.length;

            this._fileStream.position = writePosition;
            this.writeBlock(buffer);
            writePosition += buffer.length;
        }

        this.truncate(writePosition);
    }

    /**
     * Removes a set of tag types from the current instance. In order to remove all tags from a
     * file, pass {@link TagTypes.AllTags} as `types`
     * @param types Bitwise combined {@link TagTypes} value containing the tag types to be removed
     *     from the file
     */
    public abstract removeTags(types: TagTypes): void;

    /**
     * Searches backwards through a file for a specified pattern, starting at a specified offset.
     * @param pattern Pattern to search for in the current instance. Must be shorter than the
     *     {@link bufferSize}
     * @param startPosition Number of bytes from end of the file to begin searching.
     * @throws Error Thrown if `pattern` was not provided or if `startPosition` is
     *     not a safe, positive integer.
     * @returns Index at which the value wa found. If not found, `-1` is returned.
     */
    public rFind(pattern: ByteVector, startPosition: number = 0): number {
        Guards.truthy(pattern, "pattern");
        Guards.safeUint(startPosition, "startPosition");

        this.mode = FileAccessMode.Read;

        if (pattern.length > File.BUFFER_SIZE) {
            return -1;
        }

        // The position in the file that the current buffer starts at
        const originalPosition = this._fileStream.position;

        // Start the search at the offset
        let bufferOffset = this.length - startPosition;

        let readSize = Math.min(bufferOffset, File.BUFFER_SIZE);
        bufferOffset -= readSize;
        this._fileStream.position = bufferOffset;

        try {
            // See the notes in find() for an explanation of this algorithm
            let buffer = this.readBlock(readSize);
            for (buffer; buffer.length > 0; buffer = this.readBlock(readSize)) {
                const location = buffer.rFind(pattern);
                if (location >= 0) {
                    return bufferOffset + location;
                }

                readSize = Math.min(bufferOffset, File.BUFFER_SIZE);
                bufferOffset -= readSize;
                if (readSize + pattern.length > File.BUFFER_SIZE) {
                    bufferOffset += pattern.length;
                }

                this._fileStream.position = bufferOffset;
            }

            return -1;
        } finally {
            this._fileStream.position = originalPosition;
        }
    }

    /**
     * Saves the changes made in the current instance to the file it represents.
     */
    public abstract save(): void;

    /**
     * Moves the read/write pointer to a specified offset in the current instance, relative to a
     * specified origin.
     * @param offset Byte offset to seek to. Must be a safe, positive integer.
     * @param origin Origin from which to seek
     */
    public seek(offset: number, origin: SeekOrigin = SeekOrigin.Begin): void {
        if (this.mode === FileAccessMode.Closed) {
            return;
        }
        this._fileStream.seek(offset, origin);
    }

    /**
     * Writes a block of data to the file represented by the current instance at the current seek
     * position. This will overwrite any existing data at the seek position and append new data to
     * the file if writing past the current end.
     * @param data ByteVector containing data to the current instance.
     * @throws Error Thrown when `data` is not provided.
     */
    public writeBlock(data: ByteVector): void {
        Guards.truthy(data, "data");

        this.mode = FileAccessMode.Write;

        this._fileStream.write(data, 0, data.length);
    }

    // #endregion

    // #region Protected / Private Helpers

    /**
     * Prepares to save the file. This must be called at the beginning of every File.save() method.
     */
    protected preSave(): void {
        if (!this.isWritable) {
            throw new Error("Invalid operation: file is not writable");
        }
        if (this.isPossiblyCorrupt) {
            throw new Error("Corrupt file: corrupted file cannot be saved");
        }

        // All the lazy objects must be loaded before opening the file
        // @TODO: Load lazy objects
    }

    /**
     * Resizes the current instance to a specific number of bytes.
     * @param length Number of bytes to resize the file to, must be a safe, positive integer.
     */
    protected truncate(length: number): void {
        const oldMode = this.mode;
        this.mode = FileAccessMode.Write;
        this._fileStream.setLength(length);
        this.mode = oldMode;
    }

    // #endregion
}
