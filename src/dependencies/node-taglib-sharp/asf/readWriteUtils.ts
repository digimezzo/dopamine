import UuidWrapper from "../uuidWrapper";
import {ByteVector, StringType} from "../byteVector";
import {File} from "../file";

/**
 * Utilities for reading and writing ASF data.
 * @internal
 */
export default {
    /**
     * Reads a 4-byte double word from the current instance.
     * @param file File to read the double word from
     */
    readDWord: (file: File): number => {
        return file.readBlock(4).toUint(false);
    },

    /**
     * Reads a 16-byte GUID from the current instance.
     * @param file File to read the guid from
     */
    readGuid: (file: File): UuidWrapper => {
        return new UuidWrapper(file.readBlock(16));
    },

    /**
     * Reads an 8-byte quad word from the current instance.
     * @param file File to read the quad word from
     */
    readQWord: (file: File): bigint => {
        return file.readBlock(8).toLong(false);
    },

    /**
     * Reads a UTF-16LE string of specified length in bytes from the current instance. If null
     * byte is found before the end of specified end of the string, the string will be shortened
     * at the null byte.
     * @param length Length in bytes to read as the string
     * @param file File to read unicode from
     */
    readUnicode: (file: File, length: number): string => {
        const string = file.readBlock(length).toString(StringType.UTF16LE);
        const nullIndex = string.indexOf("\0");
        return nullIndex >= 0 ? string.substring(0, nullIndex) : string;
    },

    /**
     * Reads a 2-byte word from the current instance.
     * @param file File to read the word from
     */
    readWord: (file: File): number => {
        return file.readBlock(2).toUshort(false);
    },

    /**
     * Renders a 4-byte double word.
     * @param value Double word to render
     */
    renderDWord: (value: number): ByteVector => {
        return ByteVector.fromUint(value, false);
    },

    /**
     * Renders an 8-byte quad word.
     * @param value Quad word to render
     */
    renderQWord: (value: bigint): ByteVector => {
        return ByteVector.fromUlong(value, false);
    },

    /**
     * Renders a unicode string.
     * @param value Text to render
     */
    renderUnicode: (value: string): ByteVector => {
        return ByteVector.concatenate(
            ByteVector.fromString(value, StringType.UTF16LE),
            ByteVector.fromUshort(0, false)
        );
    },

    /**
     * Renders a 2-byte word.
     * @param value Word to render
     */
    renderWord: (value: number): ByteVector => {
        return ByteVector.fromUshort(value, false);
    },
};
