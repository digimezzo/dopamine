import { Track } from '../../data/entities/track';
export class IndexableTrack extends Track {
    public constructor(
        private track: Track,
        public dateModifiedTicks: number,
        public folderId: number,
    ) {
        super(track.path);

        this.trackId = track.trackId;
        this.artists = track.artists;
        this.genres = track.genres;
        this.albumTitle = track.albumTitle;
        this.albumArtists = track.albumArtists;
        this.albumKey = track.albumKey;
        this.fileName = track.fileName;
        this.mimeType = track.mimeType;
        this.fileSize = track.fileSize;
        this.bitRate = track.bitRate;
        this.sampleRate = track.sampleRate;
        this.trackTitle = track.trackTitle;
        this.trackNumber = track.trackNumber;
        this.trackCount = track.trackCount;
        this.discNumber = track.discNumber;
        this.discCount = track.discCount;
        this.duration = track.duration;
        this.year = track.year;
        this.hasLyrics = track.hasLyrics;
        this.dateAdded = track.dateAdded;
        this.dateFileCreated = track.dateFileCreated;
        this.dateLastSynced = track.dateLastSynced;
        this.dateFileModified = track.dateFileModified;
        this.needsIndexing = track.needsIndexing;
        this.needsAlbumArtworkIndexing = track.needsAlbumArtworkIndexing;
        this.indexingSuccess = track.indexingSuccess;
        this.indexingFailureReason = track.indexingFailureReason;
        this.rating = track.rating;
        this.love = track.love;
        this.playCount = track.playCount;
        this.skipCount = track.skipCount;
        this.dateLastPlayed = track.dateLastPlayed;
    }
}
