import { DataDelimiter } from '../../data/data-delimiter';
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
        return DataDelimiter.fromDelimitedString(this.track.artists);
    }

    public get durationInMilliseconds(): number {
        return this.track.duration;
    }
}
