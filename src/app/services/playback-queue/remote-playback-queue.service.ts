import { IPlaybackQueueService } from './i-playback-queue.service';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { Observable, Subject } from 'rxjs';
import { PlaybackStarted } from '../playback/playback-started';
import { ApplicationBase } from '../../common/io/application.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';

export class RemotePlaybackQueueService implements IPlaybackQueueService {
    private playbackStarted: Subject<PlaybackStarted> = new Subject();
    private globalEmitter: any;

    public constructor(
        private application: ApplicationBase,
        private scheduler: SchedulerBase,
    ) {
        this.globalEmitter = this.application.getGlobal('globalEmitter');
    }

    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();

    public get queue(): TrackModels {
        return new TrackModels();
    }

    public removeFromQueue(tracks: TrackModel[]): void {
        throw new Error('Method not implemented.');
    }

    public playQueuedTrack(track: TrackModel): void {
        throw new Error('Method not implemented.');
    }

    // private async getQueue(): Promise<TrackModels> {
    //     let queue: TrackModels | undefined;
    //
    //     this.globalEmitter.emit('get-queue', (receivedQueue: TrackModels) => (queue = receivedQueue));
    //
    //     while (queue === undefined) {
    //         await this.scheduler.sleepAsync(50);
    //     }
    //
    //     return queue;
    // }
}
