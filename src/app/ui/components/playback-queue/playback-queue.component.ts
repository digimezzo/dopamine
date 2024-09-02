import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { PlaybackIndicationServiceBase } from '../../../services/playback-indication/playback-indication.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { MouseSelectionWatcher } from '../mouse-selection-watcher';
import { ContextMenuOpener } from '../context-menu-opener';

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
    private _shouldShowList: boolean = false;

    public constructor(
        public playbackService: PlaybackServiceBase,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private playbackIndicationService: PlaybackIndicationServiceBase,
        private navigationService: NavigationServiceBase,
    ) {}

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    @Input()
    public showTitle: boolean = true;

    public get shouldShowList(): boolean {
        return this._shouldShowList;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.playbackService.playbackQueue.tracks, playbackStarted.currentTrack);
            }),
        );

        this.subscription.add(
            this.navigationService.refreshPlaybackQueueListRequested$.subscribe(() => {
                // HACK: thanks to Angular for breaking cdk virtual scroll or the drawer (who knows, do they even know themselves?)
                // After Angular 14, the cdk virtual scroll does not render all items when opening the drawer. A resize of the window
                // with the drawer open, fixes drawing of all items in the list. This hack is an automatic workaround.
                // I'm honestly very sick if this. Angular updates and deprecates their versions so quickly, forcing us to upgrade.
                // But with each upgrade, something major breaks. I'm wasting countless days/weeks on such issues.
                this._shouldShowList = false;
                setTimeout(() => {
                    this._shouldShowList = true;
                }, 250);

                this.mouseSelectionWatcher.initialize(this.playbackService.playbackQueue.tracks);
            }),
        );
    }

    public setSelectedTracks(event: MouseEvent, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public onTrackContextMenu(event: MouseEvent, track: TrackModel): void {
        this.contextMenuOpener.open(this.trackContextMenu, event, track);
    }

    public onRemoveFromQueue(): void {
        this.playbackService.removeFromQueue(this.mouseSelectionWatcher.selectedItems as TrackModel[]);
    }
}
