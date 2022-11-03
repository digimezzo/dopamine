import {ByteVector, StringType} from "../../byteVector";
import {Frame, FrameClassType} from "./frame";
import {Id3v2FrameHeader} from "./frameHeader";
import {FrameIdentifiers} from "../frameIdentifiers";
import {Guards, NumberUtils} from "../../utils";

/**
 * Type of channel data to get from or set to a {@link RelativeVolumeFrame} object
 */
export enum ChannelType {
    /**
     * Channel data for some other speaker
     */
    Other = 0x00,

    /**
     * Channel data for the master volume
     */
    MasterVolume = 0x01,

    /**
     * Channel data for the front right speaker
     */
    FrontRight = 0x02,

    /**
     * Channel data for front left speaker
     */
    FrontLeft = 0x03,

    /**
     * Channel data for center right speaker
     */
    BackRight = 0x04,

    /**
     * Channel data for back left speaker
     */
    BackLeft = 0x05,

    /**
     * Channel data for front center speaker
     */
    FrontCentre = 0x06,

    /**
     * Channel data for back center speaker
     */
    BackCenter = 0x07,

    /**
     * Channel data for subwoofer
     */
    Subwoofer = 0x08
}

export class ChannelData {
    private readonly _channel: ChannelType;
    private _peakBits: number;
    private _peakVolume: bigint;
    private _volumeAdjustment: number;

    public constructor(channel: ChannelType) {
        this._channel = channel;
    }

    public static fromData(bytes: ByteVector): ChannelData {
        Guards.truthy(bytes, "bytes");

        const channelType = bytes.get(0);
        const channelData = new ChannelData(channelType);
        channelData._volumeAdjustment = bytes.subarray(1, 2).toShort();
        channelData._peakBits = bytes.get(3);
        channelData._peakVolume = bytes.subarray(4).toUlong();
        return channelData;
    }

    public get channelType(): ChannelType { return this._channel; }

    public get isSet(): boolean {
        const volumeAdjustSet = !!this._volumeAdjustment;
        const peakSet = !!this._peakVolume && this._peakVolume !== NumberUtils.BIG_ZERO;
        return volumeAdjustSet || peakSet;
    }

    /**
     * Number of bits used to express the peak volume.
     */
    public get peakBits(): number { return this._peakBits; }
    /**
     * Number of bits used to express the peak volume.
     * @param value Bits used to express the peak volume. Must be an integer betweenInclusive 1 and 64
     */
    public set peakBits(value: number) {
        // @TODO: This should be calculated based on peak volume
        Guards.byte(value, "value");
        Guards.betweenInclusive(value, 1, 64, "value");
        this._peakBits = value;
    }

    /**
     * Value of the peak sample in the file. It's unclear exactly how this works, but the ID3v2.4
     * documentation explains this value as betweenInclusive 0 and 255 - but can be expressed using any
     * number of bits ({@link peakBits}).
     */
    public get peakVolume(): bigint { return this._peakVolume; }
    /**
     * Value of the peak sample in the file. It's unclear exactly how this works, but the ID3v2.4
     * documentation explains this value as betweenInclusive 0 and 255 - but can be expressed using any
     * number of bits ({@link peakBits}).
     * @param value Peak volume value. Must fit in the number of bits set in {@link peakBits}
     */
    public set peakVolume(value: bigint) {
        if (!this.peakBits) {
            throw new Error("Peak bits must be set before setting peak volume");
        }
        if (value < 0) {
            throw new Error("Argument out of range: value must be positive");
        }
        if (value > NumberUtils.bigPow(NumberUtils.BIG_TWO, this.peakBits) - NumberUtils.BIG_ONE) {
            throw new Error("Argument out of range: value must fit within number of bits defined by peakBits");
        }
        this._peakVolume = value;
    }

    /**
     * Volume adjustment of the track in dB.
     */
    public get volumeAdjustment(): number { return this._volumeAdjustment / 512; }
    /**
     * Volume adjustment of the track in dB. This value is expressed as a fixed-precision value
     * betweenInclusive -64 and 64. Don't worry about the math, we'll do it for you.
     * @param value Volume adjustment. Must be between -64 and 64, inclusive.
     */
    public set volumeAdjustment(value: number) {
        Guards.int(value, "value");
        Guards.betweenExclusive(value, -64, 64, "value");
        this._volumeAdjustment = Math.floor(value * 512);
    }

    public render(): ByteVector {
        if (!this.isSet) {
            return ByteVector.empty();
        }

        // NOTE: According to the docs, peak volume is to be stored in as few bytes as possible for
        // the number of bits used to encode it. For instance, 1-8 bits peak volume must be stored
        // in 1 byte, 8-16 in 2 bytes, etc.

        const peakByteCount = Math.ceil(this._peakBits / 8);
        return ByteVector.concatenate(
            this._channel,
            ByteVector.fromShort(this._volumeAdjustment),
            this._peakBits,
            ByteVector.fromUlong(this._peakVolume).subarray(8 - peakByteCount)
        );
    }
}

export class RelativeVolumeFrame extends Frame {
    private readonly _channels: ChannelData[] = new Array<ChannelData>(9);
    private _identification: string;

    // #region Constructors

    private constructor(header: Id3v2FrameHeader) {
        super(header);
        for (let i = 0; i < 9; i++) {
            this._channels[i] = new ChannelData(i);
        }
    }

    /**
     * Constructs and initializes a new instance with a specified identifier
     * @param identification Identification ot use for the new frame
     */
    public static fromIdentification(identification: string): RelativeVolumeFrame {
        const frame = new RelativeVolumeFrame(new Id3v2FrameHeader(FrameIdentifiers.RVA2));
        frame._identification = identification;
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version starting a specified offset.
     * @param data Raw representation of the new frame
     * @param offset Offset into `data` where the frame actually begins. Must be a
     *     positive, 32-bit integer
     * @param header Header of the frame found at `offset` in `data`
     * @param version ID3v2 version the frame was originally encoded with
     */
    public static fromOffsetRawData(
        data: ByteVector,
        offset: number,
        header: Id3v2FrameHeader,
        version: number
    ): RelativeVolumeFrame {
        Guards.truthy(data, "data");
        Guards.uint(offset, "offset");
        Guards.truthy(header, "header");
        Guards.byte(version, "version");

        const frame = new RelativeVolumeFrame(header);
        frame.setData(data, offset, false, version);
        return frame;
    }

    /**
     * Constructs and initializes a new instance by reading its raw data in a specified ID3v2
     * version.
     * @param data Raw representation of the new frame
     * @param version ID3v2 version the frame is encoded with. Must be a positive 8-bit integer.
     */
    public static fromRawData(data: ByteVector, version: number): RelativeVolumeFrame {
        Guards.truthy(data, "data");
        Guards.byte(version, "version");

        const frame = new RelativeVolumeFrame(Id3v2FrameHeader.fromData(data, version));
        frame.setData(data, 0, true, version);
        return frame;
    }

    // #endregion

    // #region Properties

    /** @inheritDoc */
    public get frameClassType(): FrameClassType { return FrameClassType.RelativeVolumeFrame; }

    /**
     * Gets the channels in the current instance that have a value
     */
    public get channels(): ChannelData[] { return this._channels.filter((c) => c.isSet); }

    /**
     * Gets the identification used for the current instance
     */
    public get identification(): string { return this._identification; }

    // #endregion

    // #region Public Methods

    /** @inheritDoc */
    public clone(): Frame {
        const frame = RelativeVolumeFrame.fromIdentification(this.identification);
        for (let i = 0; i < 9; i++) {
            frame._channels[i] = this._channels[i];
        }
        return frame;
    }

    /**
     * Gets a specified volume adjustment frame from the list of relative volume frames
     * @param frames List of frames to search
     * @param identification Identification to match
     * @returns RelativeVolumeFrame Frame containing the matching user or `undefined` if a match was
     *     not found
     */
    public static find(frames: RelativeVolumeFrame[], identification: string): RelativeVolumeFrame {
        Guards.truthy(frames, "frame");
        return frames.find((f) => f.identification === identification);
    }

    /**
     * Gets the number of bits used to encode the peak volume
     * @param type Which channel to get the value for
     */
    public getPeakBits(type: ChannelType): number { return this._channels[type].peakBits; }

    /**
     * Gets the peak volume for a specified channel
     * @param type Which channel to get the value for
     */
    public getPeakVolume(type: ChannelType): bigint { return this._channels[type].peakVolume; }

    /**
     * Gets the volume adjustment for the specified channel.
     * @param type Which channel to get the value for
     * @returns number Volume adjustment for the channel, can be betweenInclusive -64 and +64 decibels
     */
    public getVolumeAdjustment(type: ChannelType): number { return this._channels[type].volumeAdjustment; }

    /**
     * Sets the number of bits used to encode peak volume for a specified channel.
     * @param type Which channel to set the value for
     * @param value Peak volume
     */
    public setPeakBits(type: ChannelType, value: number): void { this._channels[type].peakBits = value; }

    /**
     * Sets the peak volume for a specified channel.
     * @param type Which channel to set the value for
     * @param value Peak volume
     */
    public setPeakVolume(type: ChannelType, value: bigint): void { this._channels[type].peakVolume = value; }

    /**
     * Sets the volume adjustment in decibels for the specified channel.
     * @param type Which channel to set the value for
     * @param value Volume adjustment in decibels. Must be betweenInclusive -64 and +64
     */
    public setVolumeAdjustment(type: ChannelType, value: number): void {
        this._channels[type].volumeAdjustment = value;
    }

    /**
     * Creates a text description of the current instance
     */
    public toString(): string {
        return this.identification;
    }

    // #endregion

    // #region Protected/Private Methods

    /** @inheritDoc */
    protected parseFields(data: ByteVector): void {
        const identifierEndIndex = data.find(ByteVector.getTextDelimiter(StringType.Latin1));
        if (identifierEndIndex < 0) {
            return;
        }

        this._identification = data.subarray(0, identifierEndIndex).toString(StringType.Latin1);

        let pos = identifierEndIndex + 1;
        while (pos < data.length) {
            const dataLength = 4 + Math.ceil(data.get(pos + 3) / 8);
            const dataBytes = data.subarray(pos, dataLength);

            // If we're at the end of the vector, we'll just end processing
            if (dataBytes.length !== dataLength) {
                break;
            }

            const channelData = ChannelData.fromData(dataBytes);
            this._channels[channelData.channelType] = channelData;
            pos += dataLength;
        }
    }

    /** @inheritDoc */
    protected renderFields(): ByteVector {
        const data = ByteVector.fromString(this.identification, StringType.Latin1);
        data.addByteVector(ByteVector.getTextDelimiter(StringType.Latin1));

        for (let i = 0; i < 9; i++) {
            if (!this._channels[i] || !this._channels[i].isSet) {
                continue;
            }

            data.addByteVector(this._channels[i].render());
        }

        return data;
    }

    // #endregion
}
