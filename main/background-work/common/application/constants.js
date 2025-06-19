class Constants {
    static cachedCoverArtMaximumSize = 360;
    static cachedCoverArtJpegQuality = 80;

    static externalCoverArtPatterns = [
        'front.png',
        'front.jpg',
        'front.jpeg',
        'cover.png',
        'cover.jpg',
        'cover.jpeg',
        'folder.png',
        'folder.jpg',
        'folder.jpeg',
        'albumart.png',
        'albumart.jpg',
        'albumart.jpeg',
        '%filename%.png',
        '%filename%.jpg',
        '%filename%.jpeg',
    ];
}

exports.Constants = Constants;
