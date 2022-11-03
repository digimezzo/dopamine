import CodecFactory from "./codecs/codecFactory";
import IOggCodec from "./codecs/iOggCodec";
import OggPage from "./oggPage";
import {ByteVector} from "../byteVector";
import {Guards} from "../utils";
import {OggPageFlags} from "./oggPageHeader";

/**
 * This class accepts a sequence of pages belonging to a single logical bitstream, processes them,
 * and extracts the tagging and media information.
 */
export default class OggBitStream {
    private readonly _codec: IOggCodec;
    private readonly _firstAbsoluteGranularPosition: number;
    private _previousPacket: ByteVector;

    /**
     * Constructs and initializes a new instance capable of processing a specified page.
     * @param page Page of the stream to be processed by the new instance
     */
    public constructor(page: OggPage) {
        Guards.truthy(page, "page");

        // Assume that the first packet is completely enclosed. This should be sufficient for
        // codec recognition
        this._codec = CodecFactory.getCodec(page.packets[0]);
        this._firstAbsoluteGranularPosition = page.header.absoluteGranularPosition;
    }

    /**
     * Gets the codec object used to interpret the stream represented by the current instance.
     */
    public get codec(): IOggCodec { return this._codec; }

    /**
     * Reads the next logical page in the stream.
     * @param page Next logical page in the stream
     * @returns boolean `true` if the codec has read all the necessary packets in the stream.
     *     `false` otherwise
     */
    public readPage(page: OggPage): boolean {
        Guards.truthy(page, "page");

        const packets = page.packets;
        for (let i = 0; i < packets.length; i++) {
            let packet = packets[i];

            // If we're at the first packet of the page, and we're continuing an old packet,
            // combine the old one with the new one.
            if (i === 0 &&
                (page.header.flags & OggPageFlags.FirstPacketContinued) !== 0 &&
                this._previousPacket
            ) {
                this._previousPacket.addByteVector(packet);
                packet = this._previousPacket;
            }

            this._previousPacket = undefined;

            if (i === packets.length - 1 && !page.header.lastPacketComplete) {
                // We're at the last packet of the page and it's continued on the next page. Store it.
                this._previousPacket = packet;
            } else if (this._codec.readPacket(packet)) {
                // This isn't the last packet, we need to process it.
                return true;
            }
        }

        return false;
    }

    /**
     * Sets the duration of the stream using the first granular position of the stream and the last
     * granular position of the stream.
     * @internal
     */
    public setDuration(lastAbsoluteGranularPosition: number): void {
        Guards.safeUint(lastAbsoluteGranularPosition, "lastAbsoluteGranularPosition");

        this._codec.setDuration(this._firstAbsoluteGranularPosition, lastAbsoluteGranularPosition);
    }
}
