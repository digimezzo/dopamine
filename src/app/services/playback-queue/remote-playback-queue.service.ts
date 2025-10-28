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
    private _queue: TrackModels | undefined;
    private gettingQueue: boolean = false;

    public constructor(
        private application: ApplicationBase,
        private scheduler: SchedulerBase,
    ) {
        this.globalEmitter = this.application.getGlobal('globalEmitter');
    }

    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();

    public get queue(): TrackModels {
        if (!this._queue && !this.gettingQueue) {
            this.getQueue();
        }

        return this._queue!;
    }

    public removeFromQueue(tracks: TrackModel[]): void {
        throw new Error('Method not implemented.');
    }

    public playQueuedTrack(track: TrackModel): void {
        throw new Error('Method not implemented.');
    }

    private async getQueue(): Promise<void> {
        this.gettingQueue = true;

        this.globalEmitter.emit('get-queue', (receivedQueue: TrackModels) => (this._queue = receivedQueue));

        while (this._queue === undefined) {
            await this.scheduler.sleepAsync(50);
        }

        this.gettingQueue = false;
    }
}
