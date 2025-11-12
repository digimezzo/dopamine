class FileFormats {
    // Audio extensions
    static mp3 = '.mp3';
    static mp4 = '.mp4';
    static flac = '.flac';
    static ogg = '.ogg';
    static m4a = '.m4a';
    static opus = '.opus';
    static wav = '.wav';

    static supportedAudioExtensions = [
        FileFormats.mp3,
        FileFormats.mp4,
        FileFormats.flac,
        FileFormats.ogg,
        FileFormats.m4a,
        FileFormats.opus,
        FileFormats.wav,
    ];

    // Playlist extensions
    static m3u = '.m3u';
    static m3u8 = '.m3u8';

    static supportedPlaylistExtensions = [FileFormats.m3u, FileFormats.m3u8];

    // Playlist image extensions
    static png = '.png';
    static jpg = '.jpg';
    static jpeg = '.jpeg';

    static supportedPlaylistImageExtensions = [FileFormats.png, FileFormats.jpg, FileFormats.jpeg];
}

exports.FileFormats = FileFormats;
