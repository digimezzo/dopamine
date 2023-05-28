import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Subscription } from 'rxjs';
import { ContextMenuOpener } from '../../common/context-menu-opener';
import { MouseSelectionWatcher } from '../../common/mouse-selection-watcher';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackIndicationService } from '../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';

@Component({
    selector: 'app-playback-queue',
    host: { style: 'display: block' },
    templateUrl: './playback-queue.component.html',
    styleUrls: ['./playback-queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [MouseSelectionWatcher],
})
export class PlaybackQueueComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        public playbackService: BasePlaybackService,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private playbackIndicationService: BasePlaybackIndicationService,
        private navigationService: BaseNavigationService
    ) {}

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.playbackService.playbackQueue.tracks, playbackStarted.currentTrack);
            })
        );

        this.subscription.add(
            this.navigationService.showPlaybackQueueRequested$.subscribe(() => {
                this.mouseSelectionWatcher.initialize(this.playbackService.playbackQueue.tracks);
            })
        );
    }

    public setSelectedTracks(event: any, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public onTrackContextMenu(event: MouseEvent, track: TrackModel): void {
        this.contextMenuOpener.open(this.trackContextMenu, event, track);
    }

    public onRemoveFromQueue(): void {
        this.playbackService.removeFromQueue(this.mouseSelectionWatcher.selectedItems);
    }
}
