export abstract class BasePlaybackService {
    public abstract canPause: boolean;
    public abstract canResume: boolean;
    public abstract progressPercent: number;
    // public abstract enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
}
