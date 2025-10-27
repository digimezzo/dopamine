import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { PlaybackQueueServiceFactory } from '../../../services/playback-queue/playback-queue-service.factory';
import { IPlaybackQueueService } from '../../../services/playback-queue/i-playback-queue.service';

@Component({
    selector: 'app-playlist-window',
    templateUrl: './playlist-window.component.html',
    styleUrls: ['./playlist-window.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaylistWindowComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        playbackQueueServiceFactory: PlaybackQueueServiceFactory,
    ) {
        this.playbackQueueService = playbackQueueServiceFactory.createRemote();
    }

    public playbackQueueService: IPlaybackQueueService;
}
