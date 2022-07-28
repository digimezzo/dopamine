import { TrackModel } from '../track/track-model';

export class PlaybackStarted {
    constructor(public currentTrack: TrackModel, public isPlayingPreviousTrack: boolean) {}
}
