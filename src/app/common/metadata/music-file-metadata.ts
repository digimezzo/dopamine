import { readMetadata, updateFile } from '../../../../main/metadata/music-metadata-adapter';
import { IFileMetadata } from './i-file-metadata';

export class MusicFileMetadata implements IFileMetadata {
    private _rating: number = 0;
    private ratingHasChanged: boolean = false;

    public constructor(public path: string) {}

    public bitRate: number = 0;
    public sampleRate: number = 0;
    public durationInMilliseconds: number = 0;
    public title: string = '';
    public album: string = '';
    public albumArtists: string[] = [];
    public artists: string[] = [];
    public genres: string[] = [];
    public comment: string = '';
    public grouping: string = '';
    public year: number = 0;
    public trackNumber: number = 0;
    public trackCount: number = 0;
    public discNumber: number = 0;
    public discCount: number = 0;
    public lyrics: string = '';
    public picture: Buffer | undefined;
    public composers: string[] = [];
    public conductor: string = '';
    public beatsPerMinute: number = 0;
    public replayGainTrackGain: number = 0;
    public replayGainTrackPeak: number = 0;
    public replayGainAlbumGain: number = 0;
    public replayGainAlbumPeak: number = 0;

    public get rating(): number {
        return this._rating;
    }
    public set rating(v: number) {
        this._rating = v;
        this.ratingHasChanged = true;
    }

    public async save(): Promise<void> {
        await updateFile(
            this.path,
            {
                title: this.title.length > 0 ? this.title : null,
                artist: this.artists.length > 0 ? this.artists.join('; ') : null,
                artists: this.artists,
                album: this.album.length > 0 ? this.album : null,
                albumartists: this.albumArtists,
                year: this.year > 0 ? this.year : null,
                genre: this.genres,
                track: { no: this.trackNumber > 0 ? this.trackNumber : null, of: this.trackCount > 0 ? this.trackCount : null },
                disk: { no: this.discNumber > 0 ? this.discNumber : null, of: this.discCount > 0 ? this.discCount : null },
                grouping: this.grouping.length > 0 ? this.grouping : null,
                comment: this.comment.length > 0 ? this.comment : null,
                composer: this.composers,
                conductor: this.conductor.length > 0 ? this.conductor : null,
                bpm: this.beatsPerMinute > 0 ? this.beatsPerMinute : null,
                picture: this.picture ? [{ data: this.picture, type: 'Cover (front)' }] : null,
            },
            this.ratingHasChanged ? this.rating : undefined,
        );
        this.ratingHasChanged = false;
    }

    public async loadAsync(): Promise<void> {
        const metadata = await readMetadata(this.path);
        const { rating, ...fields } = metadata;
        Object.assign(this, fields);
        this._rating = rating;
        this.ratingHasChanged = false;
    }
}
