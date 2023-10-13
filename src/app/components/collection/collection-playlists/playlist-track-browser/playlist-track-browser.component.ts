import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { BaseDesktop } from '../../../../common/io/base-desktop';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BasePlaybackIndicationService } from '../../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { BasePlaylistService } from '../../../../services/playlist/base-playlist.service';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { BaseTracksPersister } from '../../base-tracks-persister';

@Component({
    selector: 'app-playlist-track-browser',
    host: { style: 'display: block' },
    templateUrl: './playlist-track-browser.component.html',
    styleUrls: ['./playlist-track-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class PlaylistTrackBrowserComponent implements OnInit, OnDestroy {
    private _tracks: TrackModels = new TrackModels();
    private _tracksPersister: BaseTracksPersister;
    private subscription: Subscription = new Subscription();

    public constructor(
        public playbackService: BasePlaybackService,
        public playlistService: BasePlaylistService,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private playbackIndicationService: BasePlaybackIndicationService,
        private translatorService: BaseTranslatorService,
        private dialogService: BaseDialogService,
        private desktop: BaseDesktop,
        private logger: Logger
    ) {}

    @ViewChild('playlistTrackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public playlistTrackContextMenu: MatMenuTrigger;

    public orderedTracks: TrackModel[] = [];

    public get tracksPersister(): BaseTracksPersister {
        return this._tracksPersister;
    }

    @Input()
    public set tracksPersister(v: BaseTracksPersister) {
        this._tracksPersister = v;
        this.orderTracks();
    }

    public get tracks(): TrackModels {
        return this._tracks;
    }

    @Input()
    public set tracks(v: TrackModels) {
        this._tracks = v;
        this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);
        this.orderTracks();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingTrack(this.orderedTracks, playbackStarted.currentTrack);
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.playbackIndicationService.clearPlayingTrack(this.orderedTracks);
            })
        );
    }

    public setSelectedTracks(event: MouseEvent, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public onPlaylistTrackContextMenu(event: MouseEvent, track: TrackModel): void {
        this.contextMenuOpener.open(this.playlistTrackContextMenu, event, track);
    }

    public async onRemoveFromPlaylistAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('confirm-remove-from-playlist');
        const dialogText: string = await this.translatorService.getAsync('confirm-remove-from-playlist-long');

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                await this.playlistService.removeTracksFromPlaylistsAsync(this.mouseSelectionWatcher.selectedItems as TrackModel[]);
            } catch (e: unknown) {
                this.logger.error(
                    e,
                    'Could not remove tracks from playlists',
                    'PlaylistTrackBrowserComponent',
                    'onRemoveFromPlaylistAsync'
                );

                const errorText: string = await this.translatorService.getAsync('remove-from-playlist-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async onAddToQueueAsync(): Promise<void> {
        await this.playbackService.addTracksToQueueAsync(this.mouseSelectionWatcher.selectedItems as TrackModel[]);
    }

    public onShowInFolder(): void {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems as TrackModel[];

        if (tracks.length > 0) {
            this.desktop.showFileInDirectory(tracks[0].path);
        }
    }

    private orderTracks(): void {
        let orderedTracks: TrackModel[] = [];

        try {
            orderedTracks = this.tracks.tracks;
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order tracks', 'PlaylistTrackBrowserComponent', 'orderTracks');
        }

        this.orderedTracks = [...orderedTracks];

        this.playbackIndicationService.setPlayingTrack(this.orderedTracks, this.playbackService.currentTrack);
    }

    public dropTrack(event: CdkDragDrop<TrackModel[]>): void {
        moveItemInArray(this.orderedTracks, event.previousIndex, event.currentIndex);

        // HACK: required so that the dragged item does not snap back to its original place
        // See: https://github.com/angular/components/issues/14873
        this.orderedTracks = [...this.orderedTracks];

        //  await this.playlistService.updatePlaylistOrderAsync(this.orderedTracks);
    }
}
