import {Tag} from "../tag";
import {File, ReadStyle} from "../file";

/**
 * Common logic for parsing sequential tags at the start or end of a file. Classes that inherit
 * from this class are expected to provide `while(parser.read())` functionality. If {@link read}
 * returns `true` the tag that was just read can be read from {@link currentTag}.
 */
export default abstract class TagParser {
    // @TODO: Don't allow access to member variables
    private readonly _file: File;
    private readonly _readStyle: ReadStyle;
    private _currentTag: Tag;
    private _fileOffset: number;

    protected constructor(file: File, readStyle: ReadStyle, initialOffset: number) {
        this._file = file;
        this._fileOffset = initialOffset;
        this._readStyle = readStyle;
    }

    /**
     * Tag that was just read from the file. This will be `undefined` until {@link read} is called.
     * The value is not guaranteed if {@link read} returns `false`
     */
    public get currentTag(): Tag { return this._currentTag; }
    protected set currentTag(value: Tag) { this._currentTag = value; }

    protected get file(): File { return this._file; }

    protected get fileOffset(): number { return this._fileOffset; }
    protected set fileOffset(value: number) { this._fileOffset = value; }

    protected get readStyle(): ReadStyle { return this._readStyle; }

    /**
     * Reads the next tag from the file.
     * @returns boolean `true` is returned if a tag is found, the tag can be accessed from
     *     {@link currentTag}. `false` is returned if no tag was found.
     */
    public abstract read(): boolean;
}
