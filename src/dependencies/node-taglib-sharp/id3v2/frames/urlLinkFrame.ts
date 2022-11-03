import {ByteVector, StringType} from "../../byteVector";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifier, FrameIdentifiers} from "../frameIdentifiers";
import {Guards} from "../../utils";

/**
 * Provides ID3v2 URL Link frame implementation (section 4.3.1) covering `W000` to `WZZZ`,
 * excluding `WXXX`.
 * With these frames dynamic data such as webpages with touring information, price information,
 * or plain ordinary news can be added to the tag. There may only be one URL link frame of its kind
 * in a tag, except when stated otherwise in the frame description. If the text string is followed
 * by a string termination, all the following information should be ignored and not be displayed.
 * The following table contains the types and descriptions as found in the ID3 2.4.0 native frames
 * specification.
 * * WCOM - The 'Commercial Information' frame is a URL pointing at a webpage with information
 *   such as where the album can be bought. There may be more than one WCOM frame per tag, but not
 *   with the same content.
 * * WCOP - The 'Copyright/Legal information' frame is a URL pointing at a webpage where the terms
 *   of use and ownership of the field is described.
 * * WOAF - The 'Official audio file webpage' frame is a URL pointing at a file specific webpage.
 * * WOAR - The 'Official artist/performer webpage' frame is a URL pointing at the artists'
 *   official webpage. There may be more than one WOAR frame in a tag if the audio contains more
 *   than one performer, but not with the same content.
 * * WOAS - THe 'Official audio source webpage' frame is a URL pointing at the official webpage of
 *   the source of the audio file, eg. a movie.
 * * WORS - The 'Official internet radio station homepage' frame contains a URL pointing at the
 *   homepage of the internet radio station.
 * * WPAY - The 'Payment' frame is a URL pointing at a webpage that will handle the process of
 *   paying for this file.
 * * WPUB - The 'Publisher's official webpage' frame is a URL pointing at the official webpage
 *   for the publisher.
 */
export class UrlLinkFrame extends Frame {
    // @TODO: Don't allow protected member variables
    protected _encoding: StringType = StringType.Latin1;
    protected _rawData: ByteVector;
    protected _rawVersion: number;
    protected _textFields: string[] = [];

    // #region Constructors

    protected constructor(header: Id3v2FrameHeader) {
        super(header);
    }

    /**
     * Constructs and initializes an empty frame with the provided frame identity
     * @param ident Identity of the frame to construct
     */
    public static fromIdentity(ident: FrameIdentifier): UrlLinkFrame {
        Guards.truthy(ident, "ident");
        return new UrlLinkFrame(new Id3v2FrameHeader(ident));
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version. This method allows for offset reading from the data byte vector.
     * @param data Raw representation of the new frame
     * @param offset What offset in `data` the frame actually begins. Must be positive,
     *     safe integer
     * @param header Header of the frame found at `data` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): UrlLinkFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new UrlLinkFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified
     * ID3v2 version.
     * @param data Raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded with, must be a positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): UrlLinkFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new UrlLinkFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Properties

    public get frameClassType(): FrameClassType { return FrameClassType.UrlLinkFrame; }

    /**
     * Gets the text contained in the current instance.
     * Modifying the contents of the returned value will not modify the contents of the current
     * instance. The value must be reassigned for the value to change.
     */
    public get text(): string[] {
        this.parseRawData();
        return this._textFields.slice(0);
    }
    /**
     * Sets the text contained in the current instance.
     */
    public set text(value: string[]) {
        this._rawData = undefined;
        this._textFields = value ? value.slice() : [];
    }

    /**
     * Gets the text encoding to use when rendering the current instance.
     */
    public get textEncoding(): StringType {
        this.parseRawData();
        return this._encoding;
    }
    /**
     * Sets the text encoding to use when rendering the current instance.
     * NOTE: This value will be overwritten if {@link Id3v2Settings.forceDefaultEncoding} is `true`.
     * @param value
     */
    public set textEncoding(value: StringType) { this._encoding = value; }

    // #endregion

    // #region Methods

    /**
     * Gets the first frame that matches the provided type
     * @param frames Object to search in
     * @param ident Frame identifier to search for
     * @returns UrlLinkFrame Frame containing the matching frameId, `undefined` if a match was
     *     not found
     */
    public static findUrlLinkFrame(frames: UrlLinkFrame[], ident: FrameIdentifier): UrlLinkFrame {
        Guards.truthy(frames, "frames");
        Guards.truthy(ident, "ident");

        return frames.find((f) => f.frameId === ident);
    }

    /** @inheritDoc */
    public clone(): UrlLinkFrame {
        const frame = UrlLinkFrame.fromIdentity(this.frameId);
        frame._textFields = this._textFields.slice();
        frame._rawData = this._rawData?.toByteVector();
        frame._rawVersion = this._rawVersion;
        return frame;
    }

    /** @inheritDoc */
    public toString(): string {
        this.parseRawData();
        return this.text.join("; ");
    }

    /** @inheritDoc */
    protected parseFields(data: ByteVector, version: number): void {
        Guards.byte(version, "version");
        this._rawData = data.toByteVector();
        this._rawVersion = version;
    }

    protected parseRawData(): void {
        if (!this._rawData) {
            return;
        }

        const data = this._rawData;
        this._rawData = undefined;

        const fieldList = [];
        let index = 0;
        if (this.frameId === FrameIdentifiers.WXXX && data.length > 0) {
            // Text Encoding    $xx
            // Description      <text string according to encoding> $00 (00)
            // URL              <text string>
            const encoding = <StringType> data.get(index);
            const delim = ByteVector.getTextDelimiter(encoding);
            index++;

            const delimIndex = data.offsetFind(delim, index, delim.length);
            if (delimIndex >= 0) {
                const descriptionLength = delimIndex - index;
                const description = data.subarray(index, descriptionLength).toString(encoding);
                fieldList.push(description);
                index += descriptionLength + delim.length;
            }
        }

        if (index < data.length) {

            // Read the url from the data
            let url = data.subarray(index).toString(StringType.Latin1);
            url = url.replace(/[\s\0]+$/, "");

            fieldList.push(url);
        }
        this._textFields = fieldList;
    }

    /** @inheritDoc */
    protected renderFields(version: number): ByteVector {
        // @TODO: Move WXXX rendering to WXXX class
        if (this._rawData && this._rawVersion === version) {
            return this._rawData;
        }

        const encoding = UrlLinkFrame.correctEncoding(this.textEncoding, version);
        const isWxxx = this.frameId === FrameIdentifiers.WXXX;

        let textFields = this._textFields;
        if (version > 3 || isWxxx) {
            if (isWxxx) {
                if (textFields.length === 0) {
                    textFields = [undefined, undefined];
                } else if (textFields.length === 1) {
                    textFields = [textFields[0], undefined];
                }
            }
        }
        // @TODO: is this correct formatting?
        const text = textFields.join("/");

        return ByteVector.concatenate(
            isWxxx ? encoding : undefined,
            ByteVector.fromString(text, StringType.Latin1)
        );
    }

    // #endregion
}

/**
 * Provides support for ID3v2 User URL Link frames (WXXX).
 */
export class UserUrlLinkFrame extends UrlLinkFrame {
    // #region Constructors

    private constructor(header: Id3v2FrameHeader) {
        super(header);
    }

    /**
     * Constructs and initializes a new instance using the provided description as the text
     * of the frame.
     * @param description Description to use as text of the frame.
     */
    public static fromDescription(description: string): UserUrlLinkFrame {
        const frame = new UserUrlLinkFrame(new Id3v2FrameHeader(FrameIdentifiers.WXXX));
        frame.text = [description];
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version. This method allows for offset reading from the data byte vector.
     * @param data Raw representation of the new frame
     * @param offset What offset in `data` the frame actually begins. Must be positive,
     *     safe integer
     * @param header Header of the frame found at `data` in the data
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): UserUrlLinkFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");

        const frame = new UserUrlLinkFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified
     * ID3v2 version.
     * @param data Raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded with, must be a positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): UserUrlLinkFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new UserUrlLinkFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.UserUrlLinkFrame; }

    /**
     * Gets the description stored in the current instance.
     */
    public get description(): string {
        const text = super.text;
        return text.length > 0 ? text[0] : undefined;
    }
    /**
     * Sets the description stored in the current instance.
     * There should only be one frame with a matching description per tag.
     */
    public set description(value: string) {
        const normalizedValue = value || undefined;

        let text = super.text;
        if (text.length > 0) {
            text[0] = normalizedValue;
        } else {
            text = [normalizedValue];
        }
        super.text = text;
    }

    /**
     * Gets the text contained in the current instance.
     * NOTE: Modifying the contents of the returned value will not modify the contents of the
     * current instance. The value must be reassigned for the value to change.
     */
    public get text(): string[] {
        const text = super.text;
        if (text.length < 2) { return []; }

        const newText = new Array<string>(text.length - 1);
        for (let i = 0; i < newText.length; i++) {
            newText[i] = text[i + 1];
        }
        return newText;
    }
    /**
     * Sets the text contained in the current instance.
     */
    public set text(value: string[]) {
        const newValue = [this.description];
        if (value) {
            newValue.push(... value);
        }
        super.text = newValue;
    }

    // #endregion

    // #region Methods

    /**
     * Gets a frame from a list of frames.
     * @param frames List of frames to search
     * @param description Description of the frame to match
     * @returns UserUrlLinkFrame Frame containing the matching user, `undefined` if a match was not
     *     found
     */
    public static findUserUrlLinkFrame(frames: UserUrlLinkFrame[], description: string): UserUrlLinkFrame {
        Guards.truthy(frames, "frames");
        Guards.truthy(description, "description");

        return frames.find((f) => f.description === description);
    }

    /** @inheritDoc */
    public clone(): UserUrlLinkFrame {
        const frame = UserUrlLinkFrame.fromDescription(undefined);
        frame._encoding = this._encoding;
        frame._textFields = this._textFields.slice();
        frame._rawData = this._rawData?.toByteVector();
        frame._rawVersion = this._rawVersion;
        return frame;
    }

    /** @inheritDoc */
    public toString(): string {
        return `[${this.description}] ${super.toString()}`;
    }

    // #endregion
}
