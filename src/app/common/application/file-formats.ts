export class FileFormats {
    // Audio extensions
    public static readonly mp3: string = '.mp3';
    public static readonly flac: string = '.flac';
    public static readonly ogg: string = '.ogg';
    public static readonly m4a: string = '.m4a';
    public static readonly opus: string = '.opus';
    public static readonly wav: string = '.wav';

    // Supported audio extensions
    public static readonly supportedAudioExtensions: string[] = [
        FileFormats.mp3,
        FileFormats.flac,
        FileFormats.ogg,
        FileFormats.m4a,
        FileFormats.opus,
        FileFormats.wav,
    ];
}
