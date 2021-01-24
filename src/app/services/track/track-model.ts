import { Track } from '../../data/entities/track';

export class TrackModel {
    constructor(private track: Track) {}

    public get path(): string {
        return this.track.path;
    }

    public get trackNumber(): number {
        return this.track.trackNumber;
    }

    public get trackTitle(): string {
        return this.track.trackTitle;
    }

    public get artists(): string[] {
        // return this.track.artists;
        return [];
    }

    public get duration(): number {
        return this.track.duration;
    }
}
