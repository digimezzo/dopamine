import { Track } from '../../data/entities/track';

export class TrackModel {
    constructor(private track: Track) {}

    public get path(): string {
        return this.track.path;
    }
}
