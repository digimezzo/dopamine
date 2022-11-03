import MpegAudioFileSettings from "./mpegAudioFileSettings";
import MpegAudioHeader from "./mpegAudioHeader";
import SandwichFile from "../sandwich/sandwichFile";
import {CorruptFileError} from "../errors";
import {File, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {Properties} from "../properties";
import {TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class extends {@link SandwichFile} to provide tagging and properties support for
 * MPEG-1, MPEG-2, and MPEG-2.5 non-containerized audio files.
 * @remarks A {@link Id3v1Tag} and {@link Id3v2Tag} will be added automatically to any file
 *     that doesn't contain one. This change does not affect the file until it is saved and can be
 *     reversed using the following method:
 *     `file.removeTags(file.tagTypes & ~file.tagTypesOnDisk);`
 */
export default class MpegAudioFile extends SandwichFile {
    private static readonly DEFAULT_TAG_LOCATION_MAPPING = new Map<TagTypes, () => boolean>([
        [TagTypes.Ape, () => MpegAudioFileSettings.preferApeTagAtFileEnd],
        [TagTypes.Id3v1, () => true],
        [TagTypes.Id3v2, () => MpegAudioFileSettings.preferId3v2TagAtFileEnd]
    ]);

    private _firstHeader: MpegAudioHeader;

    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file, propertiesStyle, MpegAudioFile.DEFAULT_TAG_LOCATION_MAPPING, MpegAudioFileSettings.defaultTagTypes);
    }

    protected readProperties(readStyle: ReadStyle): Properties {
        if (!NumberUtils.hasFlag(readStyle, ReadStyle.Average)) {
            return undefined;
        }

        // @TODO: if readStyle is higher than average, scan the entire file to accurately calculate
        //    the duration.

        // Skip if we're not reading the properties
        this._firstHeader = MpegAudioHeader.find(this, this.mediaStartPosition, 0x4000);
        if (!this._firstHeader) {
            throw new CorruptFileError("MPEG audio header not found");
        }

        this._firstHeader.streamLength = this.mediaEndPosition - this.mediaStartPosition;
        return new Properties(this._firstHeader.durationMilliseconds, [this._firstHeader]);
    }
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/mp3",
    "audio/x-mp3",
    "application/x-id3",
    "audio/mpeg",
    "audio/x-mpeg",
    "audio/x-mpeg-3",
    "audio/mpeg3",
    "audio/mp3",
    "taglib/m2a",
    "taglib/mp2",
    "taglib/mp1",
    "audio/x-mp2",
    "audio/x-mp1"
].forEach((mt) => File.addFileType(mt, MpegAudioFile));
