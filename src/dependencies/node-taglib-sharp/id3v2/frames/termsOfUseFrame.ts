import Id3v2Settings from "../id3v2Settings";
import {ByteVector, StringType} from "../../byteVector";
import {CorruptFileError} from "../../errors";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {Guards} from "../../utils";

export default class TermsOfUseFrame extends Frame {
    private _language: string;
    private _text: string;
    private _textEncoding: StringType = Id3v2Settings.defaultEncoding;

    // #region Constructors

    private constructor(header: Id3v2FrameHeader) {
        super(header);
    }

    /**
     * Constructs and initializes a new instance with a specified language.
     * @param language ISO-639-2 language code for the new frame
     * @param textEncoding Optional, text encoding to use when rendering the new frame. If not
     *     provided defaults to {@link Id3v2Settings.defaultEncoding}
     */
    public static fromFields(
        language: string,
        textEncoding: StringType = Id3v2Settings.defaultEncoding
    ): TermsOfUseFrame {
        const f = new TermsOfUseFrame(new Id3v2FrameHeader(FrameIdentifiers.USER));
        f.textEncoding = textEncoding;
        f._language = language;
        return f;
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
    ): TermsOfUseFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new TermsOfUseFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified
     * ID3v2 version.
     * @param data Raw representation of the new frame
     * @param version ID3v2 version the raw frame is encoded with, must be a positive 8-bit integer
     */
    public static fromRawData(data: ByteVector, version: number): TermsOfUseFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new TermsOfUseFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.TermsOfUseFrame; }

    /**
     * Gets the ISO-639-2 language code stored in the current instance.
     */
    public get language(): string {
        return this._language && this._language.length > 2
            ? this._language.substring(0, 3)
            : "XXX";
    }
    /**
     * Sets the ISO-639-2 language code stored in the current instance.
     * There should only be one frame with a matching ISO-639-2 language code per tag.
     */
    public set language(value: string) { this._language = value; }

    /**
     * Gets the text of the terms of use
     */
    public get text(): string { return this._text || ""; }
    /**
     * Sets the text of the terms of use
     */
    public set text(value: string) { this._text = value; }

    /**
     * Gets the text encoding to use when storing the current instance.
     */
    public get textEncoding(): StringType { return this._textEncoding; }
    /**
     * Sets the text encoding to use when storing the current instance.
     * This encoding is overridden when rendering if {@link Id3v2Settings.forceDefaultEncoding} is
     * `true` or the render version does not support it.
     * @param value Text encoding to use when storing the current instance
     */
    public set textEncoding(value: StringType) { this._textEncoding = value; }

    // #endregion

    // #region Public Methods

    /**
     * Gets a specified terms of use frame from the list of frames
     * @param frames List of frames to search
     * @param language Optionally, the ISO-639-2 language code to match
     * @returns TermsOfUseFrame A matching frame if found or `undefined` if a matching frame was
     *     not found
     */
    public static find(frames: TermsOfUseFrame[], language?: string): TermsOfUseFrame {
        Guards.truthy(frames, "frames");
        return frames.find((f) => !language || f.language === language);
    }

    /**
     * Gets a specified terms of use frame from the list of frames, trying to match the language but
     * accepting one with a different language if a match was not found.
     * @param frames List of frames to search
     * @param language ISO-639-2 language code to match
     * @returns TermsOfUseFrame Frame containing the matching frame or `undefined` if a match was
     *     not found
     */
    public static findPreferred(frames: TermsOfUseFrame[], language: string): TermsOfUseFrame {
        Guards.truthy(frames, "frames");

        let bestFrame: TermsOfUseFrame;
        for (const f of frames) {
            if (f.language === language) {
                return f;
            }
            if (!bestFrame) {
                bestFrame = f;
            }
        }

        return bestFrame;
    }

    /** @inheritDoc */
    public clone(): Frame {
        const frame = TermsOfUseFrame.fromFields(this._language, this.textEncoding);
        frame.text = this.text;
        return frame;
    }

    /**
     * Returns a string representation of the frame.
     */
    public toString(): string { return this._text; }

    // #endregion

    // #region Protected Methods

    /** @inheritDoc */
    protected parseFields(data: ByteVector): void {
        if (data.length < 4) {
            throw new CorruptFileError("Not enough bytes in field");
        }

        this.textEncoding = data.get(0);
        this._language = data.subarray(1, 3).toString(StringType.Latin1);
        this.text = data.subarray(4).toString(this.textEncoding);
    }

    /** @inheritDoc */
    protected renderFields(version: number): ByteVector {
        const encoding = Frame.correctEncoding(this.textEncoding, version);

        return ByteVector.concatenate(
            encoding,
            ByteVector.fromString(this.language, StringType.Latin1),
            ByteVector.fromString(this.text, encoding)
        );
    }

    // #endregion
}
