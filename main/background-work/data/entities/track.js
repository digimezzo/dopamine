class Track {
    constructor(path) {
        this.path = path;
        this.trackId = 0;
        this.artists = '';
        this.genres = '';
        this.albumTitle = '';
        this.albumArtists = '';
        this.albumKey = '';
        this.fileName = '';
        this.mimeType = '';
        this.fileSize = 0;
        this.bitRate = 0;
        this.sampleRate = 0;
        this.trackTitle = '';
        this.trackNumber = 0;
        this.trackCount = 0;
        this.discNumber = 0;
        this.discCount = 0;
        this.duration = 0;
        this.year = 0;
        this.hasLyrics = 0;
        this.dateAdded = 0;
        this.dateFileCreated = 0;
        this.dateLastSynced = 0;
        this.dateFileModified = 0;
        this.needsIndexing = 0;
        this.needsAlbumArtworkIndexing = 0;
        this.indexingSuccess = 1;
        this.indexingFailureReason = '';
        this.rating = 0;
        this.love = 0;
        this.playCount = 0;
        this.skipCount = 0;
        this.dateLastPlayed = 0;
        this.composers = '';
        this.conductor = '';
        this.beatsPerMinute = 0;
    }
}

exports.Track = Track;
