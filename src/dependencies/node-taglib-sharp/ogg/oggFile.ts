import OggTag from "./oggTag";
import OggBitStream from "./oggBitStream";
import OggPage from "./oggPage";
import OggPaginator from "./oggPaginator";
import XiphComment from "../xiph/xiphComment";
import {ByteVector} from "../byteVector";
import {CorruptFileError} from "../errors";
import {File, FileAccessMode, ReadStyle} from "../file";
import {IFileAbstraction} from "../fileAbstraction";
import {OggPageFlags, OggPageHeader} from "./oggPageHeader";
import {Properties} from "../properties";
import {Tag, TagTypes} from "../tag";
import {NumberUtils} from "../utils";

/**
 * Provides tagging and properties support for Ogg files.
 */
export default class OggFile extends File {

    private readonly _properties: Properties;
    private readonly _tag: OggTag;

    /** @inheritDoc */
    public constructor(file: IFileAbstraction | string, readStyle: ReadStyle) {
        super(file);

        this.mode = FileAccessMode.Read;
        try {
            // Read the file
            const streamsResult = this.readStreams();
            const codecs = [];

            // Read the streams and extract the Xiph comments from them
            const commentMapping = new Map<number, XiphComment>();
            for (const [id, bitStream] of streamsResult.streams.entries()) {
                commentMapping.set(
                    id,
                    XiphComment.fromData(
                        bitStream.codec.commentData,
                        NumberUtils.hasFlag(readStyle, ReadStyle.PictureLazy)
                    )
                );
                codecs.push(bitStream.codec);
            }
            this._tag = new OggTag(commentMapping);

            // Read the properties if requested
            // TODO: Read bitrate more accurately if accurate read style provided
            if ((readStyle & ReadStyle.Average) !== 0) {
                // Find the last page header and use its position to determine the duration of the
                // file.
                const lastPageHeaderOffset = this.rFind(OggPageHeader.HEADER_IDENTIFIER);
                if (lastPageHeaderOffset < 0) {
                    throw new CorruptFileError("Could not find last Ogg page header");
                }

                const lastPageHeader = OggPageHeader.fromFile(this, lastPageHeaderOffset);
                streamsResult.streams.get(lastPageHeader.streamSerialNumber)
                    .setDuration(lastPageHeader.absoluteGranularPosition);
                const duration = streamsResult.streams.get(lastPageHeader.streamSerialNumber)
                    .codec.durationMilliseconds;
                this._properties = new Properties(duration, codecs);
            }

            // NOTE: All known Ogg formats require a comment header. This means an Ogg file will
            //    always have a tag.

        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    // #region Properties

    /** @inheritDoc */
    public get properties(): Properties { return this._properties; }

    /** @inheritDoc */
    public get tag(): Tag { return this._tag; }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public getTag(type: TagTypes): Tag {
        if (type === TagTypes.Xiph) {
            return this._tag.comments[0];
        }

        return undefined;
    }

    /** @inheritDoc */
    public removeTags(types: TagTypes): void {
        if ((types & TagTypes.Xiph) !== 0) {
            this._tag.clear();
        }
    }

    /** @inheritDoc */
    public save(): void {
        this.preSave();

        this.mode = FileAccessMode.Write;
        try {
            // Re-read the pages for the streams
            const pages: OggPage[] = [];
            const streamsResult = this.readStreams(pages);
            const paginators = new Map<number, OggPaginator>();
            const newPages: OggPage[][] = [];
            const shifts = new Map<number, number>();

            // Have the paginators process the pages
            for (const page of pages) {
                const streamSerialNumber = page.header.streamSerialNumber;
                if (!paginators.has(streamSerialNumber)) {
                    paginators.set(
                        streamSerialNumber,
                        new OggPaginator(streamsResult.streams.get(streamSerialNumber).codec)
                    );
                }

                paginators.get(streamSerialNumber).addPage(page);
            }

            // Repaginate the pages
            for (const streamSerialNumber of paginators.keys()) {
                paginators.get(streamSerialNumber).writeComment(this._tag.getComment(streamSerialNumber));
                const paginateResults = paginators.get(streamSerialNumber).paginate();
                newPages.push(paginateResults.pages);
                shifts.set(streamSerialNumber, paginateResults.change);
            }

            // Render the updated pages
            const output = ByteVector.empty();
            let isEmpty;
            do {
                isEmpty = true;
                for (const streamPages of newPages) {
                    if (streamPages.length === 0) {
                        continue;
                    }

                    output.addByteVector(streamPages[0].render());
                    streamPages.shift();

                    if (streamPages.length !== 0) {
                        isEmpty = false;
                    }
                }
            } while (!isEmpty);

            // Write the output to the file
            this.insert(output, 0, streamsResult.end);
            OggPage.overwriteSequenceNumbers(this, output.length, shifts);

            this.tagTypesOnDisk = this.tagTypes;

        } finally {
            this.mode = FileAccessMode.Closed;
        }
    }

    private readStreams(pages?: OggPage[]): {end: number, streams: Map<number, OggBitStream>} {
        const streams = new Map<number, OggBitStream>();
        const activeStreams = [];

        let position = 0;
        do {
            let stream: OggBitStream;
            const page = OggPage.fromFile(this, position);

            if ((page.header.flags & OggPageFlags.FirstPageOfStream) !== 0) {
                stream = new OggBitStream(page);
                streams.set(page.header.streamSerialNumber, stream);
                activeStreams.push(stream);
            }

            if (!stream) {
                stream = streams.get(page.header.streamSerialNumber);
            }

            const streamIndex = activeStreams.indexOf(stream);
            if (streamIndex >= 0 && stream.readPage(page)) {
                activeStreams.splice(streamIndex, 1);
            }

            if (pages) {
                pages.push(page);
            }

            position += page.size;
        } while (activeStreams.length > 0);

        return {
            end: position,
            streams: streams
        };
    }

    // #endregion
}

// /////////////////////////////////////////////////////////////////////////
// Register the file type
[
    "taglib/ogg",
    "taglib/oga",
    "taglib/ogv",
    "taglib/opus",
    "application/ogg",
    "application/x-ogg",
    "audio/vorbis",
    "audio/x-vorbis",
    "audio/x-vorbis+ogg",
    "audio/ogg",
    "audio/x-ogg",
    "video/ogg",
    "video/x-ogm+ogg",
    "video/x-theora+ogg",
    "video/x-theora",
    "audio/opus",
    "audio/x-opus",
    "audio/x-opus+ogg"
].forEach((mt) => File.addFileType(mt, OggFile));
