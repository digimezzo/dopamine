export class Track {
    constructor() {
    }

    public trackId: number;
    public artists: string;
    public genres: string;
    public albumTitle: string;
    public albumArtists: string;
    public albumKey: string;
    public path: string;
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
    public needsAlbumArtworkIndexing: number;
    public indexingSuccess: number;
    public indexingFailureReason: string;
    public rating: number;
    public love: number;
    public playCount: number;
    public skipCount: number;
    public dateLastPlayed: number;
}
