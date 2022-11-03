import * as Uuid from "uuid";
import {ByteVector} from "./byteVector";

/**
 * Wrapper around the UUID package to make it easier to handle UUIDs.
 */
export default class UuidWrapper {
    private static readonly GUID_REGEX =
        new RegExp(/([0-9A-F]{8})-?([0-9A-F]{4})-?([0-9A-F]{4})-?([0-9A-F]{4})-?([0-9A-F]{12})/i);

    private readonly _bytes: ByteVector;

    /**
     * Constructs a instance using either the supplied UUID or generating a new, random one.
     * @param source If provided, it is used as the bytes of the instance. If a falsy value is
     *     provided, a new v4 UUID will be generated.
     */
    public constructor(source?: ByteVector | string) {
        // Temporary implementation - it's probably not perfect
        if (!source) {
            // Source wasn't provided, generate a new guid string
            source = Uuid.v4();
        }

        if (typeof(source) === "string") {
            // Source is a string, validate and parse it into bytes
            const match = UuidWrapper.GUID_REGEX.exec(source);
            if (!match) {
                throw new Error(`Could not parse guid ${source}`);
            }

            const int = Number.parseInt(match[1], 16);
            const short1 = Number.parseInt(match[2], 16);
            const short2 = Number.parseInt(match[3], 16);
            const short3 = Number.parseInt(match[4], 16);

            const bytes = new Uint8Array(16);
            const dv = new DataView(bytes.buffer);
            dv.setUint32(0, int, true);
            dv.setUint16(4, short1, true);
            dv.setUint16(6, short2, true);
            dv.setUint16(8, short3, false);

            for (let i = 0; i < 12; i += 2) {
                bytes[10 + i / 2] = Number.parseInt(match[5].substr(i, 2), 16);
            }

            source = ByteVector.fromByteArray(bytes);
        }

        if (source.length !== 16) {
            throw new Error(`${source.length} bytes provided as GUID`);
        }
        this._bytes = source;

        // @TODO: This implementation is commented out b/c the uuid package doesn't appear to
        //    follow RFC byte formatting of a GUID. See https://github.com/uuidjs/uuid/issues/503
        // if (!source) {
        //     const newUuid = Uuid.v4();
        //     this._bytes = new Uint8Array(Uuid.parse(newUuid));
        // } else if (typeof(source) === "string") {
        //     this._bytes = new Uint8Array(Uuid.parse(source));
        // } else {
        //     Uuid.stringify(source);
        //     this._bytes = source;
        // }
    }

    /**
     * Determines whether this instance and another instance represent the same UUID.
     * @param b The other UUID to compare this one to.
     */
    public equals(b: UuidWrapper): boolean {
        if (!b || this._bytes.length !== b._bytes.length) { return false; }
        for (let i = 0; i < this._bytes.length; i++) {
            if (this._bytes.get(i) !== b._bytes.get(i)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets the bytes that make up the UUID.
     */
    public toBytes(): ByteVector { return this._bytes.toByteVector(); }

    /**
     * Gets a string representation of the UUID.
     */
    public toString(): string {
        const bytes1 = this._bytes.subarray(0, 4).toUint(false);
        const bytes2 = this._bytes.subarray(4, 2).toUshort(false);
        const bytes3 = this._bytes.subarray(6, 2).toUshort(false);
        const bytes4 = this._bytes.subarray(8, 2).toUshort(true);
        const bytes5 = this._bytes.subarray(10, 4).toUint(true);
        const bytes6 = this._bytes.subarray(14, 2).toUshort(true);
        return `${bytes1.toString(16)}-` +
               `${bytes2.toString(16)}-` +
               `${bytes3.toString(16)}-` +
               `${bytes4.toString(16)}-` +
               `${bytes5.toString(16).padStart(4, "0")}${bytes6.toString(16).padStart(2, "0")}`;

        // @TODO: This implementation is commented out b/c the uuid package doesn't appear to
        //    follow RFC byte formatting of a GUID. See https://github.com/uuidjs/uuid/issues/503
        // return Uuid.stringify(this._bytes);
    }
}
