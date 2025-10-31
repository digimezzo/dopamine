import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { PlaybackQueueServiceFactory } from '../../../services/playback-queue/playback-queue-service.factory';
import { IPlaybackQueueService } from '../../../services/playback-queue/i-playback-queue.service';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';

@Component({
    selector: 'app-playlist-window',
    templateUrl: './playlist-window.component.html',
    styleUrls: ['./playlist-window.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaylistWindowComponent implements AfterViewInit {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public navigationService: NavigationServiceBase,
        playbackQueueServiceFactory: PlaybackQueueServiceFactory,
    ) {
        this.playbackQueueService = playbackQueueServiceFactory.createRemote();
    }

    public playbackQueueService: IPlaybackQueueService;

    public ngAfterViewInit(): void {
        this.navigationService.refreshPlaybackQueueList();
    }
}
