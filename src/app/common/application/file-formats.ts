export class FileFormats {
    // Audio extensions
    public static readonly mp3: string = '.mp3';
    public static readonly mp4: string = '.mp4';
    public static readonly flac: string = '.flac';
    public static readonly ogg: string = '.ogg';
    public static readonly m4a: string = '.m4a';
    public static readonly opus: string = '.opus';
    public static readonly wav: string = '.wav';

    public static readonly supportedAudioExtensions: string[] = [
        FileFormats.mp3,
        FileFormats.mp4,
        FileFormats.flac,
        FileFormats.ogg,
        FileFormats.m4a,
        FileFormats.opus,
        FileFormats.wav,
    ];

    // Playlist extensions
    public static readonly m3u: string = '.m3u';
    public static readonly m3u8: string = '.m3u8';

    public static readonly supportedPlaylistExtensions: string[] = [FileFormats.m3u, FileFormats.flac];

    // Playlist image extensions
    public static readonly png: string = '.png';
    public static readonly jpg: string = '.jpg';
    public static readonly jpeg: string = '.jpeg';

    public static readonly supportedPlaylistImageExtensions: string[] = [FileFormats.png, FileFormats.jpg, FileFormats.jpeg];
}
