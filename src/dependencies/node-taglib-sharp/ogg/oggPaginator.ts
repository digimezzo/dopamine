import IOggCodec from "./codecs/iOggCodec";
import OggPage from "./oggPage";
import XiphComment from "../xiph/xiphComment";
import {ByteVector} from "../byteVector";
import {OggPageFlags, OggPageHeader} from "./oggPageHeader";

/**
 * This class accepts a sequence of pages for a single Ogg stream, accepts changes, and produces a
 * new sequence of pages to write to disk.
 */
export default class OggPaginator {
    private readonly _packets: ByteVector[] = [];
    private _codec: IOggCodec;
    private _firstPageHeader: OggPageHeader;
    private _pagesRead: number = 0;

    /**
     * Constructs and initializes a new instance for a given codec.
     * @param codec Object to use when processing packets.
     */
    public constructor(codec: IOggCodec) {
        this._codec = codec;
    }

    /**
     * Adds the next page to the current instance.
     * @param page The next page found in the stream
     */
    public addPage(page: OggPage): void {
        this._pagesRead++;

        if (!this._firstPageHeader) {
            this._firstPageHeader = page.header;
        }

        if (page.packets.length === 0) {
            return;
        }

        for (let i = 0; i < page.packets.length; i++) {
            if ((page.header.flags & OggPageFlags.FirstPacketContinued) !== 0 && i === 0 && page.packets.length > 0) {
                this._packets[this._packets.length - 1].addByteVector(page.packets[0]);
            } else {
                this._packets.push(page.packets[i]);
            }
        }
    }

    /**
     * Repaginates the pages passed into the current instance to handle changes made to the Xiph
     * comment.
     */
    public paginate(): {change: number, pages: OggPage[]} {
        // Original .NET comments ---
        // Ogg Pagination: Welcome to sucksville!
        // If you don't understand this, you're not alone.
        // It is confusing as Hell.
        // http://xiph.org/ogg/doc/framing.html

        // node-taglib-sharp comments ---
        // Rather than try to understand this right now, let's just copy it as-is.

        if (this._pagesRead === 0) {
            return {change: 0, pages: []};
        }

        const packets = this._packets.slice();
        const firstHeader = this._firstPageHeader;
        const pages = [];
        let count = this._pagesRead;
        let index = 0;

        if (firstHeader.pageSequenceNumber === 0) {
            pages.push(OggPage.fromPackets(firstHeader, [packets[0]]));
            index++;
            packets.shift();
            count--;
        }

        let lacingPerPage = 0xfc;
        if (count > 0) {
            let totalLacingBytes = 0;
            for (let i = 0; i < packets.length; i++) {
                totalLacingBytes += OggPaginator.getLacingValueLength(packets, i);
            }

            lacingPerPage = Math.min(Math.floor(totalLacingBytes / count + 1), lacingPerPage);
        }

        let pagePackets = [];
        let lacingBytesUsed = 0;
        let firstPacketContinued = false;

        while (packets.length > 0) {
            const packetBytes = OggPaginator.getLacingValueLength(packets, 0);
            const remaining = lacingPerPage - lacingBytesUsed;
            const wholePacket = packetBytes <= remaining;
            if (wholePacket) {
                pagePackets.push(packets.shift());
                lacingBytesUsed += packetBytes;
            } else {
                pagePackets.push(packets[0].subarray(0, remaining * 0xff));
                packets[0] = packets[0].subarray(remaining * 0xff);
                lacingBytesUsed += remaining;
            }

            if (lacingBytesUsed === lacingPerPage) {
                const header = OggPageHeader.fromPageHeader(
                    firstHeader,
                    index,
                    firstPacketContinued ? OggPageFlags.FirstPacketContinued : OggPageFlags.None);
                pages.push(OggPage.fromPackets(header, pagePackets));

                pagePackets = [];
                lacingBytesUsed = 0;
                index++;
                count--;
                firstPacketContinued = !wholePacket;
            }
        }

        if (pagePackets.length > 0) {
            const header = OggPageHeader.fromInfo(
                firstHeader.streamSerialNumber,
                index,
                firstPacketContinued ? OggPageFlags.FirstPacketContinued : OggPageFlags.None);
            pages.push(OggPage.fromPackets(header, pagePackets));
            index++;
            count--;
        }

        return {
            change: -count,
            pages: pages
        };
    }

    /**
     * Writes a Xiph comment in the codec-specific comment packet.
     * @param comment Comment to store in the comment packet.
     */
    public writeComment(comment: XiphComment): void {
        this._codec.writeCommentPacket(this._packets, comment);
    }

    private static getLacingValueLength(packets: ByteVector[], index: number): number {
        const size = packets[index].length;
        return Math.floor(size / 0xff) + ((index + 1 < packets.length || size % 0xff > 0) ? 1 : 0);
    }
}
