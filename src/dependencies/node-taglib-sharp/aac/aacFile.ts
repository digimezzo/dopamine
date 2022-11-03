import AacAudioHeader from "./aacAudioHeader";
import AacFileSettings from "./aacFileSettings";
import SandwichFile from "../sandwich/sandwichFile";
import {CorruptFileError} from "../errors";
import {File, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {Properties} from "../properties";
import {TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * This class extends {@link File} to provide tagging and properties for ADTS AAC audio files.
 * @remarks A {@link Id3v1Tag} and {@link Id3v2Tag} will be added automatically to any file
 *     that doesn't contain one. This change does not affect the file until it is saved and can be
 *     reversed using the following method:
 *     `file.removeTags(file.tagTypes & ~file.tagTypesOnDisk);`
 */
export default class AacFile extends SandwichFile {
    private static readonly DEFAULT_TAG_LOCATION_MAPPING = new Map<TagTypes, () => boolean>([
        [TagTypes.Ape, () => AacFileSettings.preferApeTagAtFileEnd],
        [TagTypes.Id3v1, () => true],
        [TagTypes.Id3v2, () => AacFileSettings.preferId3v2TagAtFileEnd]
    ]);

    /** @inheritDoc */
    public constructor(file: IFileAbstraction|string, propertiesStyle: ReadStyle) {
        super(file, propertiesStyle, AacFile.DEFAULT_TAG_LOCATION_MAPPING, AacFileSettings.defaultTagTypes);
    }

    protected readProperties(readStyle: ReadStyle): Properties {
        // Skip if we're not reading the properties
        if (!NumberUtils.hasFlag(readStyle, ReadStyle.Average)) {
            return undefined;
        }

        // Only search the first 16k before giving up
        const firstHeader = AacAudioHeader.find(this, this.mediaStartPosition, 0x4000);
        if (!firstHeader) {
            throw new CorruptFileError("ADTS audio header not found");
        }

        firstHeader.streamLength = this.mediaEndPosition - this.mediaStartPosition;
        return new Properties(firstHeader.durationMilliseconds, [firstHeader]);
    }
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/aac",
    "audio/aac"
].forEach((mt) => File.addFileType(mt, AacFile));
