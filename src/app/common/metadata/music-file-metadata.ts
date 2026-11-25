import { isDeepStrictEqual } from 'util';
import { MetadataPatch, readMetadata, updateFile } from '../../../../main/metadata/music-metadata-adapter';
import { IFileMetadata } from './i-file-metadata';

export class MusicFileMetadata implements IFileMetadata {
    private _rating: number = 0;
    private ratingHasChanged: boolean = false;

    private savedFields: MetadataPatch;

    public constructor(public path: string) {
        this.savedFields = this.editableFields();
    }

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

    private editableFields(): MetadataPatch {
        return {
            title: this.title.length > 0 ? this.title : null,
            artist: this.artists.length > 0 ? this.artists.join('; ') : null,
            artists: [...this.artists],
            album: this.album.length > 0 ? this.album : null,
            albumArtist: this.albumArtists.length > 0 ? this.albumArtists.join('; ') : null,
            albumArtists: [...this.albumArtists],
            year: this.year > 0 ? this.year : null,
            genres: [...this.genres],
            trackNumber: this.trackNumber > 0 ? this.trackNumber : null,
            trackTotal: this.trackCount > 0 ? this.trackCount : null,
            discNumber: this.discNumber > 0 ? this.discNumber : null,
            discTotal: this.discCount > 0 ? this.discCount : null,
            grouping: this.grouping.length > 0 ? this.grouping : null,
            comments: this.comment.length > 0 ? this.comment : null,
            composers: [...this.composers],
            conductors: this.conductor.length > 0 ? this.conductor : null,
            bpm: this.beatsPerMinute > 0 ? this.beatsPerMinute : null,
            picture: this.picture ? [{ data: Buffer.from(this.picture), type: 'Cover (front)' }] : null,
        };
    }

    public async save(): Promise<void> {
        const fields = this.editableFields();
        const patch = { ...fields };
        for (const key of Object.keys(fields) as (keyof MetadataPatch)[]) {
            if (isDeepStrictEqual(fields[key], this.savedFields[key])) {
                delete patch[key];
            }
        }
        if (!this.ratingHasChanged && Object.keys(patch).length === 0) {
            return;
        }
        await updateFile(this.path, patch, this.ratingHasChanged ? this.rating : undefined);
        this.savedFields = fields;
        this.ratingHasChanged = false;
    }

    public async loadAsync(): Promise<void> {
        const metadata = await readMetadata(this.path);
        const { rating, ...fields } = metadata;
        Object.assign(this, fields);
        this.savedFields = this.editableFields();
        this._rating = rating;
        this.ratingHasChanged = false;
    }
}
