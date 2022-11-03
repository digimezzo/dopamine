import {IStream, Stream} from "./stream";
import {Guards} from "./utils";

/**
 * This interface provides abstracted access to a file. It permits access to non-standard file
 * systems and data retrieval methods.
 */
export interface IFileAbstraction {
    /**
     * Name or identifier used by the implementation
     * @remarks This value would typically represent a path or URL to be used when identifying
     *   the file system, but it could be any valid as appropriate for the implementation.
     */
    name: string;

    /**
     * Readable, seekable stream for the file referenced by the current instance.
     * @remarks This property is typically used when constructing an instance of {@link File}.
     *   Upon completion of the constructor {@link closeStream} will be called to close the stream.
     *   If the stream is to be reused after this point, {@link closeStream} should be implemented
     *   in a way to keep it open.
     */
    readStream: IStream;

    /**
     * Writable, seekable stream fo the file referenced by the current instance.
     * @remarks This property is typically used when saving a file with {@link File.save}. Upon
     *   completion of the method, {@link closeStream} will be called to close the stream. If the
     *   stream is to be reused after this point, {@link closeStream} should be implemented in a way
     *   to keep it open
     */
    writeStream: IStream;

    /**
     * Closes a stream created by the current instance.
     * @param stream Stream created by the current instance.
     */
    closeStream(stream: IStream): void;
}

/**
 * This class implements {@link IFileAbstraction} to provide support for accessing the local/
 * standard file.
 * This class is used as the standard file abstraction throughout the library.
 */
export class LocalFileAbstraction implements IFileAbstraction {
    /**
     * Contains the name used to open the file
     */
    private readonly _name: string;

    /**
     * Constructs and initializes a new instance from a specified path in the local file system
     * @param path Path of the file to use in the new instance
     * @throws Error Thrown if `path` is falsy
     */
    public constructor(path: string) {
        Guards.truthy(path, "path");
        this._name = path;
    }

    /** @inheritDoc */
    public get name(): string {
        return this._name;
    }

    /** @inheritDoc */
    public get readStream(): IStream {
        return Stream.createAsRead(this._name);
    }

    /** @inheritDoc */
    public get writeStream(): IStream {
        return Stream.createAsReadWrite(this._name);
    }

    /** @inheritDoc */
    public closeStream(stream: IStream): void {
        Guards.truthy(stream, "stream");
        stream.close();
    }
}
