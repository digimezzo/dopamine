import {ByteVector} from "../byteVector";
import {CorruptFileError} from "../errors";
import {ILosslessAudioCodec, MediaTypes} from "../properties";
import {Guards} from "../utils";

/**
 * Defines the format of waveform-audio data. Only format information common to all waveform-audio
 * data formats is included in this structure.
 * https://docs.microsoft.com/en-us/previous-versions/dd757713(v=vs.85)
 */
export default class RiffWaveFormatEx implements ILosslessAudioCodec {
    public static readonly CHUNK_FOURCC = "fmt ";

    // This list was put together from the Windows 10 SDK mmreg.h header file
    // If any of these descriptions are wrong or out of date, please open a PR.
    public static readonly WAVE_FORMAT_TAGS: Map<number, string> = new Map<number, string>([
        [0x0000, "Unknown Wave Format"],
        [0x0001, "PCM Audio"],
        [0x0002, "Microsoft ADPCM"],
        [0x0003, "PCM Audio in IEEE Floating-Point Format"],
        [0x0004, "Compaq VSELP Audio"],
        [0x0005, "IBM CVSD Audio"],
        [0x0006, "Microsoft ALAW Audio"],
        [0x0007, "Microsoft MULAW Audio"],
        [0x0008, "Microsoft DTS Audio"],
        [0x0009, "Microsoft DRM Encrypted Audio"],
        [0x000A, "Microsoft Speech Ausio"],
        [0x000B, "Microsoft Windows Media RT Voice Audio"],
        [0x0010, "OKI ADPCM Audio"],
        [0x0011, "Intel ADPCM Audio"],
        [0x0012, "Videologic MediaSpace ADPCM Audio"],
        [0x0013, "Sierra ADPCM Audio"],
        [0x0014, "Antex G723 ADPCM Audio"],
        [0x0015, "DSP Solutions DIGISTD Audio"],
        [0x0016, "DSP Solutions DIGIFIX Audio"],
        [0x0017, "Dialogic OKI ADPCM Audio"],
        [0x0018, "Media Vision ADPCM Audio for Jazz 16"],
        [0x0019, "HP CU Audio"],
        [0x001A, "HP Dynamic Voice Audio"],
        [0x0020, "Yamaha ADPCM Audio"],
        [0x0021, "Speech Compression Sonarc Audio"],
        [0x0022, "DSP Group True Speech Audio "],
        [0x0023, "Echo Speech Audio"],
        [0x0024, "Virtual Music Audiofile AF36 Audio"],
        [0x0025, "Audio Processing Technology APTX Audio"],
        [0x0026, "Virtual Music Audiofile AF10 Audio"],
        [0x0027, "Aculab Prosody 1612 Speech Card Audio"],
        [0x0028, "Merging Technologies LRC Audio"],
        [0x0030, "Dolby AC2 Audio"],
        [0x0031, "Microsoft Corporation GSM6.10 Audio"],
        [0x0032, "Microsoft Corporation MSN Audio"],
        [0x0033, "Antex ADPCME Audio"],
        [0x0034, "Control Resources VQLPC Audio"],
        [0x0035, "DSP Solutions Digireal Audio"],
        [0x0036, "DSP Solutions DigiADPCM Audio"],
        [0x0037, "Control Resources CR10 Audio"],
        [0x0038, "Natural MicroSystems  VBXADPCM Audio"],
        [0x0039, "Crystal Semiconductor IMA ADPCM Audio"],
        [0x003A, "Echo Speech Corporation Proprietary Audio Compression Format"],
        [0x003B, "Rockwell ADPCM Audio"],
        [0x003C, "Rockwell DIGITALK Audio"],
        [0x003D, "Xebec Multimedia Solutions Proprietary Audio Compression Format"],
        [0x0040, "Antex G721 ADPCM Audio"],
        [0x0041, "Antex G728 CELP Audio"],
        [0x0042, "Microsoft MSG723 Audio"],
        [0x0043, "Intel G.723.1 Audio"],
        [0x0044, "Intel G.729 Audio"],
        [0x0045, "Sharp G.726 Audio"],
        [0x0050, "Microsoft Corporation MPEG Audio"],
        [0x0052, "InSoft RT24 Audio"],
        [0x0053, "InSoft PAC Audio"],
        [0x0055, "ISO/MPEG Layer 3 Audio"],
        [0x0059, "Lucent G.723"],
        [0x0060, "Cirrus Logic Audio"],
        [0x0061, "ESS Technology PCM Audio"],
        [0x0062, "Voxware Audio"],
        [0x0063, "Canopus ATRAC Audio"],
        [0x0064, "APICOM G.726 Audio"],
        [0x0065, "APICOM G.722 Audio"],
        [0x0066, "Microsoft DSAT Audio"],
        [0x0067, "Microsoft DSAT Display Audio"],
        [0x0069, "Voxware Byte Aligned Audio"],
        [0x0070, "Voxware AC8 Audio"],
        [0x0071, "Voxware AC10 Audio"],
        [0x0072, "Voxware AC16 Audio"],
        [0x0073, "Voxware AC20 Audio"],
        [0x0074, "Voxware RT24 Audio"],
        [0x0075, "Voxware RT29 Audio"],
        [0x0076, "Voxware RT29HW Audio"],
        [0x0077, "Voxware VR12 Audio"],
        [0x0078, "Voxware VR18 Audio"],
        [0x0079, "Voxware TQ40 Audio"],
        [0x007A, "Voxware SC3 Audio"],
        [0x007B, "Voxware SC3.1 Audio"],
        [0x0080, "Softsound Audio"],
        [0x0081, "Voxware TQ60 Audio"],
        [0x0082, "Microsoft RT24"],
        [0x0083, "AT&T G.729A Audio"],
        [0x0084, "Motion Pixels MVI2 Audio"],
        [0x0085, "DataFusion Systems G.726 Audio"],
        [0x0086, "DataFusion Systems GSM610 Audio"],
        [0x0088, "Iterated Systems Audio"],
        [0x0089, "OnLive! Audio"],
        [0x008A, "Multitude FT SX20 Audio"],
        [0x008B, "Infocom ITS G.721 Audio"],
        [0x008C, "Convedia G.729 Audio"],
        [0x008D, "Congruency Audio"],
        [0x0091, "Siemens Business Communications 24 Audio"],
        [0x0092, "Sonic Foundry Dolby AC3 Audio"],
        [0x0093, "MediaSonic G.723 Audio"],
        [0x0094, "Aculab Prosody CTI Speech Card Audio"],
        [0x0097, "ZyXEL ADPCM Audio"],
        [0x0098, "Philips Speech Processing LPCBB Audio"],
        [0x0099, "Studer Professional PACKED Audio"],
        [0x00A0, "Malden Electronics Phony Talk Audio"],
        [0x00A1, "Racal Recorders GSM Audio"],
        [0x00A2, "Racal Recorders G.720.a Audio"],
        [0x00A3, "Racal Recorders G.723.1  Audio"],
        [0x00A4, "Racal Recorders Tetra ACELP Audio"],
        [0x00B0, "NEC AAC Audio"],
        [0x00FF, "AAC1 Audio"],
        [0x0100, "Rhetorex ADPCM Audio"],
        [0x0101, "BeCubed IRAT Audio"],
        [0x0111, "Vivo G.723 Audio"],
        [0x0112, "Vivo Siren Audio"],
        [0x0120, "Philips Speech Processing CELP Audio"],
        [0x0121, "Philips Speech Processing Grundig Audio"],
        [0x0123, "DEC G.723 Audio"],
        [0x0125, "Sanyo LD-ADPCM Audio"],
        [0x0130, "Sipro Lab ACEPLNET Audio"],
        [0x0131, "Sipro Lab ACELP4800 Audio"],
        [0x0132, "Sipro Lab ACELP8v3 Audio"],
        [0x0133, "Sipro Lab G.729 Audio"],
        [0x0134, "Sipro Lab G.729.a Audio"],
        [0x0135, "Sipro Lab Kelvin Audio"],
        [0x0136, "VoiceAge AMR Audio"],
        [0x0140, "Dictaphone G.726 Audio"],
        [0x0141, "Dictaphone CELP68 Audio"],
        [0x0142, "Dictaphone CELP54 Audio"],
        [0x0150, "Qualcomm PureVoice Audio"],
        [0x0151, "Qualcomm Half Rate Audio"],
        [0x0155, "Ring Zero Systems TUBGSM Audio"],
        [0x0160, "Microsoft WMA1 Audio"],
        [0x0161, "Microsoft WMA2 Audio"],
        [0x0162, "Microsoft Multichannel WMA Audio"],
        [0x0163, "Microsoft Lossless WMA Audio"],
        [0x0164, "Microsoft WMA SPDIF Audio"],
        [0x0170, "Unisys NAP ADPCM Audio"],
        [0x0171, "Unisys NAP ULAW Audio"],
        [0x0172, "Unisys NAP ALAW Audio"],
        [0x0173, "Unisys NAP 16K Audio"],
        [0x0174, "SyCom ACM SYC008 Audio"],
        [0x0175, "SyCom ACM SYC701 G.726L Audio"],
        [0x0176, "SyCom ACM SYC701 CELP54 Audio"],
        [0x0177, "SyCom ACM SYC701 CELP68 Audio"],
        [0x0178, "Knowledge Adventure ADPCM Audio"],
        [0x0180, "Fraunhofer IIS MPEG-2/AAC Audio"],
        [0x0190, "Digital Theatre Systems DTS DS Audio"],
        [0x0200, "Creative Labs ADPCM Audio"],
        [0x0202, "Creative Labs FastSpeech8 Audio"],
        [0x0203, "Creative Labs FastSpeech10 Audio"],
        [0x0210, "UHER Informatic ADPCM Audio"],
        [0x0215, "Ulead Systems DV Audio"],
        [0x0216, "Ulead Systems DV Audio 1"],
        [0x0220, "Quarterdeck Audio"],
        [0x0230, "I-Link Worldwide VC Audio"],
        [0x0240, "Aureal Semiconductor Raw Sport Audio"],
        [0x0241, "ESS Technology AC3 Audio"],
        [0x0249, "Generic Passthru Audio"],
        [0x0250, "Interactive Products HSX Audio"],
        [0x0251, "Interactive Products RPELP Audio"],
        [0x0260, "Consistent Software CS2 Audio"],
        [0x0270, "Sony SCX Audio"],
        [0x0271, "Sony SCY Audio"],
        [0x0272, "Sony ATRAC3 Audio"],
        [0x0273, "Sony SPC Audio"],
        [0x0280, "Telum Audio"],
        [0x0281, "Telum IA Audio"],
        [0x0285, "Norcom Electronics ADPCM Audio"],
        [0x0300, "Fujitsu FM Towns Sound"],
        [0x0350, "Micronas Semiconductors Audio"],
        [0x0351, "Micronas Semiconductors CELP833 Audio"],
        [0x0400, "Brooktree BTV Digital Audio"],
        [0x0401, "Intel Music Coder"],
        [0x0402, "Ligos Indeo Audio"],
        [0x0450, "QDesign Music"],
        [0x0500, "On2 VP7 Audio"],
        [0x0501, "On2 VP6 Audio"],
        [0x0680, "AT&T Labs VMPCM Audio"],
        [0x0681, "AT&T TPC Audio"],
        [0x08AE, "Clearjump LightWave Lossless Audio"],
        [0x1000, "Ing. C. Olivetti & C. GSM Audio"],
        [0x1001, "Ing. C. Olivetti & C. PCM Audio"],
        [0x1002, "Ing. C. Olivetti & C. CELP Audio"],
        [0x1003, "Ing. C. Olivetti & C. SBC Audio"],
        [0x1004, "Ing. C. Olivetti & C. OPR Audio"],
        [0x1100, "Lernout & Hauspie Audio"],
        [0x1101, "Lernout & Hauspie CELP Audio"],
        [0x1102, "Lernout & Hauspie SBC8 Audio"],
        [0x1103, "Lernout & Hauspie SBC12 Audio"],
        [0x1104, "Lernout & Hauspie SBC16 Audio"],
        [0x1400, "Norris Audio"],
        [0x1401, "ISIAudio Audio 2"],
        [0x1500, "AT&T Soundspace Musiccompress Audio"],
        [0x1600, "Microsoft MPEG-2 ADTS AAC Audio"],
        [0x1601, "Microsoft MPEG-2 RAW AAC Audio"],
        [0x1602, "Microsoft MPEG-4 Transport Streams (LOAS/LATM) Audio"],
        [0x1608, "Microsoft Nokia MPEG-2 ADTS AAC Audio"],
        [0x1609, "Microsoft Nokia MPEG-2 Raw AAC Audio"],
        [0x160A, "Microsoft Vodafone MPEG-2 ADTS AAC Audio"],
        [0x160B, "Microsoft Vodafone MPEG-2 Raw AAC Audio"],
        [0x1610, "Microsoft MPEG-2 AAC or MPEG-4 HE-AAC"],
        [0x181C, "Voxware RT24 Speech Audio"],
        [0x1971, "Sonic Foundry Lossless Audio"],
        [0x1979, "Innings Telecom ADPCM Audio"],
        [0x1C07, "Lucent SX8300P Audio"],
        [0x1C0C, "Lucent SX5363S Audio"],
        [0x1F03, "CUSeeMe Audio"],
        [0x1FC4, "NTCSoft ALF2CM ACM Audio"],
        [0x2000, "FAST Multimedia DVM Audio"],
        [0x2001, "DTS2 Audio"],
        [0x3313, "MakeAVIs Audio"],
        [0x4143, "Divio MPEG-4 AAC Audio"],
        [0x4201, "Nokia Adaptive Multirate Audio"],
        [0x4243, "Divio G.726 Audio"],
        [0x434C, "LEAD Technologies Speech Audio"],
        [0x564C, "LEAD Technologies Vorbis Audio"],
        [0x5756, "xiph.org Wavpack Audio"],
        [0x6C61, "Apple Lossless Audio Codec"],
        [0x674F, "Ogg Vorbis Mode 1 Audio"],
        [0x6750, "Ogg Vorbis Mode 2 Audio"],
        [0x6751, "Ogg Vorbis Mode 3 Audio"],
        [0x676F, "Ogg Vorbis Mode 1+ Audio"],
        [0x6770, "Ogg Vorbis Mode 2+ Audio"],
        [0x6771, "Ogg Vorbis Mode 3+ Audio"],
        [0x7000, "3COM NBX Audio"],
        [0x704F, "Ogg Opus Audio"],
        [0x706D, "FAAD AAC Audio"],
        [0x7361, "AMR Narrowband Audio"],
        [0x7362, "AMR Wideband Audio"],
        [0x7363, "AMR Wideband Plus Audio"],
        [0x7A21, "GSMA/3GPP CBR Audio"],
        [0x7A22, "GSMA/3GPP VBR Audio"],
        [0xA100, "Comverse Infosys G.723.1 Audio"],
        [0xA101, "Comverse Infosys AVQSBC Audio"],
        [0xA102, "Comverse Infosys SBC Audio"],
        [0xA103, "Symbol Technologies G.729.a Audio"],
        [0xA104, "VoiceAge AMR Wideband Audio"],
        [0xA105, "Ingenient Technologies G.726 Audio"],
        [0xA106, "ISO/MPEG-4 AAC Audio"],
        [0xA107, "Encore Software G.726 Audio"],
        [0xA108, "ZOLL Medical ASAO Audio"],
        [0xA109, "xiph.org Speex Audio"],
        [0xA10A, "Vianix MASC Audio"],
        [0xA10B, "Microsoft Windows Media 9 Spectrum Analyzer Audio"],
        [0xA10C, "Microsoft Windows Media Foundation Spectrum Analyzer Audio"],
        [0xA10D, "GSM 610 Audio"],
        [0xA10E, "GSM 620 Audio"],
        [0xA10F, "GSM 660 Audio"],
        [0xA110, "GSM 690 Audio"],
        [0xA111, "GSM Adaptive Multirate Wideband Audio"],
        [0xA112, "Polycom G.722 Audio"],
        [0xA113, "Polycom G.728 Audio"],
        [0xA114, "Polycom G.729.a Audio"],
        [0xA115, "Polycom Siren Audio"],
        [0xA116, "Global IP ILBC Audio"],
        [0xA117, "RadioTime Time Shift Radio Audio"],
        [0xA118, "Nice Systems ACA Audio"],
        [0xA119, "Nice Systems ADPCM Audio"],
        [0xA11A, "Vocord Telecom G.721 Audio"],
        [0xA11B, "Vocord Telecom G.726 Audio"],
        [0xA11C, "Vocord Telecom G.722.1 Audio"],
        [0xA11D, "Vocord Telecom G.728 Audio"],
        [0xA11E, "Vocord Telecom G.729 Audio"],
        [0xA11F, "Vocord Telecom G.729.a Audio"],
        [0xA120, "Vocord Telecom G.723.1 Audio"],
        [0xA121, "Vocord Telecom LBC Audio"],
        [0xA122, "Nice Systems G.728 Audio"],
        [0xA123, "France Telecom G.729 Audio"],
        [0xA124, "CODIAN Audio"],
        [0xF1AC, "FLAC Audio"],
    ]);

    private readonly _averageBytesPerSecond: number;
    private readonly _bitsPerSample: number;
    private readonly _blockAlign: number;
    private readonly _channels: number;
    private readonly _formatTag: number;
    private readonly _samplesPerSecond: number;

    /**
     * Constructs and initializes a new instance of a RIFF wave format header from the provided
     * data.
     * @param data Byte vector that contains the raw header
     */
    public constructor(data: ByteVector) {
        // @TODO: Pass in data size so we can calculate duration
        Guards.truthy(data, "data");
        if (data.length < 16) {
            throw new CorruptFileError("WAVE format data is too short");
        }

        this._formatTag = data.subarray(0, 2).toUshort(false);
        this._channels = data.subarray(2, 2).toUshort(false);
        this._samplesPerSecond = data.subarray(4, 4).toUint(false);
        this._averageBytesPerSecond = data.subarray(8, 4).toUint(false);
        this._blockAlign = data.subarray(12, 2).toUshort(false);
        this._bitsPerSample = data.subarray(14, 2).toUshort(false);
    }

    // #region Properties

    /** @inheritDoc */
    public get audioBitrate(): number { return this.averageBytesPerSecond * 8 / 1000; }

    /** @inheritDoc */
    public get audioChannels(): number { return this._channels; }

    /** @inheritDoc */
    public get audioSampleRate(): number { return this._samplesPerSecond; }

    /**
     * Gets the average data-transfer rate, in bytes per second, of audio described by the current
     * instance.
     */
    public get averageBytesPerSecond(): number { return this._averageBytesPerSecond; }

    /**
     * @inheritDoc
     * @remarks Some compression schemes cannot define a value for this field, so it may be `0`.
     *     This is especially common for MP3 audio embedded in an AVI.
     */
    public get bitsPerSample(): number { return this._bitsPerSample; }

    /**
     * Gets the block alignment, in bytes. Block alignment is the minimum atomic unit of data for
     * {@see formatTag} format type.
     */
    public get blockAlign(): number { return this._blockAlign; }

    /** @inheritDoc */
    public get description(): string {
        const fourccString = this._formatTag.toString(16).padStart(4, "0").toUpperCase();
        const formatString = RiffWaveFormatEx.WAVE_FORMAT_TAGS.get(this._formatTag) || "Unknown Audio Format";
        return `${formatString} [0x${fourccString}]`;
    }

    /**
     * @inheritDoc
     * @remarks Duration cannot be found from this object
     */
    public get durationMilliseconds(): number { return 0; }

    /**
     * Gets the format tag of the audio described by the current instance.
     * @remarks Format tags indicate the codec of the audio contained in the file and are
     *     contained in a Microsoft registry. For a description of the format, use
     *     {@link description}. The complete list can be found in the Win32 mmreg.h SDK header file
     */
    public get formatTag(): number { return this._formatTag; }

    /**
     * @inheritDoc
     * @remarks Technically any audio format can be encapsulated with a RIFF header since RIFF is
     *     simply a "Resource Interchange File Format". It is entirely possible to encapsulate a
     *     lossy format (and indeed, lossy WMA must be encapsulated) with a RIFF header. Therefore
     *     this designation as lossless is somewhat misleading and checking {@link description} is
     *     necessary to verify the codec being used is lossless or not.
     */
    public get mediaTypes(): MediaTypes {
        // @TODO: This isn't guaranteed. Consider determining the description and mediatype as part
        //    of construction.
        return MediaTypes.LosslessAudio;
    }

    // #endregion
}
