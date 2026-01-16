export interface IFileMetadata {
    path: string;
    bitRate: number;
    sampleRate: number;
    durationInMilliseconds: number;
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
    lyrics: string;
    picture: Buffer | undefined;
    rating: number;
    composers: string[];
    conductor: string;
    beatsPerMinute: number;

    save(): void;
    loadAsync(): Promise<void>;
}
