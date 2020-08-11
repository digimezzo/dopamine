export interface FileMetadata {
    path: string;
    bitRate: number;
    sampleRate: number;
    duration: number;
    title: string;
    album: string;
    albumArtists: string[];
    artists: string[];
    genres: string[];
    comment: string;
    grouping: string;
    year: number;
    trackNumber: number;
    trackCount: number;
    discNumber: number;
    discCount: number;
    rating: number;
    lyrics: string;
    picture: Buffer;
}
