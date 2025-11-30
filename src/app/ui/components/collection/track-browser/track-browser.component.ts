import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { GuidFactory } from '../../../../common/guid.factory';
import { Logger } from '../../../../common/logger';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { BaseTracksPersister } from '../base-tracks-persister';
import { TrackOrder, trackOrderKey } from '../track-order';
import { TrackBrowserBase } from './track-brower-base';
import { PlaybackIndicationServiceBase } from '../../../../services/playback-indication/playback-indication.service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../context-menu-opener';
import { TrackSorter } from '../../../../common/sorting/track-sorter';
import { Timer } from '../../../../common/scheduling/timer';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TrackServiceBase } from '../../../../services/track/track.service.base';

@Component({
    selector: 'app-track-browser',
    host: { style: 'display: block' },
    templateUrl: './track-browser.component.html',
    styleUrls: ['./track-browser.component.scss'],
    providers: [MouseSelectionWatcher],
    encapsulation: ViewEncapsulation.None,
})
export class TrackBrowserComponent extends TrackBrowserBase implements OnInit, OnDestroy {
    private _tracks: TrackModels = new TrackModels();
    private _tracksPersister: BaseTracksPersister;
    private subscription: Subscription = new Subscription();

    public constructor(
        public playbackService: PlaybackService,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        private metadataService: MetadataService,
        private playbackIndicationService: PlaybackIndicationServiceBase,
        private guidFactory: GuidFactory,
        private trackSorter: TrackSorter,
        private trackService: TrackServiceBase,
        collectionService: CollectionServiceBase,
        translatorService: TranslatorServiceBase,
        dialogService: DialogServiceBase,
        desktop: DesktopBase,
        logger: Logger,
    ) {
        super(
            playbackService,
            dialogService,
            addToPlaylistMenu,
            contextMenuOpener,
            mouseSelectionWatcher,
            logger,
            collectionService,
            translatorService,
            desktop,
        );
    }

    @ViewChild(CdkVirtualScrollViewport) public viewPort: CdkVirtualScrollViewport;

    @Input()
    public readonly trackOrders: TrackOrder[] = [];
    public readonly trackOrderKey = trackOrderKey;

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    public orderedTracks: TrackModel[] = [];

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

    @Input()
    public showOrdering: boolean = true;

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
                this.trackService.scrollToPlayingTrack(this.orderedTracks, this.viewPort);
            }),
        );

        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.trackService.scrollToPlayingTrack(this.orderedTracks, this.viewPort);
            }),
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.playbackIndicationService.clearPlayingTrack(this.orderedTracks);
            }),
        );

        this.subscription.add(
            this.metadataService.ratingSaved$.subscribe((track: TrackModel) => {
                this.updateTrackRating(track);
            }),
        );

        this.subscription.add(
            this.metadataService.loveSaved$.subscribe((track: TrackModel) => {
                this.updateTrackLove(track);
            }),
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

    public setSelectedTracks(event: MouseEvent, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public applyTrackOrder = (trackOrder: TrackOrder): void => {
        this.selectedTrackOrder = trackOrder;
        this.tracksPersister.setSelectedTrackOrder(this.selectedTrackOrder);
        this.orderTracks();
    };

    private orderTracks(): void {
        let orderedTracks: TrackModel[] = [];

        const timer = new Timer();
        timer.start();

        try {
            switch (this.selectedTrackOrder) {
                case TrackOrder.byTrackTitleAscending:
                    orderedTracks = this.trackSorter.sortByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byTrackTitleDescending:
                    orderedTracks = this.trackSorter.sortByTitleDescending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byDateCreatedAscending:
                    orderedTracks = this.trackSorter.sortByDateCreatedAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byDateCreatedDescending:
                    orderedTracks = this.trackSorter.sortByDateCreatedDescending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                case TrackOrder.byAlbum:
                    orderedTracks = this.trackSorter.sortByAlbum(this.tracks.tracks);
                    this.showAlbumHeaders(orderedTracks);
                    break;
                case TrackOrder.none:
                    orderedTracks = this.tracks.tracks;
                    this.hideAllHeaders(orderedTracks);
                    break;
                default: {
                    orderedTracks = this.trackSorter.sortByTitleAscending(this.tracks.tracks);
                    this.hideAllHeaders(orderedTracks);
                    break;
                }
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order tracks', 'TrackBrowserComponent', 'orderTracks');
        }

        this.orderedTracks = [...orderedTracks];

        timer.stop();

        this.logger.info(
            `Finished ordering tracks. Time required: ${timer.elapsedMilliseconds} ms`,
            'TrackBrowserComponent',
            'orderTracks',
        );

        this.playbackIndicationService.setPlayingTrack(this.orderedTracks, this.playbackService.currentTrack);
        this.trackService.scrollToPlayingTrack(this.orderedTracks, this.viewPort);
    }

    private hideAllHeaders(orderedTracks: TrackModel[]): void {
        for (const track of orderedTracks) {
            track.showHeader = false;
        }
    }

    private showAlbumHeaders(orderedTracks: TrackModel[]): void {
        let previousAlbumKey: string = this.guidFactory.create();
        let previousDiscNumber: number = -1;

        for (const track of orderedTracks) {
            const albumKey = track.albumKey;
            const discNumber = track.discNumber;

            track.showHeader = albumKey !== previousAlbumKey || discNumber !== previousDiscNumber;

            previousAlbumKey = albumKey;
            previousDiscNumber = discNumber;
        }
    }
}
