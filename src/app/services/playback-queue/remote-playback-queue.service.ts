import { IPlaybackQueueService } from './i-playback-queue.service';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { Observable, Subject } from 'rxjs';
import { PlaybackStarted } from '../playback/playback-started';
import { ApplicationBase } from '../../common/io/application.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';
import { DateTime } from '../../common/date-time';
import { TranslatorServiceBase } from '../translator/translator.service.base';

export class RemotePlaybackQueueService implements IPlaybackQueueService {
    private playbackStarted: Subject<PlaybackStarted> = new Subject();
    private globalEmitter: any;
    private _queue: TrackModels = new TrackModels();
    private gotQueue: boolean = false;
    private isGettingQueue: boolean = false;

    public constructor(
        private translatorService: TranslatorServiceBase,
        private dateTime: DateTime,
        private application: ApplicationBase,
        private scheduler: SchedulerBase,
    ) {
        this.globalEmitter = this.application.getGlobal('globalEmitter');
    }

    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();

    public get queue(): TrackModels {
        if (!this.gotQueue && !this.isGettingQueue) {
            this.getQueue();
        }

        return this._queue;
    }

    public removeFromQueue(tracks: TrackModel[]): void {
        throw new Error('Method not implemented.');
    }

    public playQueuedTrack(track: TrackModel): void {
        throw new Error('Method not implemented.');
    }

    private async getQueue(): Promise<void> {
        this.isGettingQueue = true;

        let localQueue: string | undefined;

        this.globalEmitter.emit('get-queue', (receivedQueue: string) => (localQueue = receivedQueue));

        while (localQueue === undefined) {
            await this.scheduler.sleepAsync(50);
        }

        const data = JSON.parse(localQueue);
        this._queue = TrackModels.fromJSON(data, this.dateTime, this.translatorService);

        this.gotQueue = true;
        this.isGettingQueue = false;
    }
}
