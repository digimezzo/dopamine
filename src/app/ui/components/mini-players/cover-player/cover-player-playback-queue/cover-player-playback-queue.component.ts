import { Component, ViewEncapsulation } from '@angular/core';
import { PlaybackQueueServiceFactory } from '../../../../../services/playback-queue/playback-queue-service.factory';
import { IPlaybackQueueService } from '../../../../../services/playback-queue/i-playback-queue.service';

@Component({
    selector: 'app-cover-player-playback-queue',
    host: { style: 'display: block' },
    templateUrl: './cover-player-playback-queue.component.html',
    styleUrls: ['./cover-player-playback-queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CoverPlayerPlaybackQueueComponent {
    public constructor(private playbackQueueServiceFactory: PlaybackQueueServiceFactory) {
        this.playbackQueueService = playbackQueueServiceFactory.createLocal();
    }

    public playbackQueueService: IPlaybackQueueService;
}
