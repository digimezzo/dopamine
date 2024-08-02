import { QueuedTrack } from '../entities/queued-track';

export abstract class QueuedTrackRepositoryBase {
    public abstract getSavedQueuedTracks(): QueuedTrack[] | undefined;
    public abstract saveQueuedTracks(tracks: QueuedTrack[]): void;
    public abstract getPlayingTrack(): QueuedTrack | undefined;
}
