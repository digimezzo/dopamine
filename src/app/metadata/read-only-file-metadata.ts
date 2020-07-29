import { FileMetadata } from './file-metadata';

export class ReadOnlyFileMetadata implements FileMetadata {
    constructor(public path: string) {

    }

    public bitRate: number;
    public sampleRate: number;
    public duration: number;
    public type: string;
    public mimeType: string;
    public title: string;
    public album: string;
    public albumArtists: string;
    public artists: string;
    public genres: string;
    public comment: string;
    public grouping: string;
    public year: number;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public rating: number;
    public lyrics: string;
}
