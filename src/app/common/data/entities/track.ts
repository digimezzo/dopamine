export class Track {
    public constructor(public path: string) {
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
    }

    public trackId: number;
    public artists: string;
    public genres: string;
    public albumTitle: string;
    public albumArtists: string;
    public albumKey: string;
    public fileName: string;
    public mimeType: string;
    public fileSize: number;
    public bitRate: number;
    public sampleRate: number;
    public trackTitle: string;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public duration: number;
    public year: number;
    public hasLyrics: number;
    public dateAdded: number;
    public dateFileCreated: number;
    public dateLastSynced: number;
    public dateFileModified: number;
    public needsIndexing: number;
    public needsAlbumArtworkIndexing: number;
    public indexingSuccess: number;
    public indexingFailureReason: string;
    public rating: number;
    public love: number;
    public playCount: number;
    public skipCount: number;
    public dateLastPlayed: number;
}
