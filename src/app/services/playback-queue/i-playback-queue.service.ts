import { TrackModel } from '../track/track-model';
import { Observable, Subject } from 'rxjs';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModels } from '../track/track-models';

export interface IPlaybackQueueService {
    playbackStarted$: Observable<PlaybackStarted>;
    queue: TrackModels;
    removeFromQueue(tracks: TrackModel[]): void;
    playQueuedTrack(track: TrackModel): void;
}
