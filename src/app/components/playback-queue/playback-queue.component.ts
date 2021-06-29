import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasePlaybackIndicationService } from '../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';

@Component({
    selector: 'app-playback-queue',
    host: { style: 'display: block' },
    templateUrl: './playback-queue.component.html',
    styleUrls: ['./playback-queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackQueueComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(public playbackService: BasePlaybackService, private playbackIndicationService: BasePlaybackIndicationService) {}

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.playbackService.playbackQueue.tracks, playbackStarted.currentTrack);
            })
        );
    }
}
