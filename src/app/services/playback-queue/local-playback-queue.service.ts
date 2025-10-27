import { IPlaybackQueueService } from './i-playback-queue.service';
import { PlaybackService } from '../playback/playback.service';
import { TrackModel } from '../track/track-model';
import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModels } from '../track/track-models';
import { ApplicationBase } from '../../common/io/application.base';

export class LocalPlaybackQueueService implements IPlaybackQueueService {
    private subscription: Subscription = new Subscription();
    private playbackStarted: Subject<PlaybackStarted> = new Subject();

    public constructor(private playbackService: PlaybackService) {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackStarted.next(playbackStarted);
            }),
        );
    }

    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();

    public getQueue$(): Observable<TrackModels> {
        return of(this.playbackService.playbackQueue);
    }

    public removeFromQueue(tracks: TrackModel[]): void {
        this.playbackService.removeFromQueue(tracks);
    }

    public playQueuedTrack(track: TrackModel): void {
        this.playbackService.playQueuedTrack(track);
    }
}
