import { Observable } from 'rxjs';
import { PlaybackInformation } from './playback-information';

export abstract class PlaybackInformationServiceBase {
    public abstract playingNextTrack$: Observable<PlaybackInformation>;
    public abstract playingPreviousTrack$: Observable<PlaybackInformation>;
    public abstract playingNoTrack$: Observable<PlaybackInformation>;
    public abstract getCurrentPlaybackInformationAsync(): Promise<PlaybackInformation>;
}
