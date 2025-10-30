import { Injectable } from '@angular/core';
import { IPlaybackQueueService } from './i-playback-queue.service';
import { PlaybackService } from '../playback/playback.service';
import { LocalPlaybackQueueService } from './local-playback-queue.service';
import { RemotePlaybackQueueService } from './remote-playback-queue.service';
import { ApplicationBase } from '../../common/io/application.base';
import { DateTime } from '../../common/date-time';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';

@Injectable({ providedIn: 'root' })
export class PlaybackQueueServiceFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private dateTime: DateTime,
        private playbackService: PlaybackService,
        private application: ApplicationBase,
        private scheduler: SchedulerBase,
    ) {}

    public createLocal(): IPlaybackQueueService {
        return new LocalPlaybackQueueService(this.playbackService);
    }

    public createRemote(): IPlaybackQueueService {
        return new RemotePlaybackQueueService(this.translatorService, this.dateTime, this.application, this.scheduler);
    }
}
