import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { TrackOrdering } from '../../../common/ordering/track-ordering';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { BaseTracksPersister } from '../base-tracks-persister';
import { TrackOrder } from '../track-order';

@Component({
    selector: 'app-track-browser',
    host: { style: 'display: block' },
    templateUrl: './track-browser.component.html',
    styleUrls: ['./track-browser.component.scss'],
    providers: [MouseSelectionWatcher],
    encapsulation: ViewEncapsulation.None,
})
export class TrackBrowserComponent implements OnInit, OnDestroy {
    private _tracks: TrackModels = new TrackModels();
    private _tracksPersister: BaseTracksPersister;
    private subscription: Subscription = new Subscription();

    constructor(
        public playbackService: BasePlaybackService,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private metadataService: BaseMetadataService,
        private playbackIndicationService: BasePlaybackIndicationService,
        private collectionService: BaseCollectionService,
        private translatorService: BaseTranslatorService,
        private dialogService: BaseDialogService,
        private trackOrdering: TrackOrdering,
        private desktop: BaseDesktop,
        private logger: Logger
    ) {}

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    public orderedTracks: TrackModel[] = [];

    public trackOrderEnum: typeof TrackOrder = TrackOrder;
    public selectedTrackOrder: TrackOrder;

    public get tracksPersister(): BaseTracksPersister {
        return this._tracksPersister;
    }

    @Input()
    public set tracksPersister(v: BaseTracksPersister) {
        this._tracksPersister = v;
        this.selectedTrackOrder = this.tracksPersister.getSelectedTrackOrder();
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

        this.subscription.add(
            this.metadataService.ratingSaved$.subscribe((track: TrackModel) => {
                this.updateTrackRating(track);
            })
        );

        this.subscription.add(
            this.metadataService.loveSaved$.subscribe((track: TrackModel) => {
                this.updateTrackLove(track);
            })
        );
    }

    private updateTrackRating(trackWithUpToDateRating: TrackModel): void {
        for (const track of this.tracks.tracks) {
            if (track.path === trackWithUpToDateRating.path) {
                track.rating = trackWithUpToDateRating.rating;
            }
        }
    }

    private updateTrackLove(trackWithUpToDateLove: TrackModel): void {
        for (const track of this.tracks.tracks) {
            if (track.path === trackWithUpToDateLove.path) {
                track.love = trackWithUpToDateLove.love;
            }
        }
    }

    public setSelectedTracks(event: any, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public toggleTrackOrder(): void {
        switch (this.selectedTrackOrder) {
            case TrackOrder.byTrackTitleAscending:
                this.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
                break;
            case TrackOrder.byTrackTitleDescending:
                this.selectedTrackOrder = TrackOrder.byAlbum;
                break;
            case TrackOrder.byAlbum:
                this.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
                break;
            default: {
                this.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
                break;
            }
        }

        this.tracksPersister.setSelectedTrackOrder(this.selectedTrackOrder);
        this.orderTracks();
    }

    public async onTrackContextMenuAsync(event: MouseEvent, track: TrackModel): Promise<void> {
        this.contextMenuOpener.open(this.trackContextMenu, event, track);
    }

    public async onAddToQueueAsync(): Promise<void> {
        await this.playbackService.addTracksToQueueAsync(this.mouseSelectionWatcher.selectedItems);
    }

    public onShowInFolder(): void {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems;

        if (tracks.length > 0) {
            this.desktop.showFileInDirectory(tracks[0].path);
        }
    }

    public async onDeleteAsync(): Promise<void> {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems;

        let dialogTitle: string = await this.translatorService.getAsync('delete-song');
        let dialogText: string = await this.translatorService.getAsync('confirm-delete-song');

        if (tracks.length > 1) {
            dialogTitle = await this.translatorService.getAsync('delete-songs');
            dialogText = await this.translatorService.getAsync('confirm-delete-songs');
        }

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                if (!this.collectionService.deleteTracksAsync(tracks)) {
                    throw new Error('deleteTracksAsync returned false');
                }
            } catch (e) {
                this.logger.error(`Could not delete all files. Error: ${e.message}`, 'TrackBrowserComponent', 'onDelete');
                const errorText: string = await this.translatorService.getAsync('delete-songs-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    private orderTracks(): void {
        let orderedTracks: TrackModel[] = [];

        try {
            switch (this.selectedTrackOrder) {
                case TrackOrder.byTrackTitleAscending:
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byTrackTitleDescending:
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleDescending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byAlbum:
                    orderedTracks = this.trackOrdering.getTracksOrderedByAlbum(this.tracks.tracks);
                    this.showAlbumHeaders(orderedTracks);
                    break;
                default: {
                    orderedTracks = this.trackOrdering.getTracksOrderedByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                }
            }
        } catch (e) {
            this.logger.error(`Could not order tracks. Error: ${e.message}`, 'TrackBrowserComponent', 'orderTracks');
        }

        this.orderedTracks = [...orderedTracks];

        this.playbackIndicationService.setPlayingTrack(this.orderedTracks, this.playbackService.currentTrack);
    }

    private hideAllHeaders(orderedTracks: TrackModel[]): void {
        for (const track of orderedTracks) {
            track.showHeader = false;
        }
    }

    private showAlbumHeaders(orderedTracks: TrackModel[]): void {
        let previousAlbumKey: string = uuidv4();
        let previousDiscNumber: number = -1;

        for (const track of orderedTracks) {
            if (track.albumKey !== previousAlbumKey || track.discNumber !== previousDiscNumber) {
                track.showHeader = true;
            }

            previousAlbumKey = track.albumKey;
            previousDiscNumber = track.discNumber;
        }
    }
}
