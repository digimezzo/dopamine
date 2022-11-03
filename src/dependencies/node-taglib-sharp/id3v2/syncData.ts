import {ByteVector} from "../byteVector";
import {Guards, NumberUtils} from "../utils";

/**
 * Support for encoding and decoding unsynchronized data and numbers.
 * @remarks Unsynchronization is designed so that portions of the tag won't be misinterpreted
 *     as MPEG audio stream headers by removing the possibility of the sync bytes occurring in the
 *     tag.
 */
export default {
    /**
     * Encodes a unsigned int as synchronized integer data.
     * @param value Number to encode. Must be an safe, positive integer
     * @returns ByteVector The encoded number
     * @throws Error if `value` is greater than 268435456
     */
    fromUint: (value: number): ByteVector => {
        Guards.uint(value, "value");
        if ((value >> 28) !== 0) {
            throw new Error("Argument out of range: value must be less than 268435456");
        }

        const out = ByteVector.fromSize(4, 0);
        for (let i = 0; i < 4; i++) {
            out.set(i, NumberUtils.uintAnd(NumberUtils.uintRShift(value, (3 - i) * 7), 0x7F));
        }

        return out;
    },

    /**
     * Resynchronizes a {@link ByteVector} object by removing the added bytes.
     * @remarks In some cases (as determined by header flags), the metadata contains MPEG stream
     *     synchronization bytes that were "unsynchronized" by inserting empty bytes in between
     *     them. This method removes those bytes such that the original metadata bytes are
     *     returned.
     * @param data Object to resynchronize
     */
    resyncByteVector: (data: ByteVector): ByteVector => {
        Guards.truthy(data, "data");

        let leadingPtr = 0;
        let trailingPtr = 0;
        const outputList: ByteVector[] = [];
        while (leadingPtr < data.length - 1) {
            const currentByte = data.get(leadingPtr);
            const nextByte = data.get(leadingPtr + 1);
            if (currentByte === 0xFF && nextByte === 0x00) {
                // Put the segment into the list
                const length = leadingPtr - trailingPtr + 1;
                outputList.push(data.subarray(trailingPtr, length));

                leadingPtr += 2;
                trailingPtr = leadingPtr;
            } else {
                leadingPtr++;
            }
        }

        if (trailingPtr < data.length) {
            // Put the remaining segment onto the list
            outputList.push(data.subarray(trailingPtr, data.length - trailingPtr));
        }

        return ByteVector.concatenate(... outputList);
    },

    /**
     * Decodes synchronized integer data into an unsigned integer.
     * @param data ByteVector containing the number to decode. Only the first 4 bytes of this value
     *     will be used
     * @returns number Value containing the decoded number
     */
    toUint: (data: ByteVector): number => {
        Guards.notNullOrUndefined(data, "data");

        const last = data.length > 4 ? 3 : data.length - 1;

        let sum = 0;
        for (let i = 0; i <= last; i++) {
            sum |= (data.get(i) & 0x7F) << ((last - i) * 7);
        }

        return sum;
    },

    /**
     * Unsynchronizes a {@link ByteVector} object by inserting empty bytes where necessary.
     * @remarks This is necessary in some cases in order for the MPEG parser to ignore bytes used
     *     for MPEG stream synchronization that occur accidentally in metadata from being treated
     *     as synchronization bytes.
     * @param data Object to unsynchronize
     */
    unsyncByteVector: (data: ByteVector): ByteVector => {
        Guards.notNullOrUndefined(data, "data");

        // Inserting bytes is expensive. So, lets build a list of segments, add the 0x0 bytes and
        // then concatenate them together at the end.
        let leadingPtr = 0;
        let trailingPtr = 0;
        const outputList: Array<number|ByteVector> = [];
        while (leadingPtr < data.length - 1) {
            const currentByte = data.get(leadingPtr);
            const nextByte = data.get(leadingPtr + 1);
            if (currentByte === 0xFF && (nextByte === 0x00 || (nextByte & 0xE0) === 0xE0)) {
                // Put the segment and an empty byte on the list
                const length = leadingPtr - trailingPtr + 1;
                outputList.push(data.subarray(trailingPtr, length));
                outputList.push(0x00);

                leadingPtr++;
                trailingPtr = leadingPtr;
            } else {
                leadingPtr++;
            }
        }

        if (trailingPtr < data.length) {
            // Put the remaining segment onto the list
            outputList.push(data.subarray(trailingPtr, data.length - trailingPtr));
        }

        return ByteVector.concatenate(... outputList);
    }
};
