import * as IConv from "iconv-lite";
import * as fs from "fs";
import {IFileAbstraction} from "./fileAbstraction";
import {IStream} from "./stream";
import {Guards, NumberUtils} from "./utils";

/**
 * @summary Specifies the text encoding used when converting betweenInclusive a string and a
 *          {@link ByteVector}.
 * @remarks This enumeration is used by {@link ByteVector.fromString} and
 *          {@link ByteVector.toString}
 */
export enum StringType {
    /**
     * @summary The string is to be Latin-1 encoded.
     */
    Latin1 = 0,

    /**
     * @summary The string is to be UTF-16 encoded.
     */
    UTF16 = 1,

    /**
     * @summary The string is to be UTF-16BE encoded.
     */
    UTF16BE = 2,

    /**
     * @summary The string is to be UTF-8 encoded.
     */
    UTF8 = 3,

    /**
     * @summary The string is to be UTF-16LE encoded.
     */
    UTF16LE = 4
}

/**
 * Wrapper around the `iconv-lite` library to provide string encoding and decoding functionality.
 */
export class Encoding {
    private static readonly ENCODINGS = new Map<StringType, Encoding>([
        [StringType.Latin1, new Encoding("latin1")],
        [StringType.UTF8, new Encoding("utf8")],
        [StringType.UTF16BE, new Encoding("utf16-be")],
        [StringType.UTF16LE, new Encoding("utf16-le")]
    ]);

    /**
     * Contains the last generic UTF16 encoding read. Defaults to UTF16-LE
     */
    private static _lastUtf16Encoding: StringType = StringType.UTF16LE;

    private readonly _encoding: string;

    private constructor(encoding: string) {
        this._encoding = encoding;
    }

    /**
     * Gets the appropriate encoding instance for encoding and decoding strings, based on the
     * provided `type`.
     * @param type Type of string to get an {@link Encoding} class instance for
     * @param bom Optional, the byte order marker for the string. Used to determine UTF16 endianess
     */
    public static getEncoding(type: StringType, bom?: ByteVector): Encoding {
        // When reading a collection of UTF16 strings, sometimes only the first one will contain
        // the BOM. In that case, this field will inform the file what encoding to use for the
        // second string.
        if (type === StringType.UTF16) {
            // If we have a BOM, return the appropriate encoding.  Otherwise, assume we're
            // reading from a string that was already identified. In that case, we'll use
            // the last used encoding.
            if (bom && bom.length >= 2) {
                if (bom.get(0) === 0xFF && bom.get(1) === 0xFE) {
                    this._lastUtf16Encoding = StringType.UTF16LE;
                } else {
                    this._lastUtf16Encoding = StringType.UTF16BE;
                }
            }

            type = this._lastUtf16Encoding;
        }

        return this.ENCODINGS.get(type);

        // NOTE: The original .NET implementation has the notion of "broken" latin behavior that
        //       uses Encoding.Default. I have removed it in this port because 1) this behavior is
        //       not used anywhere in the library, 2) Encoding.Default could be anything depending
        //       on the machine's region, 3) in .NET Core this is always UTF8.
        //       If it turns out we need support for other non unicode encodings, we'll want to
        //       revisit this.
    }

    public decode(data: Uint8Array): string {
        // @TODO: The next version of iconv-lite will add Uint8Array to the types for decode. Until
        //    then, I have word it should work w/an 'unsafe' cast. See
        //    https://github.com/ashtuchkin/iconv-lite/issues/293
        return IConv.decode(<Buffer> data, this._encoding);
    }

    public encode(text: string): Uint8Array {
        return IConv.encode(text, this._encoding);
    }
}

/**
 * Wrapper around a `Uint8Array` that provides functionality for reading and writing byte arrays.
 * @remarks Implementation of this class uses a single `Uint8Array` to store bytes. Due to
 *     `Uint8Array`s being fixed length, any operation that inserts or removes values into the
 *     instance will result in a copy of the internal array being made. If multiple additions will
 *     be made, rather than using multiple inserts/adds, the {@link ByteVector.concatenate} method
 *     is provided to group additions/inserts and therefore improve performance.
 *
 *     The original .NET implementation had an ubiquitous `mid` method that would return a subset
 *     of the bytes in the current instance. In versions <5 of the node port, `mid` would make a
 *     copy of the subset of the bytes. Since this was frequently done right before reading a
 *     number or string, this copy was extremely wasteful. In version 5, the `mid` method was
 *     replaced with `subarray` which behaves identically to `Uint8Array.subarray` and returns
 *     an instance that is a 'view' of an existing instance - no copying involved. However, all
 *     write operations make copies, instances that are backed by 'views' may waste memory by
 *     referencing a `Uint8Array` that is much larger than the view.
 *
 *     With this in mind, best practices for using `ByteVectors`:
 *     * Calling {@link ByteVector.subarray} is cheap, use it when possible
 *     * If storing a subset of a `ByteVector`, store a copy with {@link ByteVector.toByteVector}
 *     * If building a `ByteVector`, use {@link ByteVector.concatenate} when possible
 *     * If the instance should be immutable, use {@link ByteVector.makeReadOnly}
 */
export class ByteVector {

    // #region Members

    private static readonly CRC_TABLE: Uint32Array = new Uint32Array([
        0x00000000, 0x04c11db7, 0x09823b6e, 0x0d4326d9,
        0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005,
        0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61,
        0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd,
        0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9,
        0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75,
        0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011,
        0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd,
        0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039,
        0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
        0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81,
        0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d,
        0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49,
        0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95,
        0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1,
        0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d,
        0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae,
        0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072,
        0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16,
        0x018aeb13, 0x054bf6a4, 0x0808d07d, 0x0cc9cdca,
        0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde,
        0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02,
        0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066,
        0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba,
        0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e,
        0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692,
        0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6,
        0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a,
        0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e,
        0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2,
        0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686,
        0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a,
        0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637,
        0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb,
        0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f,
        0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
        0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47,
        0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b,
        0x0315d626, 0x07d4cb91, 0x0a97ed48, 0x0e56f0ff,
        0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623,
        0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7,
        0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b,
        0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f,
        0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3,
        0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7,
        0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b,
        0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f,
        0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3,
        0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640,
        0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c,
        0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8,
        0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24,
        0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30,
        0x029f3d35, 0x065e2082, 0x0b1d065b, 0x0fdc1bec,
        0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088,
        0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654,
        0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0,
        0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c,
        0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18,
        0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4,
        0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0,
        0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
        0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668,
        0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4
    ]);

    /**
     * Contains a one byte text delimiter
     */
    private static readonly TD1: ByteVector = ByteVector.fromSize(1).makeReadOnly();

    /**
     * Contains a two byte text delimiter
     */
    private static readonly TD2: ByteVector = ByteVector.fromSize(2).makeReadOnly();

    private _bytes: Uint8Array;
    private _isReadOnly: boolean = false;

    // #endregion

    // #region Constructors

    private constructor(bytes: Uint8Array) {
        this._bytes = bytes;
    }

    /**
     * Creates a {@link ByteVector} from a collection of bytes, byte arrays, and byte vectors. This
     * method is better to use when a known quantity of byte vectors will be concatenated together,
     * since doing multiple calls to {@link ByteVector.addByteVector} results in the entire byte
     * vector being copied for each call.
     * @param vectors ByteVectors, byte arrays, or straight bytes to concatenate together into a
     *     new {@link ByteVector}
     * @returns ByteVector Single byte vector with the contents of the byte vectors in
     *     `vectors` concatenated together
     */
    // @TODO Remove usages of .addX when this can be substituted
    public static concatenate(... vectors: Array<Uint8Array|ByteVector|number|undefined>): ByteVector {
        // Get the length of the vector we need to create
        const totalLength = vectors.reduce<number>((accum, vector) => {
            if (vector === undefined || vector === null) {
                // Ignore falsy values
                return accum;
            }
            if (typeof(vector) === "number") {
                // Add 1 for a single byte
                return accum + 1;
            }

            // Add length of vector to length
            return accum + vector.length;
        }, 0);

        // Create a single big vector and copy the contents into it
        const result = ByteVector.fromSize(totalLength);
        let currentPosition = 0;
        for (const v of vectors) {
            if (v === undefined || v === null) {
                // Ignore falsy values
                continue;
            }

            if (typeof(v) === "number") {
                // We were given a single byte
                Guards.byte(v, "Byte values");
                result._bytes[currentPosition] = v;
                currentPosition += 1;
            } else {
                // We were given an array of bytes
                const getter = v instanceof ByteVector
                    ? (i: number) => v.get(i)
                    : (i: number) => v[i];

                for (let i = 0; i < v.length; i++) {
                    result._bytes[currentPosition + i] = getter(i);
                }
                currentPosition += v.length;
            }
        }

        return result;
    }

    /**
     * Creates an empty {@link ByteVector}
     */
    public static empty(): ByteVector {
        return new ByteVector(new Uint8Array(0));
    }

    /**
     * Creates a {@link ByteVector} from a base64 string.
     * @param str Base64 string to convert into a byte vector
     */
    public static fromBase64String(str: string): ByteVector {
        Guards.notNullOrUndefined(str, "str");

        const bytes = Buffer.from(str, "base64");
        return new ByteVector(bytes);
    }

    /**
     * Creates a {@link ByteVector} from a `Uint8Array` or `Buffer`
     * @param bytes Uint8Array of the bytes to put in the ByteVector
     * @param length Optionally, number of bytes to read. If this is not provided, it will default
     *     to the full length of `bytes`. If it is less than the length of `bytes`, `bytes` will be
     *     copied into the {@see ByteVector}.
     */
    public static fromByteArray(
        bytes: Uint8Array | Buffer | number[],
        length: number = bytes.length
    ): ByteVector {
        Guards.truthy(bytes, "bytes");
        Guards.safeUint(length, "length");
        if (length > bytes.length) {
            throw new Error("Argument out of range: length must be less than or equal to the length of the byte array");
        }

        if (!(bytes instanceof Uint8Array || bytes instanceof Buffer)) {
            bytes = new Uint8Array(bytes);
        }

        if (length < bytes.length) {
            bytes = new Uint8Array(bytes.subarray(0, length));
        }
        return new ByteVector(bytes);
    }

    /**
     * Creates a new instance by reading in the contents of a specified file abstraction.
     * @param abstraction File abstraction to read
     */
    public static fromFileAbstraction(abstraction: IFileAbstraction): ByteVector {
        Guards.truthy(abstraction, "abstraction");

        const stream = abstraction.readStream;
        const output = this.fromInternalStream(stream);
        abstraction.closeStream(stream);
        return output;
    }

    /**
     * Creates a 4 byte {@link ByteVector} with a signed 32-bit integer as the data
     * @param value Signed 32-bit integer to use as the data.
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromInt(value: number, isBigEndian: boolean = true): ByteVector {
        Guards.int(value, "value");

        const bytes = new Uint8Array(4);
        const dv = new DataView(bytes.buffer);
        dv.setInt32(0, value, !isBigEndian);

        return new ByteVector(bytes);
    }

    /**
     * Creates a ByteVector using the contents of an TagLibSharp-node stream as the contents. This
     * method reads from the current offset of the stream, not the beginning of the stream
     * @param stream TagLibSharp-node internal stream object
     */
    public static fromInternalStream(stream: IStream): ByteVector {
        // @TODO: Validate how much memory is used vs doing a concatenate
        Guards.truthy(stream, "stream");

        const vector = ByteVector.empty();
        const bytes = new Uint8Array(4096);
        while (true) {
            const bytesRead = stream.read(bytes, 0, bytes.length);
            if (bytesRead < bytes.length) {
                vector.addByteArray(bytes, bytesRead);
                break;
            } else {
                vector.addByteArray(bytes);
            }
        }

        return vector;
    }

    /**
     * Creates an 8 byte {@link ByteVector} with a signed 64-bit integer as the data
     * @param value Signed 64-bit integer to use as the data. If using a `bigint`, it must fit
     *     within 8 bytes. If using a `number`, it must be a safe integer.
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromLong(value: bigint | number, isBigEndian: boolean = true): ByteVector {
        let bigIntValue: bigint;
        if (typeof(value) === "number") {
            Guards.safeInt(value, "value");
            bigIntValue = BigInt(value);
        } else {
            Guards.long(value, "value");
            bigIntValue = value;
        }

        const bytes = new Uint8Array(8);
        const dv = new DataView(bytes.buffer);
        dv.setBigInt64(0, bigIntValue, !isBigEndian);

        return new ByteVector(bytes);
    }

    /**
     * Creates a {@link ByteVector} using the contents of a file as the data
     * @param path Path to the file to store in the ByteVector
     */
    public static fromPath(path: string): ByteVector {
        Guards.truthy(path, "path");

        // NOTE: We are doing this with read file b/c it removes the headache of working with streams
        // @TODO: Add support for async file reading
        const fileBuffer = fs.readFileSync(path);
        return ByteVector.fromByteArray(fileBuffer);
    }

    /**
     * Creates a 2 byte {@link ByteVector} with a signed 16-bit integer as the data
     * @param value Signed 16-bit integer to use as the data.
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromShort(value: number, isBigEndian: boolean = true): ByteVector {
        Guards.short(value, "value");

        const bytes = new Uint8Array(2);
        const dv = new DataView(bytes.buffer);
        dv.setInt16(0, value, !isBigEndian);

        return new ByteVector(bytes);
    }

    /**
     * Creates a {@link ByteVector} of a given length with a given value for all the elements
     * @param size Length of the ByteVector. Must be a positive safe integer
     * @param fill Byte value to initialize all elements to. Must be a positive 8-bit integer
     */
    public static fromSize(size: number, fill: number = 0x0): ByteVector {
        Guards.safeUint(size, "size");
        Guards.byte(fill, "fill");

        const bytes = new Uint8Array(size);
        bytes.fill(fill);
        return new ByteVector(bytes);
    }

    /**
     * Creates {@link ByteVector} with the contents of a stream as the data. The stream will be read
     * to the end before the ByteVector is returned.
     * @param readStream Readable stream that will be read in entirety.
     */
    public static fromStream(readStream: NodeJS.ReadableStream): Promise<ByteVector> {
        return new Promise<ByteVector>((complete, fail) => {
            if (!readStream) {
                fail(new Error("Null argument exception: Stream was not provided"));
            }

            // Setup the output
            const output = ByteVector.empty();

            // Setup the events to read the stream
            readStream.on("readable", () => {
                const bytes = <Buffer> readStream.read();
                if (bytes) {
                    output.addByteArray(bytes);
                }
            });
            readStream.on("end", () => {
                complete(output);
            });
            readStream.on("error", (error: Error) => {
                fail(error);
            });
        });
    }

    /**
     * Creates {@link ByteVector} with the byte representation of a string as the data.
     * @param text String to store in the ByteVector
     * @param type StringType to use to encode the string. If {@link StringType.UTF16} is used, the
     *        string will be encoded as UTF16-LE.
     * @param length Number of characters from the string to store in the ByteVector. Must be a
     *        positive 32-bit integer.
     */
    public static fromString(
        text: string,
        type: StringType,
        length: number = Number.MAX_SAFE_INTEGER
    ): ByteVector {
        // @TODO: Allow adding delimiters and find usages that immediately add a delimiter
        Guards.notNullOrUndefined(text, "text");
        if (!Number.isInteger(length) || !Number.isSafeInteger(length) || length < 0) {
            throw new Error("Argument out of range exception: length is invalid");
        }

        // If we're doing UTF16 w/o specifying an endian-ness, inject a BOM which also coerces
        // the converter to use UTF16LE
        const vector = type === StringType.UTF16
            ? new ByteVector(new Uint8Array([0xff, 0xfe]))
            : ByteVector.empty();

        // NOTE: This mirrors the behavior from the original .NET implementation where empty
        //       strings return an empty ByteVector (possibly with UTF16LE BOM)
        if (!text) {
            return vector;
        }

        // Shorten text if only part of it was requested
        if (text.length > length) {
            text = text.substr(0, length);
        }

        // Encode the string into bytes
        const textBytes = Encoding.getEncoding(type, vector).encode(text);
        vector.addByteArray(textBytes);
        return vector;
    }

    /**
     * Creates a 4 byte {@link ByteVector} with a positive 32-bit integer as the data
     * @param value Positive 32-bit integer to use as the data
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromUint(value: number, isBigEndian: boolean = true): ByteVector {
        Guards.uint(value, "value");

        const bytes = new Uint8Array(4);
        const dv = new DataView(bytes.buffer);
        dv.setUint32(0, value, !isBigEndian);
        return new ByteVector(bytes);
    }

    /**
     * Creates an 8 byte {@link ByteVector} with a positive 64-bit integer as the data
     * @param value Positive 64-bit integer to use as the data. If using a `bigint` it must fit
     *     within 8 bytes.
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromUlong(value: bigint | number, isBigEndian: boolean = true): ByteVector {
        let bigIntValue: bigint;
        if (typeof(value) === "number") {
            Guards.safeUint(value, "value");
            bigIntValue = BigInt(value);
        } else {
            Guards.ulong(value, "value");
            bigIntValue = value;
        }

        const bytes = new Uint8Array(8);
        const dv = new DataView(bytes.buffer);
        dv.setBigUint64(0, bigIntValue, !isBigEndian);
        return new ByteVector(bytes);
    }

    /**
     * Creates a 2 byte {@link ByteVector} with a positive 16-bit integer as the data
     * @param value Positive 16-bit integer to use as the data.
     * @param isBigEndian If `true`, `value` will be stored in big endian format. If `false`,
     *     `value` will be stored in little endian format
     */
    public static fromUshort(value: number, isBigEndian: boolean = true): ByteVector {
        Guards.ushort(value, "value");

        const bytes = new Uint8Array(2);
        const dv = new DataView(bytes.buffer);
        dv.setUint16(0, value, !isBigEndian);
        return new ByteVector(bytes);
    }

    // #endregion

    // #region Properties

    /**
     * Calculates the CRC32 of the current instance.
     */
    public get checksum(): number {
        let sum = 0;
        for (const b of this._bytes) {
            const index = NumberUtils.uintXor(NumberUtils.uintAnd(NumberUtils.uintRShift(sum, 24), 0xFF), b);
            sum = NumberUtils.uintXor(NumberUtils.uintLShift(sum, 8), ByteVector.CRC_TABLE[index]);
        }
        return sum;
    }

    /**
     * Whether the current instance has 0 bytes stored.
     */
    public get isEmpty(): boolean { return this._bytes?.length === 0; }

    /**
     * Whether the current instance is read-only. If `true`, any call that will modify the instance
     * will throw.
     */
    public get isReadOnly(): boolean { return this._isReadOnly; }

    /**
     * Whether the current instance is a 'view' of another byte vector.
     */
    public get isView(): boolean {
        return this._bytes.byteOffset !== 0 && this._bytes.byteLength !== this._bytes.buffer.byteLength;
    }

    /**
     * Number of bytes currently in this instance.
     */
    public get length(): number { return this._bytes.length; }

    // #endregion

    // #region Static Methods

    /**
     * Gets the appropriate length null-byte text delimiter for the specified `type`.
     * @param type String type to get delimiter for
     */
    public static getTextDelimiter(type: StringType): ByteVector {
        return type === StringType.UTF16 || type === StringType.UTF16BE || type === StringType.UTF16LE
            ? ByteVector.TD2
            : ByteVector.TD1;
    }

    /**
     * Compares two byte vectors. Returns a numeric value
     * @param a Byte vector to compare against `b`
     * @param b Byte vector to compare against `a`
     * @returns number `0` if the two vectors are the same. Any other value indicates the two are
     *     different. If the two vectors differ by length, this will be the length of `a` minus the
     *     length of `b`. If the lengths are the same it will be the difference between the first
     *     element that differs.
     */
    public static compare(a: ByteVector, b: ByteVector): number {
        Guards.truthy(a, "a");
        Guards.truthy(b, "b");

        let diff = a.length - b.length;
        for (let i = 0; diff === 0 && i < a.length; i++) {
            diff = a.get(i) - b.get(i);
        }

        return diff;
    }

    /**
     * Returns `true` if the contents of the two {@link ByteVector}s are identical, returns `false`
     * otherwise
     * @param first ByteVector to compare with `second`
     * @param second ByteVector to compare with `first`
     */
    public static equals(first: ByteVector, second: ByteVector): boolean {
        const fNull = !first;
        const sNull = !second;
        if (fNull && sNull) {
            // Since (f|s)null could be true with `undefined` OR `null`, we'll just let === decide it for us
            return first === second;
        }

        if (fNull || sNull) {
            // If only one is null/undefined, then they are not equal
            return false;
        }

        return ByteVector.compare(first, second) === 0;
    }

    // #endregion

    // #region Public Methods

    /**
     * Gets iterator for iterating over bytes in the current instance.
     */
    public *[Symbol.iterator](): Iterator<number> {
        for (const b of this._bytes) {
            yield b;
        }
    }

    /**
     * Adds a single byte to the end of the current instance
     * @param byte Value to add to the end of the ByteVector. Must be positive 8-bit integer.
     */
    public addByte(byte: number): void {
        Guards.byte(byte, "byte");
        this.throwIfReadOnly();

        this.addByteArray(new Uint8Array([byte]));
    }

    /**
     * Adds an array of bytes to the end of the current instance
     * @param data Array of bytes to add to the end of the ByteVector
     * @param length Number of elements from `data` to copy into the current instance
     */
    public addByteArray(data: Uint8Array, length?: number): void {
        Guards.truthy(data, "data");
        this.throwIfReadOnly();

        if (data.length === 0 || length === 0) {
            return;
        }

        // Create a copy of the existing byte array with additional space at the end for the new
        // byte array. Copy the new array into it.
        length = length || data.length;
        const oldData = this._bytes;
        const newData = length !== data.length ? data.subarray(0, length) : data;

        this._bytes = new Uint8Array(oldData.length + length);
        this._bytes.set(oldData);
        this._bytes.set(newData, oldData.length);
    }

    /**
     * Adds a {@link ByteVector} to the end of this ByteVector
     * @param data ByteVector to add to the end of this ByteVector
     */
    public addByteVector(data: ByteVector): void {
        Guards.truthy(data, "data");
        this.throwIfReadOnly();

        this.addByteArray(data._bytes);
    }

    /**
     * Removes all elements from this {@link ByteVector}
     * @remarks This method replaces the internal byte array with a new one.
     */
    public clear(): void {
        this.throwIfReadOnly();
        this._bytes = new Uint8Array(0);
    }

    /**
     * Determines if `pattern` exists at a certain `offset` in this byte vector.
     * @param pattern ByteVector to search for at in this byte vector
     * @param offset Position in this byte vector to search for the pattern. If omitted, defaults
     *     to `0`
     */
    public containsAt(pattern: ByteVector, offset: number = 0): boolean {
        Guards.truthy(pattern, "pattern");
        Guards.safeInt(offset, "offset");

        // Sanity check - make sure we're within the range of the comprehension
        if (offset < 0 || offset >= this.length || pattern.length === 0) {
            return false;
        }

        // Look through looking for a mismatch
        for (let i = 0; i < pattern.length; i++) {
            if (this._bytes[offset + i] !== pattern.get(i)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compares the current instance to another byte vector. Returns a numeric result.
     * @param other Other byte vector to compare against the current instance.
     */
    public compareTo(other: ByteVector): number {
        return ByteVector.compare(this, other);
    }

    /**
     * Determines whether this byte vector ends with the provided `pattern`.
     * @param pattern ByteVector to look for at the end of this byte vector
     */
    public endsWith(pattern: ByteVector): boolean {
        return this.containsAt(pattern, this.length - pattern.length);
    }

    /**
     * Determines whether this byte vector ends with a part of the `pattern`.
     * NOTE: if this instance ends with `pattern` perfectly, it must end with n-1 or
     * fewer bytes.
     * @param pattern ByteVector to look for at the end of this byte vector
     */
    public endsWithPartialMatch(pattern: ByteVector): number {
        Guards.truthy(pattern, "pattern");

        // Short circuit impossible calls
        if (pattern.length > this.length) {
            return -1;
        }

        // Try to match the last n-1 bytes of the source (where n is the pattern length), if that
        // fails, try to match n-2, n-3... until there are no more to try.
        const startIndex = this.length - pattern.length;
        for (let i = 0; i < pattern.length; i++) {
            const patternSubset = pattern.subarray(0, pattern.length - i);
            if (this.containsAt(patternSubset, startIndex + i)) {
                return startIndex + i;
            }
        }

        return -1;
    }

    /**
     * Determines if this instance has identical contents to the `other` instance.
     * @param other Other instance to compare against the current instance.
     */
    public equals(other: ByteVector): boolean {
        return ByteVector.equals(this, other);
    }

    /**
     * Searches this instance for the `pattern`. Returns the index of the first instance
     * of the pattern, or `-1` if it was not found. Providing a `byteAlign` requires the
     * pattern to appear at an index that is a multiple of the byteAlign parameter.
     * Example: searching "abcd" for "ab" with byteAlign 1 will return 0. Searching "abcd" for
     * "ab" with byteAlign 2 will return 1. Searching "00ab" for "ab" with byteAlign 2 will return
     * 2. Searching "0abc" with byteAlign 2 will return -1.
     * @param pattern Pattern of bytes to search this instance for
     * @param byteAlign Optional, byte alignment the pattern much align to
     */
    public find(pattern: ByteVector, byteAlign: number = 1): number {
        Guards.truthy(pattern, "pattern");
        Guards.uint(byteAlign, "byteAlign");
        Guards.greaterThanInclusive(byteAlign, 1, "byteAlign");

        // Sanity check impossible matches
        if (this.length === 0 || pattern.length === 0 || pattern.length > this.length) {
            return -1;
        }

        for (let i = 0; i < this.length; i += byteAlign) {
            let j = 0;
            while (j < pattern.length) {
                if (this._bytes[i + j] !== pattern.get(j)) {
                    break;
                }

                j++;
            }

            if (j === pattern.length ) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Gets the byte at the given `index`.
     * @param index Element index to return
     */
    public get(index: number): number {
        Guards.uint(index, "index");
        Guards.lessThanInclusive(index, this.length - 1, "index");
        return this._bytes[index];
    }

    /**
     * Gets the index of the first occurrence of the specified value.
     * @param item A byte to find within the current instance.
     * @returns An integer containing the first index at which the value was found, or -1 if it
     *          was not found/
     */
    public indexOf(item: number): number {
        return this._bytes.indexOf(item);
    }

    /**
     * Makes the current instance read-only, causing any call that would modify it or allow it to
     * be modified to throw.
     */
    public makeReadOnly(): this {
        this._isReadOnly = true;
        return this;
    }

    /**
     * Searches this instance for the `pattern` occurring after a given offset. Returns the index
     * of the first instance of the pattern, relative to the start of the array, or `-1` if it was
     * not found. Providing a `byteAlign` requires the pattern to appear at an index that is a
     * multiple of the byteAlign parameter. Example: searching "abcd" for "ab" with byteAlign 1
     * will return 0. Searching "abcd" for "ab" with byteAlign 2 will return 1. Searching "00ab"
     * for "ab" with byteAlign 2 will return 2. Searching "0abc" with byteAlign 2 will return -1.
     * @param pattern Pattern of bytes to search this instance for
     * @param offset Index into the instance to begin searching for `pattern`
     * @param byteAlign Optional, byte alignment the pattern much align to
     */
    public offsetFind(pattern: ByteVector, offset: number, byteAlign?: number): number {
        const findIndex = this.subarray(offset).find(pattern, byteAlign);
        return findIndex >= 0 ? findIndex + offset : findIndex;
    }

    /**
     * Resizes this instance to the length specified in `size`. If the desired size is
     * longer than the current length, it will be filled with the byte value in
     * `padding`. If the desired size is shorter than the current length, bytes will be
     * removed.
     * @param size Length of the byte vector after resizing. Must be unsigned 32-bit integer
     * @param padding Byte to fill any excess space created after resizing
     */
    public resize(size: number, padding: number = 0x0): void {
        Guards.uint(size, "size");
        Guards.byte(padding, "padding");

        const oldData = this._bytes;
        if (size < this.length) {
            // Shorten it
            this._bytes = new Uint8Array(size);
            this._bytes.set(oldData.subarray(0, size));
        } else if (this.length < size) {
            // Lengthen it
            this._bytes = new Uint8Array(size);
            this._bytes.set(oldData);
            this._bytes.fill(padding, oldData.length);
        }
        // Do nothing on same size
    }

    /**
     * Finds a byte vector by searching from the end of this instance and working towards the
     * beginning of this instance. Returns the index of the first instance of the pattern, or `-1`
     * if it was not found. Providing a `byteAlign` requires the pattern to appear at an
     * index that is a multiple of the byteAlign parameter.
     * Example: searching "abcd" for "ab" with byteAlign 1 will return 0. Searching "abcd" for
     * "ab" with byteAlign 2 will return 1. Searching "00ab" for "ab" with byteAlign 2 will return
     * 2. Searching "0abc" with byteAlign 2 will return -1.
     * @param pattern Pattern of bytes to search this instance for
     * @param byteAlign Optional, byte alignment the pattern must align to
     */
    public rFind(pattern: ByteVector, byteAlign: number = 1): number {
        Guards.truthy(pattern, "pattern");
        Guards.uint(byteAlign, "byteAlign");
        Guards.greaterThanInclusive(byteAlign, 1, "byteAlign");

        // Sanity check impossible matches
        if (pattern.length === 0 || pattern.length > this.length) {
            return -1;
        }

        const alignOffset = this.length % byteAlign;
        for (let i = this.length - alignOffset - pattern.length; i >= 0; i -= byteAlign) {
            let j = 0;
            while (j < pattern.length) {
                if (this._bytes[i + j] !== pattern.get(j)) {
                    break;
                }

                j++;
            }

            if (j === pattern.length) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Sets the value at a specified index
     * @param index Index to set the value of
     * @param value Value to set at the index. Must be a valid integer betweenInclusive 0x0 and 0xff
     */
    public set(index: number, value: number): void {
        Guards.uint(index, "index");
        Guards.lessThanInclusive(index, this.length - 1, "index");
        Guards.byte(value, "value");

        this.splice(index, 1, [value]);
    }

    /**
     * Changes the contents of the current instance by removing or replacing existing elements
     * and/or adding new elements.
     * @param start Index at which to start changing the array. Must be less than the length of
     *     the instance
     * @param deleteCount Number of elements in the array to remove from start. If greater than
     *     the remaining length of the element, it will be capped at the remaining length
     * @param items Elements to add to the array beginning from start. If omitted, the method will
     *     only remove elements from the current instance.
     */
    public splice(start: number, deleteCount: number, items?: ByteVector|Uint8Array|number[]): void {
        Guards.safeUint(start, "start");
        Guards.lessThanInclusive(start, this.length, "start");
        Guards.safeUint(deleteCount, "deleteCount");
        this.throwIfReadOnly();

        // Determine how many elements we're *actually* deleting
        deleteCount = Math.min(deleteCount, this.length - start);

        const addCount = items ? items.length : 0;
        const newBytes = new Uint8Array(this._bytes.length - deleteCount + addCount);
        newBytes.set(this._bytes.subarray(0, start));
        if (items) {
            items = items instanceof ByteVector ? items._bytes : items;
            newBytes.set(items, start);
        }
        newBytes.set(this._bytes.subarray(start + deleteCount), start + addCount);

        this._bytes = newBytes;
    }

    /**
     * Splits this byte vector into a list of byte vectors using a separator
     * @param separator Object to use to split this byte vector
     * @param byteAlign Byte align to use when splitting. in order to split when a pattern is
     *     encountered, the index at which it is found must be divisible by this value.
     * @param max Maximum number of objects to return or 0 to not limit the number. If that number
     *     is reached, the last value will contain the remainder of the file even if it contains
     *     more instances of `separator`.
     * @returns ByteVector[] The split contents of the current instance
     */
    public split(separator: ByteVector, byteAlign: number = 1, max: number = 0): ByteVector[] {
        Guards.truthy(separator, "pattern");
        Guards.uint(byteAlign, "byteAlign");
        Guards.greaterThanInclusive(byteAlign, 1, "byteAlign");
        Guards.uint(max, "max");

        const vectors = [];
        const condition = (o: number): boolean => o !== -1 && (max < 1 || max > vectors.length + 1);
        const increment = (o: number): number => this.offsetFind(separator, o + separator.length, byteAlign);

        let previousOffset = 0;
        let offset = this.offsetFind(separator, 0, byteAlign);
        for (offset; condition(offset); offset = increment(offset)) {
            vectors.push(this.subarray(previousOffset, offset - previousOffset));
            previousOffset = offset + separator.length;
        }

        if (previousOffset < this.length) {
            vectors.push(this.subarray(previousOffset));
        }

        return vectors;
    }

    /**
     * Returns a window over the current instance.
     * @param startIndex Offset into this instance where the comprehension begins
     * @param length Number of elements from the instance to include. If omitted, defaults to the
     *     remainder of the instance
     */
    public subarray(startIndex: number, length: number = this._bytes.length - startIndex): ByteVector {
        Guards.safeUint(startIndex, "startIndex");
        Guards.safeUint(length, "length");
        return new ByteVector(this._bytes.subarray(startIndex, startIndex + length));
    }

    /**
     * Checks whether or not a pattern appears at the beginning of the current instance.
     * @param pattern ByteVector containing the pattern to check for in the current instance.
     * @returns `true` if the pattern was found at the beginning of the current instance, `false`
     *     otherwise.
     */
    public startsWith(pattern: ByteVector): boolean {
        return this.containsAt(pattern, 0);
    }

    /**
     * Returns the current instance as a base64 encoded string.
     */
    public toBase64String(): string {
        return Buffer.from(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength)
            .toString("base64");
    }

    /**
     * Returns the bytes for the instance. Don't use it unless you need to.
     * @internal
     * @deprecated DON'T USE IT UNLESS YOU HAVE NO CHOICE.
     */
    public toByteArray(): Uint8Array {
        return this._bytes;
    }

    /**
     * Returns a writable copy of the bytes represented by this instance.
     * @remarks This is a **copy** of the data. Use sparingly.
     */
    public toByteVector(): ByteVector {
        if (this.isView) {
            const bytes = new Uint8Array(this._bytes);
            return new ByteVector(bytes);
        }

        // This is a concrete instance, return a new instance pointing to the existing bytes
        // This is safe because the existing bytes will be copied on write
        return new ByteVector(this._bytes);
    }

    /**
     * Converts the first eight bytes of the current instance to a double-precision floating-point
     * value.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format).
     * @throws Error If there are less than eight bytes in the current instance.
     * @returns A double value containing the value read from the current instance.
     */
    public toDouble(mostSignificantByteFirst: boolean = true): number {
        // NOTE: This is the behavior from the .NET implementation, due to BitConverter behavior
        if (this.length < 8) {
            throw new Error("Invalid operation: Cannot convert a byte vector of <8 bytes to double");
        }
        const dv = new DataView(this._bytes.buffer, this._bytes.byteOffset, 8);
        return dv.getFloat64(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first four bytes of the current instance to a single-precision floating-point
     * value.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format).
     * @throws Error If there are less than four bytes in the current instance
     * @returns A float value containing the value read from the current instance.
     */
    public toFloat(mostSignificantByteFirst: boolean = true): number {
        const dv = new DataView(this._bytes.buffer, this._bytes.byteOffset, 4);
        return dv.getFloat32(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first four bytes of the current instance to a signed integer. If the current
     * instance is less than four bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns A signed integer value containing the value read from the current instance
     */
    public toInt(mostSignificantByteFirst: boolean = true): number {
        const dv = this.getSizedDataView(4, mostSignificantByteFirst);
        return dv.getInt32(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first eight bytes of the current instance to a signed long. If the current
     * instance is less than eight bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns A signed long value containing the value read from the current instance,
     *          represented as a BigInt due to JavaScript's 52-bit integer limitation.
     */
    public toLong(mostSignificantByteFirst: boolean = true): bigint {
        const dv = this.getSizedDataView(8, mostSignificantByteFirst);
        return dv.getBigInt64(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first two bytes of the current instance to a signed short. If the current
     * instance is less than two bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns A signed short value containing the value read from the current instance
     */
    public toShort(mostSignificantByteFirst: boolean = true): number {
        const dv = this.getSizedDataView(2, mostSignificantByteFirst);
        return dv.getInt16(0, !mostSignificantByteFirst);
    }

    /**
     * Converts a portion of the current instance to a string using a specified encoding
     * @param type Value indicating the encoding to use when converting to a string.
     * @returns string String containing the converted bytes
     */
    public toString(type: StringType): string {
        const bom = type === StringType.UTF16 && this.length > 1
            ? this.subarray(0, 2)
            : undefined;
        return Encoding.getEncoding(type, bom).decode(this._bytes);
    }

    /**
     * Converts the current instance into an array of strings starting at the specified offset and
     * using the specified encoding, assuming the values are `null` separated and limiting it to a
     * specified number of items.
     * @param type A {@link StringType} value indicating the encoding to use when converting
     * @param count Value specifying a limit to the number of strings to create. Once the limit has
     *        been reached, the last string will be filled by the remainder of the data
     * @returns string[] Array of strings containing the converted text.
     */
    public toStrings(type: StringType, count: number = Number.MAX_SAFE_INTEGER): string[] {
        Guards.safeUint(count, "count");

        const delimiter = ByteVector.getTextDelimiter(type);
        let ptr = 0;
        const strings = [];
        while (ptr < this.length && strings.length < count) {
            // Find the next delimiter
            const delimiterPosition = this.offsetFind(delimiter, ptr, delimiter.length);
            if (delimiterPosition < 0) {
                // We didn't find another delimiter, so break out of the loop
                break;
            }

            const str = this.subarray(ptr, delimiterPosition - ptr).toString(type);
            strings.push(str);

            ptr = delimiterPosition + delimiter.length;
        }

        // If there's any remaining bytes, convert them to string
        if (ptr < this.length && strings.length < count) {
            const str = this.subarray(ptr).toString(type);
            strings.push(str);
        }

        return strings;
    }

    /**
     * Converts the first four bytes of the current instance to an unsigned integer. If the current
     * instance is less than four bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns An unsigned integer value containing the value read from the current instance
     */
    public toUint(mostSignificantByteFirst: boolean = true): number {
        const dv = this.getSizedDataView(4, mostSignificantByteFirst);
        return dv.getUint32(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first eight bytes of the current instance to an unsigned long. If the current
     * instance is less than eight bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns An unsigned short value containing the value read from the current instance,
     *          represented as a BigInt due to JavaScript's 32-bit integer limitation
     */
    public toUlong(mostSignificantByteFirst: boolean = true): bigint {
        const dv = this.getSizedDataView(8, mostSignificantByteFirst);
        return dv.getBigUint64(0, !mostSignificantByteFirst);
    }

    /**
     * Converts the first two bytes of the current instance to an unsigned short. If the current
     * instance is less than two bytes, the most significant bytes will be filled with 0x00.
     * @param mostSignificantByteFirst If `true` the most significant byte appears first (big
     *        endian format)
     * @returns An unsigned short value containing the value read from the current instance
     */
    public toUshort(mostSignificantByteFirst: boolean = true): number {
        const dv = this.getSizedDataView(2, mostSignificantByteFirst);
        return dv.getUint16(0, !mostSignificantByteFirst);
    }

    // #endregion

    private getSizedDataView(size: number, mostSignificantByteFirst: boolean): DataView {
        const difference = size - this._bytes.length;
        if (difference <= 0) {
            // Comprehension is at least the required size
            return new DataView(this._bytes.buffer, this._bytes.byteOffset, size);
        }

        // Comprehension is too short. Pad it out.
        const fullSizeArray = new Uint8Array(size);
        fullSizeArray.set(this._bytes, mostSignificantByteFirst ? difference : 0);
        return new DataView(fullSizeArray.buffer);
    }

    private throwIfReadOnly(): void {
        if (this._isReadOnly) {
            throw new Error("Invalid operation: Cannot modify a read-only ByteVector");
        }
    }
}
