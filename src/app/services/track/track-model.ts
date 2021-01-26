import { DataDelimiter } from '../../data/data-delimiter';
import { Track } from '../../data/entities/track';

export class TrackModel {
    constructor(private track: Track) {}

    public get path(): string {
        return this.track.path;
    }

    public get fileName(): string {
        return this.track.fileName;
    }

    public get number(): number {
        return this.track.trackNumber;
    }

    public get title(): string {
        return this.track.trackTitle;
    }

    public get artists(): string[] {
        return DataDelimiter.fromDelimitedString(this.track.artists);
    }

    public get durationInMilliseconds(): number {
        return this.track.duration;
    }
}
