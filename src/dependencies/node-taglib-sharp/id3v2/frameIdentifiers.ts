import {ByteVector, StringType} from "../byteVector";
import {NotSupportedError} from "../errors";

/**
 * @summary Represents the identifier of a frame, depending on the version this may be 3 or 4
 *     bytes. Provides a simple way to switch between the identifiers used for different versions.
 * @remarks This class is implemented in an attempt to unify frame identifiers, make it easy to
 *     switch versions, find frames between tags, and determine which frames are supported on which
 *     version of ID3v2.
 *     If you have a death wish, you can take your life into your own hands and construct your own
 *     FrameIdentifier for use in non-standard frames. This is VERY STRONGLY NOT ADVISED. Not only
 *     will you be breaking the ID3v2 standard making your frame not portable, but you will also
 *     have to ensure the FrameIdentifier instance you create is used everywhere the frame
 *     identifier is used.
 *     To make implementation and less memory intensive, FrameIdentifier instances for built-in
 *     frame identifiers are statically created and reused. This allows usage of the `===` to
 *     compare instances because they should always be the same.
 */
export class FrameIdentifier {
    private readonly _version2: ByteVector;
    private readonly _version3: ByteVector;
    private readonly _version4: ByteVector

    public constructor(v4: string, v3: string, v2: string) {
        if (!v4 && !v3 && !v2) {
            throw new Error("A frame identifier for at least one ID3v2 version must be supplied");
        }

        this._version4 = v4
            ? ByteVector.fromString(v4, StringType.Latin1).makeReadOnly()
            : undefined;
        this._version3 = v3
            ? (v3 === v4 ? this._version4 : ByteVector.fromString(v3, StringType.Latin1).makeReadOnly())
            : undefined;
        this._version2 = v2
            ? ByteVector.fromString(v2, StringType.Latin1).makeReadOnly()
            : undefined;
    }

    public get isTextFrame(): boolean {
        const t = 0x54; // T
        return (this._version2?.get(0) === t)
            || (this._version3?.get(0) === t)
            || (this._version4?.get(0) === t);
    }

    public get isUrlFrame(): boolean {
        const w = 0x57; // W
        return (this._version2?.get(0) === w)
            || (this._version3?.get(0) === w)
            || (this._version4?.get(0) === w);
    }

    public render(version: number): ByteVector {
        let bytesForVersion;
        switch (version) {
            case 2:
                bytesForVersion = this._version2;
                break;
            case 3:
                bytesForVersion = this._version3;
                break;
            case 4:
                bytesForVersion = this._version4;
                break;
            default:
                throw new Error("Argument error: version must be a value between 2 and 4");
        }

        if (!bytesForVersion) {
            throw new NotSupportedError(`Frame ${this.toString()} is not supported in ID3v2 version ${version}`);
        }

        return bytesForVersion;
    }

    public toString(): string {
        const newest = this._version4 || this._version3 || this._version2;
        return newest.toString(StringType.Latin1);
    }
}

/* eslint-disable @typescript-eslint/naming-convention */

// Pre-create the unique identifiers
const uniqueFrameIdentifiers: {[key: string]: FrameIdentifier} = {
    AENC: new FrameIdentifier("AENC", "AENC", "CRA"), // Audio encryption
    APIC: new FrameIdentifier("APIC", "APIC", "PIC"), // Attached picture
    ASPI: new FrameIdentifier("ASPI", undefined, undefined), // Audio seek point table
    COMM: new FrameIdentifier("COMM", "COMM", "COM"), // Comments
    COMR: new FrameIdentifier("COMR", "COMR", undefined), // Commercial frame
    CRM : new FrameIdentifier(undefined, undefined, "CRM"), // Encrypted meta-frame
    ENCR: new FrameIdentifier("ENCR", "ENCR", undefined), // Encryption method registration
    EQU2: new FrameIdentifier("EQU2", "EQUA", undefined), // Equalization
    ETCO: new FrameIdentifier("ETCO", "ETCO", "ETC"), // Event timing codes
    GEOB: new FrameIdentifier("GEOB", "GEOB", "GEO"), // General encapsulated object
    GRID: new FrameIdentifier("GRID", "GRID", undefined), // Group identification registration
    LINK: new FrameIdentifier("LINK", "LINK", "LNK"), // Linked information
    MCDI: new FrameIdentifier("MCDI", "MCDI", "MCI"), // Music CD identifier
    MLLT: new FrameIdentifier("MLLT", "MLLT", "MLL"), // MPEG location lookup table
    OWNE: new FrameIdentifier("OWNE", "OWNE", undefined), // Ownership frame
    PCNT: new FrameIdentifier("PCNT", "PCNT", "CNT"), // Play count
    POPM: new FrameIdentifier("POPM", "POPM", "POP"), // Popularimeter
    POSS: new FrameIdentifier("POSS", "POSS", undefined), // Position synchronization frame
    PRIV: new FrameIdentifier("PRIV", "PRIV", undefined), // Private frame
    RBUF: new FrameIdentifier("RBUF", "RBUF", "BUF"), // Recommended buffer size
    RVA2: new FrameIdentifier("RVA2", "RVAD", "RVA"), // Relative volume adjustment
    RVRB: new FrameIdentifier("RVRB", "RVRB", "REV"), // Reverb
    SEEK: new FrameIdentifier("SEEK", undefined, undefined), // Seek frame
    SIGN: new FrameIdentifier("SIGN", undefined, undefined), // Signature frame
    SYLT: new FrameIdentifier("SYLT", "SYLT", "SLT"), // Synchronized lyric/text
    SYTC: new FrameIdentifier("SYTC", "SYTC", "STC"), // Synchronized tempo codes
    TALB: new FrameIdentifier("TALB", "TALB", "TAL"), // Album/Movie/Show title
    TBPM: new FrameIdentifier("TBPM", "TBPM", "TBP"), // BPM
    TCMP: new FrameIdentifier("TCMP", "TCMP", undefined),   // iTunes only "compilation" flag
    TCOM: new FrameIdentifier("TCOM", "TCOM", "TCM"), // Composer
    TCON: new FrameIdentifier("TCON", "TCON", "TCO"), // Content type
    TCOP: new FrameIdentifier("TCOP", "TCOP", "TCR"), // Copyright message
    TDAT: new FrameIdentifier(undefined, "TDAT", "TDA"), // Date
    TDEN: new FrameIdentifier("TDEN", undefined, undefined), // Encoding time
    TDLY: new FrameIdentifier("TDLY", "TDLY", "TDY"), // Playlist delay
    TDOR: new FrameIdentifier("TDOR", "TORY", "TOR"), // Original release time
    TDRC: new FrameIdentifier("TDRC", undefined, undefined), // Recording time
    TDRL: new FrameIdentifier("TDRL", undefined, undefined), // Release time
    TDTG: new FrameIdentifier("TDTG", undefined, undefined), // Tagging time
    TENC: new FrameIdentifier("TENC", "TENC", "TEN"), // Encoded by
    TEXT: new FrameIdentifier("TEXT", "TEXT", "TXT"), // Lyricist/Text writer
    TFLT: new FrameIdentifier("TFLT", "TFLT", "TFT"), // File type
    TIME: new FrameIdentifier(undefined, "TIME", "TIM"), // Time
    TIPL: new FrameIdentifier("TIPL", "IPLS", "IPL"), // Involved people list
    TIT1: new FrameIdentifier("TIT1", "TIT1", "TT1"), // Content group description
    TIT2: new FrameIdentifier("TIT2", "TIT2", "TT2"), // Title/song name/content description
    TIT3: new FrameIdentifier("TIT3", "TIT3", "TT3"), // Subtitle/description refinement
    TKEY: new FrameIdentifier("TKEY", "TKEY", "TKE"), // Initial key
    TLAN: new FrameIdentifier("TLAN", "TLAN", "TLA"), // Language(s)
    TLEN: new FrameIdentifier("TLEN", "TLEN", "TLE"), // Length
    TMCL: new FrameIdentifier("TMCL", undefined, undefined), // Musician credit list
    TMED: new FrameIdentifier("TMED", "TMED", "TMT"), // Media type
    TMOO: new FrameIdentifier("TMOO", undefined, undefined), // Mood
    TOAL: new FrameIdentifier("TOAL", "TOAL", "TOT"), // Original album/movie/show title
    TOFN: new FrameIdentifier("TOFN", "TOFN", "TOF"), // Original filename
    TOLY: new FrameIdentifier("TOLY", "TOLY", "TOL"), // Original lyricist(s)/text writer(s)
    TOPE: new FrameIdentifier("TOPE", "TOPE", "TOA"), // Original artist(s)/performer(s)
    TOWN: new FrameIdentifier("TOWN", "TOWN", undefined), // File owner/licensee
    TPE1: new FrameIdentifier("TPE1", "TPE1", "TP1"), // Lead performer(s)/soloist(s)
    TPE2: new FrameIdentifier("TPE2", "TPE2", "TP2"), // Band/orchestra/accompaniment
    TPE3: new FrameIdentifier("TPE3", "TPE3", "TP3"), // Conductor/performer refinement
    TPE4: new FrameIdentifier("TPE4", "TPE4", "TP4"), // Interpreted, remixed, or otherwise modified by
    TPOS: new FrameIdentifier("TPOS", "TPOS", "TPA"), // Part of a set
    TPRO: new FrameIdentifier("TPRO", undefined, undefined), // Produced notice
    TPUB: new FrameIdentifier("TPUB", "TPUB", "TPB"), // Publisher
    TRCK: new FrameIdentifier("TRCK", "TRCK", "TRK"), // Track number/position in set
    TRDA: new FrameIdentifier(undefined, "TRDA", "TRD"), // Recording dates
    TRSN: new FrameIdentifier("TRSN", "TRSN", undefined), // Internet radio station name
    TRSO: new FrameIdentifier("TRSO", "TRSO", undefined), // Internet radio station owner
    TSIZ: new FrameIdentifier(undefined, "TSIZ", "TSI"), // Size
    TSO2: new FrameIdentifier("TSO2", "TSO2", undefined), // iTunes only "Album Artist Sort"
    TSOA: new FrameIdentifier("TSOA", undefined, undefined), // Album sort order
    TSOC: new FrameIdentifier("TSOC", "TSOC", undefined), // iTunes only "Composer Sort"
    TSOP: new FrameIdentifier("TSOP", undefined, undefined), // Performer sort order
    TSOT: new FrameIdentifier("TSOT", undefined, undefined), // Title sort order
    TSRC: new FrameIdentifier("TSRC", "TSRC", "TRC"), // ISRC (International standard recording code)
    TSSE: new FrameIdentifier("TSSE", "TSSE", "TSS"), // Software/hardware and setting used for encoding
    TSST: new FrameIdentifier("TSST", undefined, undefined), // Set subtitle
    TXXX: new FrameIdentifier("TXXX", "TXXX", "TXX"), // User defined text information frame
    TYER: new FrameIdentifier(undefined, "TYER", "TYE"), // Year
    UFID: new FrameIdentifier("UFID", "UFID", "UFI"), // Unique file identifier
    USER: new FrameIdentifier("USER", "USER", undefined), // Terms of use
    USLT: new FrameIdentifier("USLT", "USLT", "ULT"), // Unsynchronized lyric/text transcription
    WCOM: new FrameIdentifier("WCOM", "WCOM", "WCM"), // Commercial information URL
    WCOP: new FrameIdentifier("WCOP", "WCOP", "WCP"), // Copyright/legal information URL
    WOAF: new FrameIdentifier("WOAF", "WOAF", "WAF"), // Official audio file webpage URL
    WOAR: new FrameIdentifier("WOAR", "WOAR", "WAR"), // Official artist/performer webpage URL
    WOAS: new FrameIdentifier("WOAS", "WOAS", "WAS"), // Official audio source webpage URL
    WORS: new FrameIdentifier("WORS", "WORS", undefined), // Official internet radio station homepage URL
    WPAY: new FrameIdentifier("WPAY", "WPAY", undefined), // Payment URL
    WPUB: new FrameIdentifier("WPUB", "WPUB", "WPB"), // Publishers official webpage URL
    WXXX: new FrameIdentifier("WXXX", "WXXX", "WXX"), // User defined URL link frame
};

// Export all the frame identifiers
export const FrameIdentifiers: {[key: string]: FrameIdentifier} = {
    AENC: uniqueFrameIdentifiers.AENC,
    APIC: uniqueFrameIdentifiers.APIC,
    ASPI: uniqueFrameIdentifiers.ASPI,
    BUF:  uniqueFrameIdentifiers.RBUF,
    CNT:  uniqueFrameIdentifiers.PCNT,
    COM:  uniqueFrameIdentifiers.COMM,
    COMM: uniqueFrameIdentifiers.COMM,
    COMR: uniqueFrameIdentifiers.COMR,
    CRA:  uniqueFrameIdentifiers.AENC,
    CRM:  uniqueFrameIdentifiers.CRM,
    ENCR: uniqueFrameIdentifiers.ENCR,
    EQU2: uniqueFrameIdentifiers.EQU2,
    EQUA: uniqueFrameIdentifiers.EQU2,
    ETC:  uniqueFrameIdentifiers.ETCO,
    ETCO: uniqueFrameIdentifiers.ETCO,
    GEO:  uniqueFrameIdentifiers.GEOB,
    GEOB: uniqueFrameIdentifiers.GEOB,
    GRID: uniqueFrameIdentifiers.GRID,
    IPLS: uniqueFrameIdentifiers.TIPL,
    LINK: uniqueFrameIdentifiers.LINK,
    LNK:  uniqueFrameIdentifiers.LINK,
    MCDI: uniqueFrameIdentifiers.MCDI,
    MCI:  uniqueFrameIdentifiers.MCDI,
    MLL:  uniqueFrameIdentifiers.MLLT,
    MLLT: uniqueFrameIdentifiers.MLLT,
    OWNE: uniqueFrameIdentifiers.OWNE,
    PCNT: uniqueFrameIdentifiers.PCNT,
    PIC:  uniqueFrameIdentifiers.APIC,
    POP:  uniqueFrameIdentifiers.POPM,
    POPM: uniqueFrameIdentifiers.POPM,
    POSS: uniqueFrameIdentifiers.POSS,
    PRIV: uniqueFrameIdentifiers.PRIV,
    RBUF: uniqueFrameIdentifiers.RBUF,
    REV:  uniqueFrameIdentifiers.RVRB,
    RVA:  uniqueFrameIdentifiers.RVA2,
    RVA2: uniqueFrameIdentifiers.RVA2,
    RVAD: uniqueFrameIdentifiers.RVA2,
    RVRB: uniqueFrameIdentifiers.RVRB,
    SEEK: uniqueFrameIdentifiers.SEEK,
    SIGN: uniqueFrameIdentifiers.SIGN,
    SLT:  uniqueFrameIdentifiers.SYLT,
    STC:  uniqueFrameIdentifiers.SYTC,
    SYLT: uniqueFrameIdentifiers.SYLT,
    SYTC: uniqueFrameIdentifiers.SYTC,
    TAL:  uniqueFrameIdentifiers.TALB,
    TALB: uniqueFrameIdentifiers.TALB,
    TBP:  uniqueFrameIdentifiers.TBPM,
    TBPM: uniqueFrameIdentifiers.TBPM,
    TCM:  uniqueFrameIdentifiers.TCOM,
    TCMP: uniqueFrameIdentifiers.TCMP,
    TCO:  uniqueFrameIdentifiers.TCON,
    TCOM: uniqueFrameIdentifiers.TCOM,
    TCON: uniqueFrameIdentifiers.TCON,
    TCOP: uniqueFrameIdentifiers.TCOP,
    TCR:  uniqueFrameIdentifiers.TCOP,
    TDA:  uniqueFrameIdentifiers.TDAT,
    TDAT: uniqueFrameIdentifiers.TDAT,
    TDEN: uniqueFrameIdentifiers.TDEN,
    TDLY: uniqueFrameIdentifiers.TDLY,
    TDOR: uniqueFrameIdentifiers.TDOR,
    TDRC: uniqueFrameIdentifiers.TDRC,
    TDRL: uniqueFrameIdentifiers.TDRL,
    TDTG: uniqueFrameIdentifiers.TDTG,
    TDY:  uniqueFrameIdentifiers.TDLY,
    TEN:  uniqueFrameIdentifiers.TENC,
    TENC: uniqueFrameIdentifiers.TENC,
    TEXT: uniqueFrameIdentifiers.TEXT,
    TFLT: uniqueFrameIdentifiers.TFLT,
    TFT:  uniqueFrameIdentifiers.TFLT,
    TIM:  uniqueFrameIdentifiers.TIME,
    TIME: uniqueFrameIdentifiers.TIME,
    TIPL: uniqueFrameIdentifiers.TIPL,
    TIT1: uniqueFrameIdentifiers.TIT1,
    TIT2: uniqueFrameIdentifiers.TIT2,
    TIT3: uniqueFrameIdentifiers.TIT3,
    TKE:  uniqueFrameIdentifiers.TKEY,
    TKEY: uniqueFrameIdentifiers.TKEY,
    TLA:  uniqueFrameIdentifiers.TLAN,
    TLAN: uniqueFrameIdentifiers.TLAN,
    TLE:  uniqueFrameIdentifiers.TLEN,
    TLEN: uniqueFrameIdentifiers.TLEN,
    TMCL: uniqueFrameIdentifiers.TMCL,
    TMED: uniqueFrameIdentifiers.TMED,
    TMOO: uniqueFrameIdentifiers.TMOO,
    TMT:  uniqueFrameIdentifiers.TMED,
    TOA:  uniqueFrameIdentifiers.TOPE,
    TOAL: uniqueFrameIdentifiers.TOAL,
    TOF:  uniqueFrameIdentifiers.TOFN,
    TOFN: uniqueFrameIdentifiers.TOFN,
    TOL:  uniqueFrameIdentifiers.TOLY,
    TOLY: uniqueFrameIdentifiers.TOLY,
    TOPE: uniqueFrameIdentifiers.TOPE,
    TOR:  uniqueFrameIdentifiers.TDOR,
    TORY: uniqueFrameIdentifiers.TDOR,
    TOT:  uniqueFrameIdentifiers.TOAL,
    TOWN: uniqueFrameIdentifiers.TOWN,
    TP1:  uniqueFrameIdentifiers.TPE1,
    TP2:  uniqueFrameIdentifiers.TPE2,
    TP3:  uniqueFrameIdentifiers.TPE3,
    TP4:  uniqueFrameIdentifiers.TPE4,
    TPA:  uniqueFrameIdentifiers.TPOS,
    TPB:  uniqueFrameIdentifiers.TPUB,
    TPE1: uniqueFrameIdentifiers.TPE1,
    TPE2: uniqueFrameIdentifiers.TPE2,
    TPE3: uniqueFrameIdentifiers.TPE3,
    TPE4: uniqueFrameIdentifiers.TPE4,
    TPOS: uniqueFrameIdentifiers.TPOS,
    TPRO: uniqueFrameIdentifiers.TPRO,
    TPUB: uniqueFrameIdentifiers.TPUB,
    TRC:  uniqueFrameIdentifiers.TSRC,
    TRCK: uniqueFrameIdentifiers.TRCK,
    TRD:  uniqueFrameIdentifiers.TRDA,
    TRDA: uniqueFrameIdentifiers.TRDA,
    TRK:  uniqueFrameIdentifiers.TRCK,
    TRSN: uniqueFrameIdentifiers.TRSN,
    TRSO: uniqueFrameIdentifiers.TRSO,
    TSI:  uniqueFrameIdentifiers.TSIZ,
    TSIZ: uniqueFrameIdentifiers.TSIZ,
    TSO2: uniqueFrameIdentifiers.TSO2,
    TSOA: uniqueFrameIdentifiers.TSOA,
    TSOC: uniqueFrameIdentifiers.TSOC,
    TSOP: uniqueFrameIdentifiers.TSOP,
    TSOT: uniqueFrameIdentifiers.TSOT,
    TSRC: uniqueFrameIdentifiers.TSRC,
    TSS:  uniqueFrameIdentifiers.TSSE,
    TSSE: uniqueFrameIdentifiers.TSSE,
    TSST: uniqueFrameIdentifiers.TSST,
    TT1:  uniqueFrameIdentifiers.TIT1,
    TT2:  uniqueFrameIdentifiers.TIT2,
    TT3:  uniqueFrameIdentifiers.TIT3,
    TXT:  uniqueFrameIdentifiers.TEXT,
    TXX:  uniqueFrameIdentifiers.TXXX,
    TXXX: uniqueFrameIdentifiers.TXXX,
    TYE:  uniqueFrameIdentifiers.TYER,
    TYER: uniqueFrameIdentifiers.TYER,
    UFI:  uniqueFrameIdentifiers.UFID,
    UFID: uniqueFrameIdentifiers.UFID,
    ULT:  uniqueFrameIdentifiers.USLT,
    USER: uniqueFrameIdentifiers.USER,
    USLT: uniqueFrameIdentifiers.USLT,
    WAF:  uniqueFrameIdentifiers.WOAF,
    WAR:  uniqueFrameIdentifiers.WOAR,
    WAS:  uniqueFrameIdentifiers.WOAS,
    WCM:  uniqueFrameIdentifiers.WCOM,
    WCOM: uniqueFrameIdentifiers.WCOM,
    WCOP: uniqueFrameIdentifiers.WCOP,
    WCP:  uniqueFrameIdentifiers.WCOP,
    WOAF: uniqueFrameIdentifiers.WOAF,
    WOAR: uniqueFrameIdentifiers.WOAR,
    WOAS: uniqueFrameIdentifiers.WOAS,
    WORS: uniqueFrameIdentifiers.WORS,
    WPAY: uniqueFrameIdentifiers.WPAY,
    WPB:  uniqueFrameIdentifiers.WPUB,
    WPUB: uniqueFrameIdentifiers.WPUB,
    WXX:  uniqueFrameIdentifiers.WXXX,
    WXXX: uniqueFrameIdentifiers.WXXX,
};
