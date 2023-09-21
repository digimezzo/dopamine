import { TrackModel } from '../track/track-model';

export class PlaybackStarted {
    public constructor(public currentTrack: TrackModel, public isPlayingPreviousTrack: boolean) {}
}
