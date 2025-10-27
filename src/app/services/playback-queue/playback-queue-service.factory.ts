import { Injectable } from '@angular/core';
import { IPlaybackQueueService } from './i-playback-queue.service';
import { PlaybackService } from '../playback/playback.service';
import { LocalPlaybackQueueService } from './local-playback-queue.service';
import { RemotePlaybackQueueService } from './remote-playback-queue.service';
import { ApplicationBase } from '../../common/io/application.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';

@Injectable({ providedIn: 'root' })
export class PlaybackQueueServiceFactory {
    public constructor(
        private playbackService: PlaybackService,
        private application: ApplicationBase,
        private scheduler: SchedulerBase,
    ) {}

    public createLocal(): IPlaybackQueueService {
        return new LocalPlaybackQueueService(this.playbackService);
    }

    public createRemote(): IPlaybackQueueService {
        return new RemotePlaybackQueueService(this.application, this.scheduler);
    }
}
