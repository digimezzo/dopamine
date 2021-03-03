import { Observable } from 'rxjs';
import { TrackModel } from '../track/track-model';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';

export abstract class BasePlaybackService {
    public abstract progressChanged$: Observable<PlaybackProgress>;
    public abstract progress: PlaybackProgress;
    public abstract loopMode: LoopMode;
    public abstract isShuffled: boolean;
    public abstract isPlaying: boolean;
    public abstract canPause: boolean;
    public abstract canResume: boolean;
    public abstract toggleLoopMode(): void;
    public abstract toggleIsShuffled(): void;
    public abstract enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
    public abstract playPrevious(): void;
    public abstract playNext(): void;
    public abstract skipByFractionOfTotalSeconds(fractionOfTotalSeconds: number): void;
}
