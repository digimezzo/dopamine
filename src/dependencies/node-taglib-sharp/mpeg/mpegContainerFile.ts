import MpegContainerFileSettings from "./mpegContainerFileSettings";
import MpegAudioHeader from "./mpegAudioHeader";
import MpegVideoHeader from "./mpegVideoHeader";
import SandwichFile from "../sandwich/sandwichFile";
import {ByteVector} from "../byteVector";
import {CorruptFileError, UnsupportedFormatError} from "../errors";
import {File, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {MpegVersion} from "./mpegEnums";
import {Properties} from "../properties";
import {TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * Indicates the type of marker found in an MPEG file.
 */
enum MpegFileMarker {
    /**
     * An invalid marker.
     */
    Corrupt = -1,

    /**
     * A zero value marker.
     */
    Zero = 0,

    /**
     * A marker indicating a system sync packet.
     */
    SystemSyncPacket = 0xBA,

    /**
     * A marker indicating a video sync packet.
     */
    VideoSyncPacket = 0xB3,

    /**
     * A marker indicating a system packet.
     */
    SystemPacket = 0xBB,

    /**
     * A marker indicating a padding packet.
     */
    PaddingPacket = 0xBE,

    /**
     * A marker indicating an audio packet.
     */
    AudioPacket = 0xC0,

    /**
     * A marker indicating a video packet.
     */
    VideoPacket = 0xE0,

    /**
     * A marker indicating the end of a stream.
     */
    EndOfStream = 0xB9
}

/**
 * This class extends {@link SandwichFile} to provide tagging and properties support for
 * MPEG-1, MPEG-2, and MPEG-2.5 containerized video files.
 * @remarks A {@link Id3v1Tag} and {@link Id3v2Tag} will be added automatically to any file that
 *     does not contain one. This change does not affect the file until it is saved and can be
 *     reversed using the following method:
 *     `file.removeTags(file.tagTypes & ~file.tagTypesOnDisk);`
 */
export default class MpegContainerFile extends SandwichFile {
    private static readonly DEFAULT_TAG_LOCATION_MAPPING = new Map<TagTypes, () => boolean>([
        [TagTypes.Ape, () => true],
        [TagTypes.Id3v1, () => true],
        [TagTypes.Id3v2, () => true]
    ]);
    private static readonly MARKER_START = ByteVector.fromByteArray([0, 0, 1]);

    private _audioFound = false;
    private _audioHeader: MpegAudioHeader;
    private _endTime: number;
    private _startTime: number | undefined;
    private _version: MpegVersion;
    private _videoFound = false;
    private _videoHeader: MpegVideoHeader;

    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(
            file,
            propertiesStyle,
            MpegContainerFile.DEFAULT_TAG_LOCATION_MAPPING,
            MpegContainerFileSettings.defaultTagTypes
        );
    }

    /** @inheritDoc */
    protected readProperties(readStyle: ReadStyle): Properties {
        // Skip processing if we aren't supposed to read the properties
        if (!NumberUtils.hasFlag(readStyle, ReadStyle.Average)) {
            return;
        }

        // Read the audio and video properties
        const firstSyncPosition = this.findNextMarkerPosition(this.mediaStartPosition, MpegFileMarker.SystemSyncPacket);
        this.readSystemFile(firstSyncPosition);

        const codecs = [];
        if (this._videoHeader) { codecs.push(this._videoHeader); }
        if (this._audioHeader) { codecs.push(this._audioHeader); }

        // @TODO: Can we omit calculating duration via start/end timestamps if we have audio with
        //     a valid duration?
        // Calculate duration of the file
        const lastSyncPosition = this.rFindMarkerPosition(
            this.length - this.mediaEndPosition,
            MpegFileMarker.SystemSyncPacket
        );
        this._endTime = this.readTimestamp(lastSyncPosition + 4);
        const durationMilliseconds = this._startTime === undefined
            ? (this._audioHeader ? this._audioHeader.durationMilliseconds : 0)
            : (this._endTime - this._startTime) * 1000;

        return new Properties(durationMilliseconds, codecs);
    }

    // #region Private Methods

    private findFirstMarker(position: number): {marker: MpegFileMarker, position: number} {
        position = this.find(MpegContainerFile.MARKER_START, position);
        if (position < 0) {
            throw new CorruptFileError("Marker not found");
        }

        return {
            marker: this.getMarker(position),
            position: position
        };
    }

    private findNextMarkerPosition(position: number, marker: MpegFileMarker): number {
        const packet = ByteVector.concatenate(
            MpegContainerFile.MARKER_START,
            marker
        );
        position = this.find(packet, position);

        if (position < 0) {
            throw new CorruptFileError("Marker not found");
        }

        return position;
    }

    private getMarker(position: number): MpegFileMarker {
        this.seek(position);
        const identifier = this.readBlock(4);

        if (identifier.length === 4 && identifier.startsWith(MpegContainerFile.MARKER_START)) {
            return identifier.get(3);
        }

        throw new CorruptFileError(`Invalid marker at position ${position}`);
    }

    private readAudioPacket(position: number): number {
        this.seek(position + 4);
        const headerBytes = this.readBlock(21);
        const length = headerBytes.subarray(0, 2).toUshort();
        const returnValue = position + length;

        if (this._audioFound) {
            return returnValue;
        }

        // There is a maximum of 16 stuffing bytes, read to the PTS/DTS flags
        const packetHeaderBytes = headerBytes.subarray(2, 19);
        let i = 0;
        while (i < packetHeaderBytes.length && packetHeaderBytes.get(i) === 0xFF) {
            // Byte is a stuffing byte
            i++;
        }

        if (NumberUtils.hasFlag(packetHeaderBytes.get(i), 0x40 )) {
            // STD buffer size is unexpected for audio packets, but whatever
            i++;
        }

        // Decode the PTS/DTS flags
        const timestampFlags = packetHeaderBytes.get(i);
        const dataOffset = 4 + 2 + i                 // Packet marker + packet length + stuffing bytes/STD buffer size
            + (NumberUtils.hasFlag(timestampFlags, 0x20) ? 4 : 0)  // Presentation timestamp
            + (NumberUtils.hasFlag(timestampFlags, 0x10) ? 4 : 0); // Decode timestamp

        // Decode the MPEG audio header
        this._audioHeader = MpegAudioHeader.find(this, position + dataOffset, length - 9);
        this._audioFound = !!this._audioHeader;

        return position + length;
    }

    private readSystemFile(position: number): void {
        const sanityLimit = 100;

        for (
            let i = 0;
            i < sanityLimit && (this._startTime === undefined || !this._audioFound || !this._videoFound);
            i++
        ) {
            const markerResult = this.findFirstMarker(position);
            position = markerResult.position;

            switch (markerResult.marker) {
                case MpegFileMarker.SystemSyncPacket:
                    position = this.readSystemSyncPacket(position);
                    break;
                case MpegFileMarker.SystemPacket:
                case MpegFileMarker.PaddingPacket:
                    this.seek(position + 4);
                    position += this.readBlock(2).toUshort() + 6;
                    break;
                case MpegFileMarker.VideoPacket:
                    position = this.readVideoPacket(position);
                    break;
                case MpegFileMarker.AudioPacket:
                    position = this.readAudioPacket(position);
                    break;
                case MpegFileMarker.EndOfStream:
                    return;
                default:
                    position += 4;
                    break;
            }
        }
    }

    private readSystemSyncPacket(position: number): number {
        let packetSize = 0;
        this.seek(position + 4);

        const versionInfo = this.readBlock(1).get(0);
        if (NumberUtils.uintAnd(versionInfo, 0xF0) === 0x20) {
            this._version = MpegVersion.Version1;
            packetSize = 12;
        } else if (NumberUtils.uintAnd(versionInfo, 0xC0) === 0x40) {
            this._version = MpegVersion.Version2;
            this.seek(position + 13);
            packetSize = 14 + NumberUtils.uintAnd(this.readBlock(1).get(0), 0x07);
        } else {
            throw new UnsupportedFormatError("Unknown MPEG version");
        }

        if (this._startTime === undefined) {
            this._startTime = this.readTimestamp(position + 4);
        }

        return position + packetSize;
    }

    private readTimestamp(position: number): number {
        let high: number;
        let low: number;

        this.seek(position);
        if (this._version === MpegVersion.Version1) {
            const data = this.readBlock(5);
            high = NumberUtils.uintAnd(NumberUtils.uintRShift(data.get(0), 3), 0x01);
            low = NumberUtils.uintOr(
                NumberUtils.uintLShift(NumberUtils.uintAnd(NumberUtils.uintRShift(data.get(0), 1), 0x03), 30),
                NumberUtils.uintLShift(data.get(1), 22),
                NumberUtils.uintLShift(NumberUtils.uintRShift(data.get(2), 1), 15),
                NumberUtils.uintLShift(data.get(3), 7),
                NumberUtils.uintRShift(data.get(4), 1)
            );
        } else {
            const data = this.readBlock(6);
            high = NumberUtils.uintRShift(NumberUtils.uintAnd(data.get(0), 0x20), 5);
            low = NumberUtils.uintOr(
                NumberUtils.uintLShift(NumberUtils.uintAnd(data.get(0), 0x03), 28),
                NumberUtils.uintLShift(data.get(1), 20),
                NumberUtils.uintLShift(NumberUtils.uintAnd(data.get(2), 0xF8), 12),
                NumberUtils.uintLShift(NumberUtils.uintAnd(data.get(2), 0x03), 13),
                NumberUtils.uintLShift(data.get(3), 5),
                NumberUtils.uintRShift(data.get(4), 3)
            );
        }

        return (high * 0x10000 * 0x10000 + low) / 90000;
    }

    private readVideoPacket(position: number): number {
        this.seek(position + 4);
        const length = this.readBlock(2).toUshort();
        let offset = position + 6;

        while (!this._videoFound && offset < position + length) {
            const markerResult = this.findFirstMarker(offset);
            offset = markerResult.position;
            if (markerResult.marker === MpegFileMarker.VideoSyncPacket) {
                this._videoHeader = new MpegVideoHeader(this, offset + 4);
                this._videoFound = true;
            } else {
                // Advance the offset by 6 bytes, so the next iteration of the loop won't find the
                // same marker and get stuck. 6 bytes because findFirstMarker is a generic find
                // that found get both PES packets and stream packets, the smallest possible PES
                // packet with a size of 0 would be 6 bytes.
                offset += 6;
            }
        }

        return position + length;
    }

    private rFindMarkerPosition(position: number, marker: MpegFileMarker): number {
        const packet = ByteVector.concatenate(
            MpegContainerFile.MARKER_START,
            marker
        );
        position = this.rFind(packet, position);

        if (position < 0) {
            throw new CorruptFileError("Marker not found");
        }

        return position;
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/mpg",
    "taglib/mpeg",
    "taglib/mpe",
    "taglib/mpv2",
    "taglib/m2v",
    "video/x-mpg",
    "video/mpeg"
].forEach((mt) => File.addFileType(mt, MpegContainerFile));
