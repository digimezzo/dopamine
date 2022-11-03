import XiphComment from "../../xiph/xiphComment";
import {ByteVector} from "../../byteVector";
import {ICodec} from "../../properties";

export default interface IOggCodec extends ICodec {
    /**
     * Gets the raw Xiph comment data contained in the codec.
     */
    get commentData(): ByteVector;

    /**
     * Reads an Ogg packet that has been encountered in the stream, looking for the comment data.
     * @param packet Packet to read
     * @returns boolean `true` if the codec has read all the necessary packets for the stream and
     *     does not need to be called again,
     */
    readPacket(packet: ByteVector): boolean;

    /**
     * Sets the file offset information necessary for calculating the duration of the stream. Once
     * called, the duration can be accessed by calling {@see ICodec.durationMilliseconds}.
     * @param firstGranularPosition First granular position of the stream
     * @param lastGranularPosition Last granular position of the stream
     */
    setDuration(firstGranularPosition: number, lastGranularPosition: number): void;

    /**
     * Renders and write the provided comment into the provided list of packets.
     * @param packets List of packets the comment packet should be written into.
     * @param comment Xiph comment to write into the list of packets.
     */
    writeCommentPacket(packets: ByteVector[], comment: XiphComment): void;
}
