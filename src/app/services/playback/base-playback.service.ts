import { TrackModel } from '../track/track-model';
import { LoopMode } from './loop-mode';

export abstract class BasePlaybackService {
    public abstract loopMode: LoopMode;
    public abstract isShuffled: boolean;
    public abstract canPause: boolean;
    public abstract canResume: boolean;
    public abstract progressPercent: number;
    public abstract enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
    public abstract playPrevious(): void;
    public abstract playNext(): void;
}
