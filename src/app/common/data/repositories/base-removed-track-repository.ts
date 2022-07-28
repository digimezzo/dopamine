import { RemovedTrack } from '../entities/removed-track';

export abstract class BaseRemovedTrackRepository {
    public abstract addRemovedTrack(removedTrack: RemovedTrack): void;
    public abstract deleteRemovedTrackByTrackId(trackId: number): void;
    public abstract getRemovedTracks(): RemovedTrack[];
}
