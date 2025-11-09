import { QueuedTrack } from '../entities/queued-track';

export abstract class QueuedTrackRepositoryBase {
    public abstract getSavedQueuedTracksAsync(): Promise<QueuedTrack[] | undefined>;
    public abstract saveQueuedTracksAsync(tracks: QueuedTrack[]): Promise<void>;
}
