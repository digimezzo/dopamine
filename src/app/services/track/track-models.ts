import { TrackModel } from './track-model';

export class TrackModels {
    constructor() {}

    public tracks: TrackModel[] = [];

    public totalDurationInMilliseconds: number = 0;

    public totalFileSizeInBytes: number = 0;

    public addTrack(track: TrackModel): void {
        if (track == undefined) {
            return;
        }

        this.tracks.push(track);
        this.totalDurationInMilliseconds += track.durationInMilliseconds;
        this.totalFileSizeInBytes += track.fileSizeInBytes;
    }
}
