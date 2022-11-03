import AttachmentFrame from "./attachmentFrame";
import CommentsFrame from "./commentsFrame";
import MusicCdIdentifierFrame from "./musicCdIdentifierFrame";
import PlayCountFrame from "./playCountFrame";
import PopularimeterFrame from "./popularimeterFrame";
import PrivateFrame from "./privateFrame";
import TermsOfUseFrame from "./termsOfUseFrame";
import UniqueFileIdentifierFrame from "./uniqueFileIdentifierFrame";
import UnknownFrame from "./unknownFrame";
import UnsynchronizedLyricsFrame from "./unsynchronizedLyricsFrame";
import {ByteVector} from "../../byteVector";
import {CorruptFileError, NotImplementedError} from "../../errors";
import {EventTimeCodeFrame} from "./eventTimeCodeFrame";
import {File} from "../../file";
import {Frame} from "./frame";
import {Id3v2FrameFlags, Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {RelativeVolumeFrame} from "./relativeVolumeFrame";
import {SynchronizedLyricsFrame} from "./synchronizedLyricsFrame";
import {TextInformationFrame, UserTextInformationFrame} from "./textInformationFrame";
import {UrlLinkFrame, UserUrlLinkFrame} from "./urlLinkFrame";
import {Guards, NumberUtils} from "../../utils";

export type FrameCreator = (data: ByteVector, offset: number, header: Id3v2FrameHeader, version: number) => Frame;

let customFrameCreators: FrameCreator[] = [];

/**
 * Performs the necessary operations to determine and create the correct child classes of
 * {@link Frame} for a given raw ID3v2 frame.
 * By default, this will only load frames contained in the library. To add additional frames to the
 * process, register a frame creator with {@see addFrameCreator}.
 */
export default {
    /**
     * Adds a custom frame creator to try before using standard frame creation methods.
     * Frame creators are used before standard methods so custom checking can be used and new
     * formats can be added. They are executed in reverse order in which they are added.
     * @param creator Frame creator function
     *     * data: ByteVector Raw ID3v2 frame
     *     * offset: number Offset in data at which the frame data begins (should be int)
     *     * header: Id3v2FrameHeader Header for the frame contained in data
     *     * version: number ID3v2 version the raw frame data is stored in (should be byte)
     *     * returns Frame if method was able to match the frame, falsy otherwise
     */
    addFrameCreator: (creator: FrameCreator): void => {
        Guards.truthy(creator, "creator");
        customFrameCreators.unshift(creator);
    },

    /**
     * Removes all custom frame creators
     */
    clearFrameCreators: (): void => {
        customFrameCreators = [];
    },

    /**
     * Creates a {@link Frame} object by reading it from raw ID3v2 frame data.
     * @param data Raw ID3v2 frame
     * @param file File to read the frame from if `data` is falsy
     * @param offset Index into `file` or in `data` if truthy, at which the
     *     frame begins. After reading, the offset where the next frame can be read is returned in
     *     the `offset` property of the returned object
     * @param version ID3v2 version the frame is encoded with. Must be unsigned 8-bit int
     * @param alreadyUnsynced Whether or not the entire tag has already been unsynchronized
     * @returns any Undefined is returned if there are no more frames to read.
     *     Object is returned if a frame was found. Object has the following properties:
     *     * frame: {@link Frame} that was read
     *     * offset: updated offset where the next frame starts
     */
    // @TODO: Split into fromFile and fromData
    createFrame: (
        data: ByteVector,
        file: File,
        offset: number,
        version: number,
        alreadyUnsynced: boolean
    ): {frame: Frame, offset: number} => {
        Guards.uint(offset, "offset");
        Guards.byte(version, "version");

        let position = 0;
        const frameHeaderSize = Id3v2FrameHeader.getSize(version);

        if (!data && !file) {
            throw new Error("Argument exception: data or file must be provided");
        }

        if (!data) {
            file.seek(offset);
            data = file.readBlock(frameHeaderSize);
        } else {
            file = undefined;
            position = offset;
        }

        // If the next data's position is 0, assume that we've hit the padding portion of the frame
        if (data.get(position) === 0) {
            return undefined;
        }

        const header = Id3v2FrameHeader.fromData(data.subarray(position, frameHeaderSize), version);
        const frameStartIndex = offset + frameHeaderSize;
        const frameEndIndex = offset + header.frameSize + frameHeaderSize;
        const frameSize = frameEndIndex - frameStartIndex;

        // Illegal frames are filtered out when creating the frame header

        // Mark the frame as unsynchronized if the entire tag is already unsynchronized
        if (alreadyUnsynced) {
            header.flags &= ~Id3v2FrameFlags.Unsynchronized;
        }

        // TODO: Support compression
        if (NumberUtils.hasFlag(header.flags, Id3v2FrameFlags.Compression)) {
            throw new NotImplementedError("Compression is not supported");
        }

        // TODO: Support encryption
        if (NumberUtils.hasFlag(header.flags, Id3v2FrameFlags.Encryption)) {
            throw new NotImplementedError("Encryption is not supported");
        }

        try {
            // Try to find a custom creator
            for (const creator of customFrameCreators) {
                // @TODO: If we're reading from a file, data will only ever contain the header
                const frame = creator(data, position, header, version);
                if (frame) {
                    return {
                        frame: frame,
                        offset: frameEndIndex
                    };
                }
            }

            // This is where things get necessarily nasty. Here we determine which frame subclass (or
            // if none is found, simply a frame) based on the frame ID. Since there are a lot of
            // possibilities, that means a lot of if statements.

            // Lazy object loading handling
            if (file) {
                // Attached picture (frames 4.14)
                // General encapsulated object (frames 4.15)
                // TODO: Make lazy loading optional
                if (header.frameId === FrameIdentifiers.APIC || header.frameId === FrameIdentifiers.GEOB) {
                    return {
                        frame: AttachmentFrame.fromFile(
                            file.fileAbstraction,
                            header,
                            frameStartIndex,
                            frameSize,
                            version
                        ),
                        offset: frameEndIndex
                    };
                }

                // Read remaining part of the frame for the non lazy Frame
                file.seek(frameStartIndex);
                data = ByteVector.concatenate(
                    data,
                    file.readBlock(frameSize)
                );
            }

            let func: FrameCreator;
            if (header.frameId === FrameIdentifiers.TXXX) {
                // User text identification frame
                func = UserTextInformationFrame.fromOffsetRawData;
            } else if (header.frameId.isTextFrame) {
                // Text identification frame (frames 4.2)
                func = TextInformationFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.UFID) {
                // Unique file identifier (frames 4.1)
                func = UniqueFileIdentifierFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.MCDI) {
                // Music CD identifier (frames 4.5)
                func = MusicCdIdentifierFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.USLT) {
                // Unsynchronized lyrics (frames 4.8)
                func = UnsynchronizedLyricsFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.SYLT) {
                // Synchronized lyrics (frames 4.8)
                func = SynchronizedLyricsFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.COMM) {
                // Comments (frames 4.10)
                func = CommentsFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.RVA2) {
                // Relative volume adjustment (frames 4.11)
                func = RelativeVolumeFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.APIC || header.frameId === FrameIdentifiers.GEOB) {
                // Attached picture (frames 4.14)
                func = AttachmentFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.PCNT) {
                // Play count (frames 4.16)
                func = PlayCountFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.POPM) {
                // Popularimeter (frames 4.17)
                func = PopularimeterFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.USER) {
                // Terms of Use (frames 4.22)
                func = TermsOfUseFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.PRIV) {
                // Private (frames 4.27)
                func = PrivateFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.WXXX) {
                // User URL link
                func = UserUrlLinkFrame.fromOffsetRawData;
            } else if (header.frameId.isUrlFrame) {
                // URL link (frame 4.3.1)
                func = UrlLinkFrame.fromOffsetRawData;
            } else if (header.frameId === FrameIdentifiers.ETCO) {
                // Event timing codes (frames 4.6)
                func = EventTimeCodeFrame.fromOffsetRawData;
            } else {
                // Return unknown
                func = UnknownFrame.fromOffsetRawData;
            }

            return {
                frame: func(data, position, header, version),
                offset: frameEndIndex
            };
        } catch (e: unknown) {
            if (CorruptFileError.errorIs(e) || NotImplementedError.errorIs(e)) {
                throw e;
            }

            // Other exceptions will just mean we ignore the frame
            return {
                frame: undefined,
                offset: frameEndIndex
            };
        }
    }
};
