import { TrackModel } from '../track/track-model';

export abstract class BasePlaybackService {
    public abstract canPause: boolean;
    public abstract canResume: boolean;
    public abstract progressPercent: number;
    public abstract enqueue(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
    public abstract playPrevious(): void;
    public abstract playNext(): void;
}
