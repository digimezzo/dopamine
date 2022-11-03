import itiriri from "itiriri";
import {ByteVector} from "../byteVector";
import {File} from "../file";
import {OggPageHeader} from "./oggPageHeader";
import {Guards} from "../utils";

export default class OggPage {
    private readonly _header: OggPageHeader;
    private readonly _packets: ByteVector[];

    // #region Constructors

    private constructor(header: OggPageHeader) {
        this._header = header;
        this._packets = [];
    }

    /**
     * Constructs and initializes a new instance by reading a raw Ogg page from a specified
     * position in a specified file.
     * @param file File to read the new instance from
     * @param position Offset in the file where the page begins.
     */
    public static fromFile(file: File, position: number): OggPage {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");

        const page = new OggPage(OggPageHeader.fromFile(file, position));
        file.seek(position + page._header.size);

        for (const packetSize of page._header.packetSizes) {
            page._packets.push(file.readBlock(packetSize));
        }

        return page;
    }

    /**
     * Constructs and initializes a new instance with a specified header and list of packets.
     * @param header Header of the page
     * @param packets Packets contained in the page
     */
    public static fromPackets(header: OggPageHeader, packets: ByteVector[]): OggPage {
        Guards.truthy(packets, "packets");
        Guards.truthy(header, "header");

        const page = new OggPage(header);
        page._packets.splice(0, page._packets.length, ... packets);
        page._header.packetSizes = packets.map((p) => p.length);

        return page;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the header of the current instance.
     */
    public get header(): OggPageHeader { return this._header; }

    /**
     * Gets the packets contained in the current instance.
     */
    public get packets(): ByteVector[] { return this._packets.slice(); }

    /**
     * Gets the total size of the current instance as it appears on disk.
     */
    public get size(): number { return this._header.size + this._header.dataSize; }

    // #endregion

    /**
     * Overwrites all page headers in a file starting at a specified position, shifting the page
     * sequence numbers a set amount.
     * @param file File to update
     * @param position Offset into the file to begin updating
     * @param shiftTable Map where the key is the serial number of the stream to update and the
     *     value is the amount to offset the page sequence numbers in the stream
     * @remarks When the number of pages in a stream changes, all subsequent pages in the stream
     *     need to have their page sequence numbers updated in order to remain valid. Additionally,
     *     when the page sequence number changes, the page needs to have its checksum recomputed.
     *     This makes for a costly calculation if large comment data is added.
     * @internal
     */
    public static overwriteSequenceNumbers(file: File, position: number, shiftTable: Map<number, number>): void {
        Guards.truthy(file, "file");
        Guards.truthy(shiftTable, "shiftTable");
        Guards.safeUint(position, "position");

        // Check to see if there are any changes to be made
        if (itiriri(shiftTable.values()).every((e) => e === 0)) {
            return;
        }

        while (position < file.length - OggPageHeader.MINIMUM_SIZE) {
            const header = OggPageHeader.fromFile(file, position);
            const size = header.size + header.dataSize;

            if (shiftTable.has(header.streamSerialNumber) && shiftTable.get(header.streamSerialNumber) !== 0) {
                file.seek(position);
                const pageData = file.readBlock(size);
                const newData = ByteVector.fromUint(
                    header.pageSequenceNumber + shiftTable.get(header.streamSerialNumber),
                    false
                );

                for (let i = 18; i < 22; i++) {
                    pageData.set(i, newData.get(i - 18));
                }
                for (let i = 22; i < 26; i++) {
                    pageData.set(i, 0);
                }

                newData.addByteVector(ByteVector.fromUint(pageData.checksum, false));
                file.seek(position + 18);
                file.writeBlock(newData);
            }

            position += size;
        }
    }

    /**
     * Renders the current instance as a raw Ogg page.
     */
    public render(): ByteVector {
        const data = ByteVector.concatenate(
            this._header.render(),
            ... this._packets
        );

        // Computer the checksum for the Ogg page. THe checksum is taken over the entire page with
        // the 4 bytes reserved for the checksum zeroed and then inserted in bytes 22-25 of the
        // page header.
        const checksum = ByteVector.fromUint(data.checksum, false);
        data.splice(22, 4, checksum);

        return data;
    }
}
