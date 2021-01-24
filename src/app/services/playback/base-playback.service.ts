import { TrackModel } from '../track/track-model';

export abstract class BasePlaybackService {
    public abstract enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
}
