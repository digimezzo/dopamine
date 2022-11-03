import CombinedTag from "../combinedTag";
import {Tag, TagTypes} from "../tag";
import DivxTag from "./divxTag";
import Id3v2Tag from "../id3v2/id3v2Tag";
import InfoTag from "./infoTag";
import MovieIdTag from "./movieIdTag";
import {Id3v2TagHeaderFlags} from "..";
import {UnsupportedFormatError} from "../errors";

export default class RiffTags extends CombinedTag {
    public static readonly SUPPORTED_TAG_TYPES = TagTypes.DivX | TagTypes.Id3v2 | TagTypes.RiffInfo | TagTypes.MovieId;

    public constructor(divxTag: DivxTag, id3v2Tag: Id3v2Tag, infoTag: InfoTag, movieIdTag: MovieIdTag) {
        super(RiffTags.SUPPORTED_TAG_TYPES, true);

        // NOTE: We're adding ID3 first because it is the most flexible tagging format. Divx is last
        //     because it is the least flexible tagging format.
        this.addTag(id3v2Tag);
        this.addTag(infoTag);
        this.addTag(movieIdTag);
        this.addTag(divxTag);
    }

    /** @inheritDoc */
    public createTag(tagType: TagTypes, copy: boolean): Tag {
        this.validateTagCreation(tagType);

        // Create the desired tag
        let tag: Tag;
        switch (tagType) {
            case TagTypes.DivX:
                tag = DivxTag.fromEmpty();
                break;
            case TagTypes.Id3v2:
                const id3v2Tag = Id3v2Tag.fromEmpty();
                // @TODO: have default version be configurable
                id3v2Tag.version = 4;
                id3v2Tag.flags |= Id3v2TagHeaderFlags.FooterPresent;
                tag = id3v2Tag;
                break;
            case TagTypes.RiffInfo:
                tag = InfoTag.fromEmpty();
                break;
            case TagTypes.MovieId:
                tag = MovieIdTag.fromEmpty();
                break;
            default:
                throw new UnsupportedFormatError(`Specified tag type ${tagType} is invalid`);
        }


        // Copy the contents of this tag to the new tag if desired
        if (copy) {
            this.copyTo(tag, true);
        }

        this.addTag(tag);
        return tag;
    }
}
