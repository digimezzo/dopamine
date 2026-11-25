/** Stable subset of the editor common patch API usable with TypeScript 4.9. */
export interface MetadataPatch {
    title?: string | null;
    artist?: string | null;
    artists?: string[];
    album?: string | null;
    albumArtist?: string | null;
    albumArtists?: string[];
    year?: number | null;
    genres?: string[];
    trackNumber?: number | null;
    trackTotal?: number | null;
    discNumber?: number | null;
    discTotal?: number | null;
    grouping?: string | null;
    comments?: string | null;
    composers?: string[];
    conductors?: string | null;
    bpm?: number | null;
    picture?: { data: Uint8Array; type: 'Cover (front)' }[] | null;
}
export function updateFile(path: string, patch: MetadataPatch, rating?: number): Promise<unknown>;

export interface FileMetadata {
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
    replayGainTrackGain: number;
    replayGainTrackPeak: number;
    replayGainAlbumGain: number;
    replayGainAlbumPeak: number;
}
export function readMetadata(path: string): Promise<FileMetadata>;
