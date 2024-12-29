class FileMetadataMock {
    constructor(path) {
        this.path = path;
        this.bitRate = 0;
        this.sampleRate = 0;
        this.durationInMilliseconds = 0;
        this.title = '';
        this.album = '';
        this.albumArtists = [];
        this.artists = [];
        this.genres = [];
        this.comment = '';
        this.grouping = '';
        this.year = 0;
        this.trackNumber = 0;
        this.trackCount = 0;
        this.discNumber = 0;
        this.discCount = 0;
        this.lyrics = '';
        this.picture = undefined;
        this.rating = 0;
    }
}

exports.FileMetadataMock = FileMetadataMock;
