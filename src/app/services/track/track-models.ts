import { TrackModel } from './track-model';

export class TrackModels {
    private _totalDurationInMilliseconds: number = 0;
    private _totalFileSizeInBytes: number = 0;

    constructor() {}

    public tracks: TrackModel[] = [];

    public get totalDurationInMilliseconds(): number {
        return this._totalDurationInMilliseconds;
    }

    public get totalFileSizeInBytes(): number {
        return this._totalFileSizeInBytes;
    }

    public get numberOfTracks(): number {
        return this.tracks.length;
    }

    public addTrack(track: TrackModel): void {
        if (track == undefined) {
            return;
        }

        this.tracks.push(track);
        this._totalDurationInMilliseconds += track.durationInMilliseconds;
        this._totalFileSizeInBytes += track.fileSizeInBytes;
    }
}
