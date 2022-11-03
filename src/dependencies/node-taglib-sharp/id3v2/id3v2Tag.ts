import * as DateFormat from "dateformat";
import itiriri from "itiriri";

import AttachmentFrame from "./frames/attachmentFrame";
import CommentsFrame from "./frames/commentsFrame";
import FrameFactory from "./frames/frameFactory";
import Id3v2ExtendedHeader from "./id3v2ExtendedHeader";
import Id3v2TagFooter from "./id3v2TagFooter";
import Id3v2Settings from "./id3v2Settings";
import SyncData from "./syncData";
import UniqueFileIdentifierFrame from "./frames/uniqueFileIdentifierFrame";
import UnsynchronizedLyricsFrame from "./frames/unsynchronizedLyricsFrame";
import {ByteVector, StringType} from "../byteVector";
import {CorruptFileError, NotImplementedError, NotSupportedError} from "../errors";
import {File, ReadStyle} from "../file";
import {Frame, FrameClassType} from "./frames/frame";
import {FrameIdentifier, FrameIdentifiers} from "./frameIdentifiers";
import {Id3v2FrameFlags} from "./frames/frameHeader";
import {Id3v2TagHeader, Id3v2TagHeaderFlags} from "./id3v2TagHeader";
import {IPicture} from "../picture";
import {Tag, TagTypes} from "../tag";
import {TextInformationFrame, UserTextInformationFrame} from "./frames/textInformationFrame";
import {UrlLinkFrame} from "./frames/urlLinkFrame";
import {Guards} from "../utils";

export default class Id3v2Tag extends Tag {
    private static _language: string = undefined;       // @TODO: Use the os-locale module to supply a
                                                        // lazily loaded "default" locale

    private _extendedHeader: Id3v2ExtendedHeader;
    private _frameList: Frame[] = [];
    private _header: Id3v2TagHeader;
    private _performersRole: string[];

    // #region Constructors

    /**
     * Constructs an empty ID3v2 tag
     */
    private constructor() {
        super();
    }

    public static fromEmpty(): Id3v2Tag {
        const tag = new Id3v2Tag();
        tag._header = new Id3v2TagHeader();
        return tag;
    }

    /**
     * Constructs and initializes a new Tag by reading the contents from a specified
     * {@link ByteVector} object.
     * @param data Tag data to read into a tag object
     * @returns Id3v2Tag Tag with the data from the byte vector read into it
     */
    public static fromData(data: ByteVector): Id3v2Tag {
        Guards.truthy(data, "data");
        if (data.length < Id3v2Settings.headerSize) {
            throw new CorruptFileError("Provided data does not contain enough bytes for an ID3v2 tag header");
        }

        const tag = new Id3v2Tag();
        tag._header = Id3v2TagHeader.fromData(data);

        // If the tag size is 0, then this is an invalid tag. Tags must contain at least one frame
        if (tag._header.tagSize === 0) {
            return tag;
        }

        if (data.length - Id3v2Settings.headerSize < tag._header.tagSize) {
            throw new CorruptFileError("Provided data does not enough tag data");
        }

        tag.parse(data.subarray(Id3v2Settings.headerSize, tag._header.tagSize), undefined, 0, ReadStyle.None);
        return tag;
    }

    /**
     * Constructs and initializes a new Tag by reading the beginning of the tag.
     * @remarks This method is the most flexible way of reading ID3v2 tags.
     * @param file File from which the contents of the new instance is to be read
     * @param position Offset into the file where the tag begins
     * @param style How the data is to be read into the current instance
     * @returns Id3v2Tag Tag with the data from the file read into it
     */
    public static fromFileStart(file: File, position: number, style: ReadStyle): Id3v2Tag {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (position > file.length - Id3v2Settings.headerSize) {
            throw new Error("Argument out of range: position must be within size of the file");
        }

        const tag = new Id3v2Tag();
        tag.readFromStart(file, position, style);
        return tag;
    }

    /**
     * Constructs and initializes a new Tag by reading the end of the tag first.
     * @remarks This method should only be used if reading tags at the end of a file. Only ID3v2.4
     *     tags support a footer, which is required to use this method.
     * @param file File from which the contents of the new instance is to be read
     * @param position Offset into the file where the tag ends
     * @param style How the data is to be read into the current instance
     */
    public static fromFileEnd(file: File, position: number, style: ReadStyle): Id3v2Tag {
        Guards.truthy(file, "file");
        Guards.safeUint(position, "position");
        if (position > file.length) {
            throw new Error("Argument out of range: position must be within size of the file");
        }

        const tag = new Id3v2Tag();
        tag.readFromEnd(file, position, style);
        return tag;
    }

    // #endregion

    // #region Properties

    /**
     * Gets the ISO-639-2 language code to use when searching for and storing language specific
     * values.
     */
    public static get language(): string { return Id3v2Tag._language; }
    /**
     * Gets the ISO-639-2 language code to use when searching for and storing language specific
     * values.
     * @param value ISO-639-2 language code to use. If the language is unknown `"   "` is the
     *     appropriate filler
     */
    public static set language(value: string) {
        Id3v2Tag._language = !value || value.length < 3
            ? "   "
            : value.substr(0, 3);
    }

    /**
     * Gets the header flags applied to the current instance.
     */
    public get flags(): Id3v2TagHeaderFlags { return this._header.flags; }
    /**
     * Sets the header flags applied to the current instance
     * @param value Bitwise combined {@link Id3v2TagHeaderFlags} value containing flags applied to the
     *     current instance.
     */
    public set flags(value: Id3v2TagHeaderFlags) { this._header.flags = value; }

    /**
     * Gets all frames contained in the current instance.
     */
    public get frames(): Frame[] { return this._frameList; }

    /**
     * @inheritDoc
     * @remarks This property is implemented using the TCMP Text Information Frame to provide
     * support for a feature of the Apple iPod and iTunes products (ie, this is a non-standard
     * field).
     */
    public get isCompilation(): boolean {
        const val = this.getTextAsString(FrameIdentifiers.TCMP);
        return !!val && val !== "0";
    }
    /**
     * @inheritDoc
     * @remarks This property is implemented using the TCMP Text Information Frame to provide
     * support for a feature of the Apple iPod and iTunes products (ie, this is a non-standard
     * field).
     * @param value Whether or not the album described by the current instance is a compilation
     */
    public set isCompilation(value: boolean) {
        this.setTextFrame(FrameIdentifiers.TCMP, value ? "1" : undefined);
    }

    /**
     * Gets the ID3v2 version for the current instance.
     */
    public get version(): number {
        return this._header.majorVersion;
    }
    /**
     * Sets the ID3v2 version for the current instance.
     * @param value ID3v2 version for the current instance. Must be 2, 3, or 4.
     */
    public set version(value: number) {
        const originalVersion = this._header.majorVersion;
        this._header.majorVersion = value;

        // Migrate any incompatible frames that have direct migrations
        if (value === 4 && (originalVersion === 2 || originalVersion === 3)) {
            // * TYER, etc -> TDRC
            const tyerFrames = this.getFramesByIdentifier<TextInformationFrame>(
                FrameClassType.TextInformationFrame,
                FrameIdentifiers.TYER
            );
            const tdatFrames = this.getFramesByIdentifier<TextInformationFrame>(
                FrameClassType.TextInformationFrame,
                FrameIdentifiers.TDAT
            );
            const timeFrames = this.getFramesByIdentifier<TextInformationFrame>(
                FrameClassType.TextInformationFrame,
                FrameIdentifiers.TIME
            );
            if (tyerFrames.length > 0) {
                this.removeFrames(FrameIdentifiers.TYER);
                this.removeFrames(FrameIdentifiers.TDAT);
                this.removeFrames(FrameIdentifiers.TIME);

                let tdrcText = tyerFrames[0].text[0];
                if (tdatFrames.length > 0) {
                    const tdatText = tdatFrames[0].text[0];
                    tdrcText += `-${tdatText.substr(0, 2)}-${tdatText.substr(2, 2)}`;
                    if (timeFrames.length > 0) {
                        const timeText = timeFrames[0].text[0];
                        tdrcText += `T${timeText}`;
                    }
                }

                this.setTextFrame(FrameIdentifiers.TDRC, tdrcText);
            }
        } else if (originalVersion === 4 && (value === 2 || value === 3)) {
            // * TDRC -> TYER, etc
            const tdrcFrames = this.getFramesByIdentifier<TextInformationFrame>(
                FrameClassType.TextInformationFrame,
                FrameIdentifiers.TDRC
            );
            if (tdrcFrames.length > 0) {
                const tdrcText = tdrcFrames[0].text[0];
                this.removeFrames(FrameIdentifiers.TDRC);
                this.setTextFrame(FrameIdentifiers.TYER, tdrcText.substr(0, 4));

                if (tdrcText.length >= 10) {
                    this.setTextFrame(FrameIdentifiers.TDAT, tdrcText.substr(6, 5).replace("-", ""));
                }

                if (tdrcText.length === 19) {
                    this.setTextFrame(FrameIdentifiers.TIME, tdrcText.substr(11, 8));
                }
            }
        }
    }

    // #region Tag Implementations

    /** @inheritDoc */
    public get tagTypes(): TagTypes { return TagTypes.Id3v2; }

    /** @inheritDoc */
    public get sizeOnDisk(): number { return this._header.completeTagSize; }

    /** @inheritDoc via TIT2 frame */
    public get title(): string { return this.getTextAsString(FrameIdentifiers.TIT2); }
    /** @inheritDoc via TIT2 frame */
    public set title(value: string) { this.setTextFrame(FrameIdentifiers.TIT2, value); }

    /** @inheritDoc via TSOT frame */
    get titleSort(): string { return this.getTextAsString(FrameIdentifiers.TSOT); }
    /** @inheritDoc via TSOT frame */
    set titleSort(value: string) { this.setTextFrame(FrameIdentifiers.TSOT, value); }

    /** @inheritDoc via TIT3 frame */
    get subtitle(): string { return this.getTextAsString(FrameIdentifiers.TIT3); }
    /** @inheritDoc via TIT3 frame */
    set subtitle(value: string) { this.setTextFrame(FrameIdentifiers.TIT3, value); }

    /** @inheritDoc via user text frame "description" */
    get description(): string { return this.getUserTextAsString("Description"); }
    /** @inheritDoc via user text frame "description" */
    set description(value: string) { this.setUserTextAsString("Description", value); }

    /** @inheritDoc via TPE1 frame */
    get performers(): string[] { return this.getTextAsArray(FrameIdentifiers.TPE1); }
    /** @inheritDoc via TPE1 frame */
    set performers(value: string[]) {
        this.setTextFrame(FrameIdentifiers.TPE1, ...value);

        // Reset the performer roles
        this._performersRole = [];
    }

    /** @inheritDoc via TSOP frame */
    get performersSort(): string[] { return this.getTextAsArray(FrameIdentifiers.TSOP); }
    /** @inheritDoc via TSOP frame */
    set performersSort(value: string[]) { this.setTextFrame(FrameIdentifiers.TSOP, ...value); }

    /** @inheritDoc via TMCL frame */
    get performersRole(): string[] {
        // Use the temporary storage if it exists
        if (this._performersRole !== undefined && this._performersRole.length > 0) {
            return this._performersRole;
        }

        // If there aren't any performers, just return a blank list
        if (this.performers === undefined || this.performers.length === 0) {
            return [];
        }

        // We're going to basically flip the format of the TMCL frame.
        // TMCL frames look like:
        //   [ "instrument", "artist1,artist2", ... ]
        // We want:
        //   { "artist1": ["instrument", ...], "artist2": ["instrument", ...], ...}
        const frameData = this.getTextAsArray(FrameIdentifiers.TMCL);

        // Initialize the map with all the known performers
        const map = this.performers.reduce((accum: Map<string, string[]>, performer: string) => {
            accum.set(performer, []);
            return accum;
        }, new Map<string, string[]>())

        for (let i = 0; i + 1 < frameData.length; i += 2) {
            const instrument = frameData[i];
            const performers = frameData[i + 1];
            if (!instrument || !performers) {
                continue;
            }

            const performersList = performers.split(",");
            for (const performer of performersList) {
                if (!map.has(performer)) {
                    // Skip unknown performers
                    continue;
                }

                map.get(performer).push(instrument);
            }
        }

        // Collapse the instrument lists and return that
        this._performersRole = itiriri(map.values())
            .map((e: string[]) => e.length > 0 ? e.join("; ") : undefined)
            .toArray();
        return this._performersRole;
    }
    /** @inheritDoc via TMCL frame */
    set performersRole(value: string[]) {
        // TODO: We should really just write this out to the frame instead of this temporary storage
        this.removeFrames(FrameIdentifiers.TMCL);
        this._performersRole = value ? value.slice(0) : [];
    }

    /** @inheritDoc via TSO2 frame */
    get albumArtists(): string[] { return this.getTextAsArray(FrameIdentifiers.TPE2); }
    /** @inheritDoc via TSO2 frame */
    set albumArtists(value: string[]) { this.setTextFrame(FrameIdentifiers.TPE2, ...value); }

    /** @inheritDoc via TPE2 frame */
    get albumArtistsSort(): string[] { return this.getTextAsArray(FrameIdentifiers.TSO2); }
    /** @inheritDoc via TPE2 frame */
    set albumArtistsSort(value: string[]) { this.setTextFrame(FrameIdentifiers.TSO2, ...value); }

    /** @inheritDoc via TCOM frame */
    get composers(): string[] { return this.getTextAsArray(FrameIdentifiers.TCOM); }
    /** @inheritDoc via TCOM frame */
    set composers(value: string[]) { this.setTextFrame(FrameIdentifiers.TCOM, ...value); }

    /** @inheritDoc via TSOC frame */
    get composersSort(): string[] { return this.getTextAsArray(FrameIdentifiers.TSOC); }
    /** @inheritDoc via TSOC frame */
    set composersSort(value: string[]) { this.setTextFrame(FrameIdentifiers.TSOC, ...value); }

    /** @inheritDoc via TALB frame */
    get album(): string { return this.getTextAsString(FrameIdentifiers.TALB); }
    /** @inheritDoc via TALB frame */
    set album(value: string) { this.setTextFrame(FrameIdentifiers.TALB, value); }

    /** @inheritDoc via TSOA frame */
    get albumSort(): string { return this.getTextAsString(FrameIdentifiers.TSOA); }
    /** @inheritDoc via TSOA frame */
    set albumSort(value: string) { this.setTextFrame(FrameIdentifiers.TSOA, value); }

    /** @inheritDoc via COMM frame */
    get comment(): string {
        const frames = this.getFramesByClassType<CommentsFrame>(FrameClassType.CommentsFrame);
        const f = CommentsFrame.findPreferred(frames, "", Id3v2Tag.language);
        return f ? f.toString() : undefined;
    }
    /** @inheritDoc via COMM frame */
    set comment(value: string) {
        const commentFrames = this.getFramesByClassType<CommentsFrame>(FrameClassType.CommentsFrame);

        // Delete the "" comment frames that are in this language
        if (!value) {
            this.removeFrames(FrameIdentifiers.COMM);
            return;
        }

        // Create or update the preferred comments frame
        let frame = CommentsFrame.findPreferred(commentFrames, "", Id3v2Tag.language);
        if (!frame) {
            frame = CommentsFrame.fromDescription("", Id3v2Tag.language);
            this.addFrame(frame);
        }

        frame.text = value;
    }

    /** @inheritDoc via TCON frame */
    get genres(): string[] { return this.getTextAsArray(FrameIdentifiers.TCON); }
    /** @inheritDoc via TCON frame */
    set genres(value: string[]) {
        if (!value || !Id3v2Settings.useNumericGenres) {
            this.setTextFrame(FrameIdentifiers.TCON, ...value);
            return;
        }

        // Clone the array so changes made won't affect the passed array
        this.setTextFrame(FrameIdentifiers.TCON, ...value.slice());
    }

    /**
     * @inheritDoc
     * If a TDRC frame exists, the year will be read from that. If a TDRC frame doesn't exist and a
     * TYER or TYE frame exists, the year will be read from that. Failing both cases, 0 will be
     * returned.
     */
    get year(): number {
        // Case 1: We have a TDRC frame (v2.4), preferentially use that
        const tdrcText = this.getTextAsString(FrameIdentifiers.TDRC);
        if (tdrcText && tdrcText.length >= 4) {
            // @TODO: Check places where we use this pattern... .parseInt doesn't parse the whole string if it started
            //  with good data
            return Number.parseInt(tdrcText.substr(0, 4), 10);
        }

        // Case 2: We have a TYER frame (v2.3/v2.2)
        const tyerText = this.getTextAsString(FrameIdentifiers.TYER);
        if (tyerText && tyerText.length >= 4) {
            // @TODO: Check places where we use this pattern... .parseInt doesn't parse the whole string if it started
            //  with good data
            return Number.parseInt(tyerText.substr(0, 4), 10);
        }

        // Case 3: Neither, return 0
        return 0;
    }
    /**
     * @inheritDoc
     * NOTE: values >9999 will remove the frame
     */
    set year(value: number) {
        Guards.uint(value, "value");

        // Case 0: Frame should be deleted
        if (value > 9999) {
            this.removeFrames(FrameIdentifiers.TDRC);
            this.removeFrames(FrameIdentifiers.TYER);
            return;
        }

        // Case 1: We have a TDRC frame (v2.4), preferentially replace contents with year
        const tdrcFrames = this.getFramesByIdentifier<TextInformationFrame>(
            FrameClassType.TextInformationFrame,
            FrameIdentifiers.TDRC
        );
        if (tdrcFrames.length > 0) {
            this.setNumberFrame(FrameIdentifiers.TDRC, value, 0);
            return;
        }

        // Case 2: We have a TYER/TYE frame (v2.3/v2.2)
        const tyerFrames = this.getFramesByIdentifier<TextInformationFrame>(
            FrameClassType.TextInformationFrame,
            FrameIdentifiers.TYER
        );
        if (tyerFrames.length > 0) {
            this.setNumberFrame(FrameIdentifiers.TYER, value, 0);
            return;
        }

        // Case 3: We have neither type of frame, create the frame for the version of tag on disk
        if (this.version > 3) {
            this.setNumberFrame(FrameIdentifiers.TDRC, value, 0);
        } else {
            this.setNumberFrame(FrameIdentifiers.TYER, value, 0);
        }

    }

    /** @inheritDoc via TRCK frame */
    get track(): number { return this.getTextAsUint32(FrameIdentifiers.TRCK, 0); }
    /** @inheritDoc via TRCK frame */
    set track(value: number) { this.setNumberFrame(FrameIdentifiers.TRCK, value, this.trackCount, 2); }

    /** @inheritDoc via TRCK frame */
    get trackCount(): number { return this.getTextAsUint32(FrameIdentifiers.TRCK, 1); }
    /** @inheritDoc via TRCK frame */
    set trackCount(value: number) { this.setNumberFrame(FrameIdentifiers.TRCK, this.track, value); }

    /** @inheritDoc via TPOS frame */
    get disc(): number { return this.getTextAsUint32(FrameIdentifiers.TPOS, 0); }
    /** @inheritDoc via TPOS frame */
    set disc(value: number) { this.setNumberFrame(FrameIdentifiers.TPOS, value, this.discCount); }

    /** @inheritDoc via TPOS frame */
    get discCount(): number { return this.getTextAsUint32(FrameIdentifiers.TPOS, 1); }
    /** @inheritDoc via TPOS frame */
    set discCount(value: number) { this.setNumberFrame(FrameIdentifiers.TPOS, this.disc, value); }

    /** @inheritDoc via USLT frame */
    get lyrics(): string {
        const frames = this.getFramesByClassType<UnsynchronizedLyricsFrame>(FrameClassType.UnsynchronizedLyricsFrame);
        const frame = UnsynchronizedLyricsFrame.findPreferred(frames, "", Id3v2Tag.language);
        return frame ? frame.toString() : undefined;
    }
    /** @inheritDoc via USLT frame */
    set lyrics(value: string) {
        const frames = this.getFramesByClassType<UnsynchronizedLyricsFrame>(FrameClassType.UnsynchronizedLyricsFrame);

        // Delete all unsynchronized lyrics frames in this language
        // @TODO: Verify that deleting only this language is the correct behavior
        if (!value) {
            this.removeFrames(FrameIdentifiers.USLT);
            return;
        }

        // Find or create the appropriate unsynchronized lyrics frame
        let frame = UnsynchronizedLyricsFrame.find(frames, "", Id3v2Tag.language);
        if (!frame) {
            frame = UnsynchronizedLyricsFrame.fromData("", Id3v2Tag.language);
            this.addFrame(frame);
        }
        frame.text = value;
        frame.textEncoding = Id3v2Settings.defaultEncoding;
    }

    /** @inheritDoc via TIT1 frame */
    get grouping(): string { return this.getTextAsString(FrameIdentifiers.TIT1); }
    /** @inheritDoc via TIT1 frame */
    set grouping(value: string) { this.setTextFrame(FrameIdentifiers.TIT1, value); }

    /** @inheritDoc via TBPM frame */
    get beatsPerMinute(): number {
        const text = this.getTextAsString(FrameIdentifiers.TBPM);
        if (!text) { return 0; }
        const num = Number.parseFloat(text);
        return Number.isNaN(num) || num < 0.0 ? 0 : Math.round(num);
    }
    /** @inheritDoc via TBPM frame */
    set beatsPerMinute(value: number) { this.setNumberFrame(FrameIdentifiers.TBPM, value, 0); }

    /** @inheritDoc via TPE3 frame */
    get conductor(): string { return this.getTextAsString(FrameIdentifiers.TPE3); }
    /** @inheritDoc via TPE3 frame */
    set conductor(value: string) { this.setTextFrame(FrameIdentifiers.TPE3, value); }

    /** @inheritDoc via TCOP frame */
    get copyright(): string { return this.getTextAsString(FrameIdentifiers.TCOP); }
    /** @inheritDoc via TCOP frame */
    set copyright(value: string) { this.setTextFrame(FrameIdentifiers.TCOP, value); }

    /** @inheritDoc via TDTG frame */
    get dateTagged(): Date | undefined {
        const strValue = this.getTextAsString(FrameIdentifiers.TDTG);
        if (!strValue) { return undefined; }
        const dateValue = new Date(strValue);
        return isNaN(dateValue.getTime()) ? undefined : dateValue;
    }
    /** @inheritDoc via TDTG frame */
    set dateTagged(value: Date | undefined) {
        let strValue: string;
        if (value) {
            strValue = DateFormat(value, "yyyy-mm-dd HH:MM:ss");
            strValue = strValue.replace(" ", "T");
        }
        this.setTextFrame(FrameIdentifiers.TDTG, strValue);
    }

    /** @inheritDoc via TXXX:MusicBrainz Artist Id frame */
    get musicBrainzArtistId(): string { return this.getUserTextAsString("MusicBrainz Artist Id"); }
    /** @inheritDoc via TXXX:MusicBrainz Artist Id frame */
    set musicBrainzArtistId(value: string) { this.setUserTextAsString("MusicBrainz Artist Id", value); }

    /** @inheritDoc via TXXX:MusicBrainz Release Group Id frame */
    get musicBrainzReleaseGroupId(): string { return this.getUserTextAsString("MusicBrainz Release Group Id"); }
    /** @inheritDoc via TXXX:MusicBrainz Release Group Id frame */
    set musicBrainzReleaseGroupId(value: string) { this.setUserTextAsString("MusicBrainz Release Group Id", value); }

    /** @inheritDoc via TXXX:MusicBrainz Album Id frame */
    get musicBrainzReleaseId(): string { return this.getUserTextAsString("MusicBrainz Album Id"); }
    /** @inheritDoc via TXXX:MusicBrainz Album Id frame */
    set musicBrainzReleaseId(value: string) { this.setUserTextAsString("MusicBrainz Album Id", value); }

    /** @inheritDoc via TXXX:MusicBrainz Album Artist Id frame */
    get musicBrainzReleaseArtistId(): string { return this.getUserTextAsString("MusicBrainz Album Artist Id"); }
    /** @inheritDoc via TXXX:MusicBrainz Album Artist Id frame */
    set musicBrainzReleaseArtistId(value: string) { this.setUserTextAsString("MusicBrainz Album Artist Id", value); }

    /** @inheritDoc via UFID:http://musicbrainz.org frame */
    get musicBrainzTrackId(): string { return this.getUfidText("http://musicbrainz.org"); }
    /** @inheritDoc via UFID:http://musicbrainz.org frame */
    set musicBrainzTrackId(value: string) { this.setUfidText("http://musicbrainz.org", value); }

    /** @inheritDoc via TXXX:MusicBrainz Disc Id frame */
    get musicBrainzDiscId(): string { return this.getUserTextAsString("MusicBrainz Disc Id"); }
    /** @inheritDoc via TXXX:MusicBrainz Disc Id frame */
    set musicBrainzDiscId(value: string) { this.setUserTextAsString("MusicBrainz Disc Id", value); }

    /** @inheritDoc via TXXX:MusicIP PUID frame */
    get musicIpId(): string { return this.getUserTextAsString("MusicIP PUID"); }
    /** @inheritDoc via TXXX:MusicIP PUID frame */
    set musicIpId(value: string) { this.setUserTextAsString("MusicIP PUID", value); }

    /** @inheritDoc via TXXX:ASIN */
    get amazonId(): string { return this.getUserTextAsString("ASIN"); }
    /** @inheritDoc via TXXX:ASIN */
    set amazonId(value: string) { this.setUserTextAsString("ASIN", value); }

    /** @inheritDoc via TXXX:MusicBrainz Album Status frame */
    get musicBrainzReleaseStatus(): string { return this.getUserTextAsString("MusicBrainz Album Status"); }
    /** @inheritDoc via TXXX:MusicBrainz Album Status frame */
    set musicBrainzReleaseStatus(value: string) { this.setUserTextAsString("MusicBrainz Album Status", value); }

    /** @inheritDoc via TXXX:MusicBrainz Album Type frame */
    get musicBrainzReleaseType(): string { return this.getUserTextAsString("MusicBrainz Album Type"); }
    /** @inheritDoc via TXXX:MusicBrainz Album Type frame */
    set musicBrainzReleaseType(value: string) { this.setUserTextAsString("MusicBrainz Album Type", value); }

    /** @inheritDoc via TXXX:MusicBrainz Album Release Country frame */
    get musicBrainzReleaseCountry(): string { return this.getUserTextAsString("MusicBrainz Album Release Country"); }
    /** @inheritDoc via TXXX:MusicBrainz Album Release Country frame */
    set musicBrainzReleaseCountry(value: string) {
        this.setUserTextAsString("MusicBrainz Album Release Country", value);
    }

    /** @inheritDoc via TXXX:REPLAY_GAIN_TRACK_GAIN frame */
    get replayGainTrackGain(): number {
        let text = this.getUserTextAsString("REPLAYGAIN_TRACK_GAIN", false);
        if (!text) { return NaN; }
        if (text.toLowerCase().endsWith("db")) {
            text = text.substr(0, text.length - 2).trim();
        }

        return Number.parseFloat(text);
    }
    /** @inheritDoc via TXXX:REPLAY_GAIN_TRACK_GAIN frame */
    set replayGainTrackGain(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.setUserTextAsString("REPLAYGAIN_TRACK_GAIN", undefined, false);
        } else {
            const text = `${value.toFixed(2).toString()} dB`;
            this.setUserTextAsString("REPLAYGAIN_TRACK_GAIN", text, false);
        }
    }

    /** @inheritDoc via TXXX:REPLAYGAIN_TRACK_PEAK frame */
    get replayGainTrackPeak(): number {
        const text: string = this.getUserTextAsString("REPLAYGAIN_TRACK_PEAK", false);
        return text ? Number.parseFloat(text) : NaN;
    }
    /** @inheritDoc via TXXX:REPLAYGAIN_TRACK_PEAK frame */
    set replayGainTrackPeak(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.setUserTextAsString("REPLAYGAIN_TRACK_PEAK", undefined, false);
        } else {
            const text = value.toFixed(6).toString();
            this.setUserTextAsString("REPLAYGAIN_TRACK_PEAK", text, false);
        }
    }

    /** @inheritDoc via TXXX:REPLAYGAIN_ALBUM_GAIN frame */
    get replayGainAlbumGain(): number {
        let text = this.getUserTextAsString("REPLAYGAIN_ALBUM_GAIN", false);
        if (!text) { return NaN; }
        if (text.toLowerCase().endsWith("db")) {
            text = text.substr(0, text.length - 2).trim();
        }

        return Number.parseFloat(text);
    }
    /** @inheritDoc via TXXX:REPLAYGAIN_ALBUM_GAIN frame */
    set replayGainAlbumGain(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.setUserTextAsString("REPLAYGAIN_ALBUM_GAIN", undefined, false);
        } else {
            const text = `${value.toFixed(2).toString()} dB`;
            this.setUserTextAsString("REPLAYGAIN_ALBUM_GAIN", text, false);
        }
    }

    /** @inheritDoc via TXXX:REPLAYGAIN_ALBUM_PEAK frame */
    get replayGainAlbumPeak(): number {
        const text: string = this.getUserTextAsString("REPLAYGAIN_ALBUM_PEAK", false);
        return text ? Number.parseFloat(text) : NaN;
    }
    /** @inheritDoc via TXXX:REPLAYGAIN_ALBUM_PEAK frame */
    set replayGainAlbumPeak(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            this.setUserTextAsString("REPLAYGAIN_ALBUM_PEAK", undefined, false);
        } else {
            const text = value.toFixed(6).toString();
            this.setUserTextAsString("REPLAYGAIN_ALBUM_PEAK", text, false);
        }
    }

    /** @inheritDoc via TKEY frame */
    get initialKey(): string { return this.getTextAsString(FrameIdentifiers.TKEY); }
    /** @inheritDoc via TKEY frame */
    set initialKey(value: string) { this.setTextFrame(FrameIdentifiers.TKEY, value); }

    /** @inheritDoc via TPE4 frame */
    get remixedBy(): string { return this.getTextAsString(FrameIdentifiers.TPE4); }
    /** @inheritDoc via TPE4 frame */
    set remixedBy(value: string) { this.setTextFrame(FrameIdentifiers.TPE4, value); }

    /** @inheritDoc via TPUB frame */
    get publisher(): string { return this.getTextAsString(FrameIdentifiers.TPUB); }
    /** @inheritDoc via TPUB frame */
    set publisher(value: string) { this.setTextFrame(FrameIdentifiers.TPUB, value); }

    /** @inheritDoc via TSRC frame */
    get isrc(): string { return this.getTextAsString(FrameIdentifiers.TSRC); }
    /** @inheritDoc via TSRC frame */
    set isrc(value: string) { this.setTextFrame(FrameIdentifiers.TSRC, value); }

    /** @inheritDoc via APIC frame */
    get pictures(): IPicture[] {
        return this.getFramesByClassType<AttachmentFrame>(FrameClassType.AttachmentFrame).slice(0);
    }
    /** @inheritDoc via APIC frame */
    set pictures(value: IPicture[]) {
        this.removeFrames(FrameIdentifiers.APIC);
        this.removeFrames(FrameIdentifiers.GEOB);

        if (!value || value.length === 0) { return; }

        for (const pic of value) {
            this.addFrame(AttachmentFrame.fromPicture(pic));
        }
    }

    /** @inheritDoc */
    public get isEmpty(): boolean { return this._frameList.length === 0; }

    // #endregion

    // #region Public Methods

    /**
     * Adds a frame to the current instance.
     * @param frame Frame to add to the current instance
     */
    public addFrame(frame: Frame): void {
        Guards.truthy(frame, "frame");
        this._frameList.push(frame);
    }

    /** @inheritDoc */
    public clear(): void {
        this._frameList.splice(0, this._frameList.length);
    }

    /** @inheritDoc */
    public copyTo(target: Tag, overwrite: boolean): void {
        Guards.truthy(target, "target");
        if (target.tagTypes !== TagTypes.Id3v2) {
            super.copyTo(target, overwrite);
            return;
        }
        const match = <Id3v2Tag> target;

        const frames = this._frameList.slice();
        while (frames.length > 0) {
            const ident = frames[0].frameId;
            let copy = true;
            if (overwrite) {
                match.removeFrames(ident);
            } else {
                for (const f of match._frameList) {
                    if (f.frameId === ident) {
                        copy = false;
                        break;
                    }
                }
            }

            let i = 0;
            while (i < frames.length) {
                if (frames[i].frameId === ident) {
                    if (copy) {
                        match._frameList.push(frames[i].clone());
                    }
                    frames.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    }

    /**
     * Gets all frames with a specific frame class type.
     * NOTE: This diverges from the .NET implementation due to the inability to do type checking
     * like in .NET (ie `x is y`). Instead type guards are added to each frame class which provides
     * the same functionality.
     * @param type Class type of the frame to find
     * @returns TFrame[] Array of frames with the specified class type
     */
    public getFramesByClassType<TFrame extends Frame>(type: FrameClassType): TFrame[] {
        // TODO: Can we access static properties from TFrame? if so, can we use that to get the frame class type?
        Guards.notNullOrUndefined(type, "type");

        return <TFrame[]> this._frameList.filter((f) => f && f.frameClassType === type);
    }

    /**
     * Gets a list of frames with the specified identifier contained in the current instance.
     * NOTE: This implementation deviates a bit from the original .NET implementation due to the
     * inability to do `x is y` comparison by types in typescript without type guards.
     * `type` is the type guard for differentiating frame types. If all frames are needed
     * use {@link frames}.
     * @param type Type of frame to return
     * @param ident Identifier of the frame
     * @returns TFrame[] Array of frames with the desired frame identifier
     */
    public getFramesByIdentifier<TFrame extends Frame>(type: FrameClassType, ident: FrameIdentifier): TFrame[] {
        Guards.notNullOrUndefined(type, "type");
        Guards.truthy(ident, "ident");

        return <TFrame[]> this._frameList.filter((f) => f && f.frameClassType === type && f.frameId === ident);
    }

    /**
     * Gets the text value from a specified text information frame (or URL frame if that was
     * specified).
     * @param ident Frame identifier of the text information frame to get the value from
     * @returns string Text of the specified frame, or `undefined` if no value was found
     */
    public getTextAsString(ident: FrameIdentifier): string {
        Guards.truthy(ident, "ident");

        let frame: Frame;
        if (ident.isUrlFrame) {
            const frames = this.getFramesByClassType<UrlLinkFrame>(FrameClassType.UrlLinkFrame);
            frame = UrlLinkFrame.findUrlLinkFrame(frames, ident);
        } else {
            const frames = this.getFramesByClassType<TextInformationFrame>(FrameClassType.TextInformationFrame);
            frame = TextInformationFrame.findTextInformationFrame(frames, ident);
        }

        const result = frame ? frame.toString() : undefined;
        return result || undefined;
    }

    /**
     * Removes a specified frame from the current instance.
     * @param frame Object to remove from the current instance
     */
    public removeFrame(frame: Frame): void {
        Guards.truthy(frame, "frame");

        const index = this._frameList.indexOf(frame);
        if (index >= 0) {
            this._frameList.splice(index, 1);
        }
    }

    /**
     * Removes all frames with a specified identifier from the current instance.
     * @param ident Identifier of the frames to remove
     */
    public removeFrames(ident: FrameIdentifier): void {
        Guards.truthy(ident, "ident");

        for (let i = this._frameList.length - 1; i >= 0; i--) {
            if (this._frameList[i].frameId === ident) {
                this._frameList.splice(i, 1);
            }
        }
    }

    /**
     * Renders the current instance as a raw ID3v2 tag.
     * By default, tags will be rendered in the version they were loaded in and new tags using the
     * version specified by {@link defaultVersion}. If {@link forceDefaultVersion} is `true`, all
     * tags will be rendered using that version, except for tags with footers which must be in
     * version 4.
     * @returns ByteVector The rendered tag.
     */
    public render(): ByteVector {
        // Convert the performers role to the TMCL frame
        let performersRoleList: string[] = [];
        if (this._performersRole) {
            const map: {[key: string]: string} = {};
            for (let i = 0; i < this._performersRole.length; i++) {
                const instruments = this._performersRole[i];
                if (!instruments) {
                    continue;
                }

                const instrumentList = instruments.split(";");
                for (const instrument of instrumentList) {
                    const inst = instrument.trim();

                    if (i < this.performers.length) {
                        const perf = this.performers[i];
                        if (inst in map) {
                            map[inst] += ", " + perf;
                        } else {
                            map[inst] = perf;
                        }
                    }
                }
            }

            // Convert dictionary to string
            performersRoleList = new Array<string>(Object.keys(map).length * 2);
            for (const key in map) {
                if (!map.hasOwnProperty(key)) {
                    continue;
                }
                performersRoleList.push(key);
                performersRoleList.push(map[key]);
            }
        }

        this.setTextFrame(FrameIdentifiers.TMCL, ...performersRoleList);

        // We need to render the "tag data" first so that we have to correct size to render in the
        // tag's header. The "tag data" (everything that is included in Header.tagSize) includes
        // the extended header, frames and padding, but does not include the tag's header or footer
        const hasFooter = (this._header.flags & Id3v2TagHeaderFlags.FooterPresent) !== 0;
        const unsyncAtFrameLevel = (this._header.flags & Id3v2TagHeaderFlags.Unsynchronization) !== 0
            && this.version >= 4;
        const unsyncAtTagLevel = (this._header.flags & Id3v2TagHeaderFlags.Unsynchronization) !== 0
            && this.version < 4;

        this._header.majorVersion = hasFooter ? 4 : this.version;

        // TODO: Render the extended header
        this._header.flags &= ~Id3v2TagHeaderFlags.ExtendedHeader;

        // Loop through the frames rendering them and adding them to tag data
        const renderedFrames = this._frameList.map((frame) => {
            if (unsyncAtFrameLevel) {
                frame.flags |= Id3v2FrameFlags.Unsynchronized;
            }
            if ((frame.flags & Id3v2FrameFlags.TagAlterPreservation) !== 0 ) {
                return undefined;
            }

            try {
                return frame.render(this._header.majorVersion);
            } catch (e) {
                if (NotImplementedError.errorIs(e)) {
                    // Swallow not implemented errors
                } else if (NotSupportedError.errorIs(e) && !Id3v2Settings.strictFrameForVersion) {
                    // Ignore not supported errors if we're not in strict frame mode
                } else {
                    throw e;
                }
            }
        });

        // Put the tag data together and unsynchronize it.
        let frameBytes = ByteVector.concatenate(... renderedFrames);
        if (unsyncAtTagLevel) {
            frameBytes = SyncData.unsyncByteVector(frameBytes);
        }

        // Compute the amount of padding and append that to tag data
        let paddingBytes;
        if (!hasFooter) {
            const size = frameBytes.length < this._header.tagSize
                ? this._header.tagSize - frameBytes.length
                : 1024;
            paddingBytes = ByteVector.fromSize(size);
        }

        // Set the tag size and add the header/footer
        this._header.tagSize = frameBytes.length;
        if (paddingBytes) {
            this._header.tagSize += paddingBytes.length;
        }
        const headerBytes = this._header.render();

        let footerBytes;
        if (hasFooter) {
            footerBytes = Id3v2TagFooter.fromHeader(this._header).render();
        }

        return ByteVector.concatenate(
            headerBytes,
            frameBytes,
            paddingBytes,
            footerBytes
        );
    }

    /**
     * Replaces an existing frame with a new one in the list contained in the current instance, or
     * adds a new one if the existing one is not contained.
     * @param oldFrame Object to be replaced
     * @param newFrame Object to replace `oldFrame` with
     */
    public replaceFrame(oldFrame: Frame, newFrame: Frame): void {
        Guards.truthy(oldFrame, "oldFrame");
        Guards.truthy(newFrame, "newFrame");

        if (oldFrame === newFrame) {
            return;
        }

        const index = this._frameList.indexOf(oldFrame);
        if (index >= 0) {
            this._frameList[index] = newFrame;
        } else {
            this._frameList.push(newFrame);
        }
    }

    /**
     * Sets the numerical values for a specified text information frame.
     * If both `numerator` and `denominator` are `0`, the frame will be removed
     * from the tag. If `denominator` is zero, `numerator` will be stored by
     * itself. Otherwise the values will be stored as `{numerator}/{denominator}`.
     * @param ident Identity of the frame to set
     * @param numerator Value containing the top half of the fraction, or the number if
     *     `denominator` is zero
     * @param denominator Value containing the bottom half of the fraction
     * @param minPlaces Minimum number of digits to use to display the `numerator`, if
     *     the numerator has less than this number of digits, it will be filled with leading zeroes.
     */
    public setNumberFrame(ident: FrameIdentifier, numerator: number, denominator: number, minPlaces: number = 1): void {
        Guards.truthy(ident, "ident");
        Guards.uint(numerator, "value");
        Guards.uint(denominator, "count");
        Guards.byte(minPlaces, "minPlaces");

        if (numerator === 0 && denominator === 0) {
            this.removeFrames(ident);
        } else if (denominator !== 0) {
            const formattedNumerator = numerator.toString().padStart(minPlaces, "0");
            this.setTextFrame(ident, `${formattedNumerator}/${denominator}`);
        } else {
            this.setTextFrame(ident, numerator.toString().padStart(minPlaces, "0"));
        }
    }

    /**
     * Sets the text for a specified text information frame.
     * @param ident Identifier of the frame to set the data for
     * @param text Text to set for the specified frame or `undefined`/`null`/`""` to remove all
     *     frames with that identifier.
     */
    public setTextFrame(ident: FrameIdentifier, ...text: string[]): void {
        Guards.truthy(ident, "ident");

        // Check if all the elements provided are empty. If they are, remove the frame.
        let empty = true;

        if (text) {
            for (let i = 0; empty && i < text.length; i++) {
                if (text[i]) {
                    empty = false;
                }
            }
        }

        if (empty) {
            this.removeFrames(ident);
            return;
        }

        if (ident.isUrlFrame) {
            const frames = this.getFramesByClassType<UrlLinkFrame>(FrameClassType.UrlLinkFrame);
            let urlFrame = UrlLinkFrame.findUrlLinkFrame(frames, ident);
            if (!urlFrame) {
                urlFrame = UrlLinkFrame.fromIdentity(ident);
                this.addFrame(urlFrame);
            }

            urlFrame.text = text;
            urlFrame.textEncoding = Id3v2Settings.defaultEncoding;
        } else {
            const frames = this.getFramesByClassType<TextInformationFrame>(FrameClassType.TextInformationFrame);
            let frame = TextInformationFrame.findTextInformationFrame(frames, ident);
            if (!frame) {
                frame = TextInformationFrame.fromIdentifier(ident);
                this.addFrame(frame);
            }

            frame.text = text;
            frame.textEncoding = Id3v2Settings.defaultEncoding;
        }
    }

    // #endregion

    // #region Protected/Private Methods
    // @TODO: Split into parseFromFile and parseFromData
    protected parse(data: ByteVector, file: File, position: number, style: ReadStyle): void {
        // If the entire tag is marked as unsynchronized, and this tag is version ID3v2.3 or lower,
        // resynchronize it.
        const fullTagUnsync = this._header.majorVersion < 4
            && (this._header.flags & Id3v2TagHeaderFlags.Unsynchronization) !== 0;

        // Avoid loading all the ID3 tag if PictureLazy is enabled and size is significant enough
        // (ID3v2.4 and later only)
        if (file && (
            fullTagUnsync ||
            this._header.tagSize < 1024 ||
            (style & ReadStyle.PictureLazy) !== 0 ||
            (this._header.flags & Id3v2TagHeaderFlags.ExtendedHeader) !== 0
        )) {
            file.seek(position);
            data = file.readBlock(this._header.tagSize);
        }

        if (fullTagUnsync) {
            data = SyncData.resyncByteVector(data);
        }

        let frameDataPosition = data ? 0 : position;
        let frameDataEndPosition = (data ? data.length : this._header.tagSize) + frameDataPosition;

        // Check for the extended header
        if ((this._header.flags & Id3v2TagHeaderFlags.ExtendedHeader) !== 0) {
            this._extendedHeader = Id3v2ExtendedHeader.fromData(data, this._header.majorVersion);

            if (this._extendedHeader.size <= data.length) {
                frameDataPosition += this._extendedHeader.size;
                frameDataEndPosition -= this._extendedHeader.size;
            }
        }

        // Parse the frames
        while (frameDataPosition < frameDataEndPosition) {
            const frameRead = FrameFactory.createFrame(
                data,
                file,
                frameDataPosition,
                this._header.majorVersion,
                fullTagUnsync
            );

            // If the frame factory returned undefined, that means we've hit the end of frames
            if (!frameRead) {
                break;
            }

            // We found a frame, deconstruct the read result
            const frame = frameRead.frame;
            frameDataPosition = frameRead.offset;

            // Only add frames that contain data
            if (!frame || frame.size === 0) {
                continue;
            }
            this.addFrame(frame);
        }
    }

    protected readFromStart(file: File, position: number, style: ReadStyle): void {
        file.seek(position);

        const headerBlock = file.readBlock(Id3v2Settings.headerSize);
        this._header = Id3v2TagHeader.fromData(headerBlock);

        // If the tag size is 0, then this is an invalid tag. Tags must contain at least one frame.
        if (this._header.tagSize === 0) {
            return;
        }

        position += Id3v2Settings.headerSize;
        this.parse(undefined, file, position, style);
    }

    protected readFromEnd(file: File, position: number, style: ReadStyle): void {
        file.seek(position - Id3v2Settings.footerSize);

        const footerBlock = file.readBlock(Id3v2Settings.footerSize);
        const footer = Id3v2TagFooter.fromData(footerBlock);
        position -= footer.completeTagSize;

        this.readFromStart(file, position, style);
    }

    private getTextAsArray(ident: FrameIdentifier): string[] {
        const frames = this.getFramesByClassType<TextInformationFrame>(FrameClassType.TextInformationFrame);
        const frame = TextInformationFrame.findTextInformationFrame(frames, ident);
        return frame ? frame.text : [];
    }

    private getTextAsUint32(ident: FrameIdentifier, index: number): number {
        const text = this.getTextAsString(ident);
        if (text === null || text === undefined) {
            return 0;
        }

        const values = text.split("/", index + 2);
        if (values.length < index + 1) {
            return 0;
        }

        const asNumber = parseInt(values[index], 10);
        if (Number.isNaN(asNumber)) {
            return 0;
        }

        return asNumber;
    }

    private getUfidText(owner: string): string {
        // Get the UFID frame, frame will be undefined if nonexistent
        const frames = this.getFramesByClassType<UniqueFileIdentifierFrame>(FrameClassType.UniqueFileIdentifierFrame);
        const frame = UniqueFileIdentifierFrame.find(frames, owner);

        // If the frame existed, frame.identifier is a byte vector, get a string
        const result = frame ? frame.identifier.toString(StringType.Latin1) : undefined;
        return result || undefined;
    }

    private getUserTextAsString(description: string, caseSensitive: boolean = true): string {
        // Gets the TXXX frame, frame will be undefined if nonexistent
        const frames = this.getFramesByClassType<UserTextInformationFrame>(FrameClassType.UserTextInformationFrame);
        const frame = UserTextInformationFrame.findUserTextInformationFrame(frames, description, caseSensitive);

        // TXXX frames support multi-value strings, join them up and return only the text from the
        // frame
        const result = frame ? frame.text.join(";") : undefined;        // TODO: Consider escaping ';' before joining?
        return result || undefined;
    }

    private setUfidText(owner: string, text: string): void {
        // Get the UFID frame, create if necessary
        const frames = this.getFramesByClassType<UniqueFileIdentifierFrame>(FrameClassType.UniqueFileIdentifierFrame);
        let frame = UniqueFileIdentifierFrame.find(frames, owner);

        // If we have a real string, convert to byte vector and apply to frame
        if (!text && frame) {
            // String was falsy, remove the frame to prevent empties
            this.removeFrame(frame);
        } else {
            const identifier = ByteVector.fromString(text, StringType.UTF8);
            frame = UniqueFileIdentifierFrame.fromData(owner, identifier);
            this.addFrame(frame);
        }
    }

    private setUserTextAsString(description: string, text: string, caseSensitive: boolean = true): void {
        // Get the TXXX frame, create a new one if needed
        const frames = this.getFramesByClassType<UserTextInformationFrame>(FrameClassType.UserTextInformationFrame);
        let frame = UserTextInformationFrame.findUserTextInformationFrame(frames, description, caseSensitive);

        if (!text) {
            // Remove the frame if it exists, otherwise do nothing
            if (frame) {
                this.removeFrame(frame);
            }
        } else {
            if (!frame) {
                frame = UserTextInformationFrame.fromDescription(description, Id3v2Settings.defaultEncoding);
                this.addFrame(frame);
            }
            frame.text = text.split(";");
        }
    }

    // #endregion
}
