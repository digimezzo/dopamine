import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { ArtistOrdering } from '../../../../common/ordering/artist-ordering';
import { BaseScheduler } from '../../../../common/scheduling/base-scheduler';
import { SemanticZoomHeaderAdder } from '../../../../common/semantic-zoom-header-adder';
import { BaseApplicationService } from '../../../../services/application/base-application.service';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { ArtistsPersister } from '../artists-persister';
import { ArtistOrder } from './artist-order';

@Component({
    selector: 'app-artist-browser',
    host: { style: 'display: block' },
    templateUrl: './artist-browser.component.html',
    styleUrls: ['./artist-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class ArtistBrowserComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) public viewPort: CdkVirtualScrollViewport;

    private _artists: ArtistModel[] = [];
    private _artistsPersister: ArtistsPersister;
    private subscription: Subscription = new Subscription();

    constructor(
        public playbackService: BasePlaybackService,
        private semanticZoomService: BaseSemanticZoomService,
        private applicationService: BaseApplicationService,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        private artistOrdering: ArtistOrdering,
        private semanticZoomHeaderAdder: SemanticZoomHeaderAdder,
        private scheduler: BaseScheduler,
        private logger: Logger
    ) {}

    public shouldZoomOut: boolean = false;

    @ViewChild('artistContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public artistContextMenu: MatMenuTrigger;

    public orderedArtists: ArtistModel[] = [];

    public artistOrderEnum: typeof ArtistOrder = ArtistOrder;
    public selectedArtistOrder: ArtistOrder;

    public artistTypeEnum: typeof ArtistType = ArtistType;
    public selectedArtistType: ArtistType;

    public get artistsPersister(): ArtistsPersister {
        return this._artistsPersister;
    }

    @Input()
    public set artistsPersister(v: ArtistsPersister) {
        this._artistsPersister = v;
        this.selectedArtistType = this.artistsPersister.getSelectedArtistType();
        this.selectedArtistOrder = this.artistsPersister.getSelectedArtistOrder();
        this.orderArtists();
    }

    public get artists(): ArtistModel[] {
        return this._artists;
    }

    @Input()
    public set artists(v: ArtistModel[]) {
        this._artists = v;
        this.mouseSelectionWatcher.initialize(this.artists, false);

        // When the component is first rendered, it happens that artistsPersister is undefined.
        if (this.artistsPersister != undefined) {
            this.orderArtists();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.semanticZoomService.zoomOutRequested$.subscribe(() => {
                this.shouldZoomOut = true;
            })
        );

        this.subscription.add(
            this.semanticZoomService.zoomInRequested$.subscribe((text: string) => {
                this.scrollToZoomHeaderAsync(text);
            })
        );

        this.subscription.add(
            this.applicationService.mouseButtonReleased$.subscribe(() => {
                this.shouldZoomOut = false;
            })
        );
    }

    public setSelectedArtists(event: any, artistToSelect: ArtistModel): void {
        if (!artistToSelect.isZoomHeader) {
            this.mouseSelectionWatcher.setSelectedItems(event, artistToSelect);
            this.artistsPersister.setSelectedArtists(this.mouseSelectionWatcher.selectedItems);
        }
    }

    public toggleArtistType(): void {
        switch (this.selectedArtistType) {
            case ArtistType.trackArtists:
                this.selectedArtistType = ArtistType.albumArtists;
                break;
            case ArtistType.albumArtists:
                this.selectedArtistType = ArtistType.allArtists;
                break;
            case ArtistType.allArtists:
                this.selectedArtistType = ArtistType.trackArtists;
                break;
            default: {
                this.selectedArtistType = ArtistType.trackArtists;
                break;
            }
        }

        this.artistsPersister.setSelectedArtistType(this.selectedArtistType);
    }

    public toggleArtistOrder(): void {
        switch (this.selectedArtistOrder) {
            case ArtistOrder.byArtistAscending:
                this.selectedArtistOrder = ArtistOrder.byArtistDescending;
                break;
            case ArtistOrder.byArtistDescending:
                this.selectedArtistOrder = ArtistOrder.byArtistAscending;
                break;
            default: {
                this.selectedArtistOrder = ArtistOrder.byArtistAscending;
                break;
            }
        }

        this.artistsPersister.setSelectedArtistOrder(this.selectedArtistOrder);
        this.orderArtists();
    }

    public async onArtistContextMenuAsync(event: MouseEvent, artist: ArtistModel): Promise<void> {
        this.contextMenuOpener.open(this.artistContextMenu, event, artist);
    }

    public async onAddToQueueAsync(artist: ArtistModel): Promise<void> {
        await this.playbackService.addArtistToQueueAsync(artist, this.selectedArtistType);
    }

    private orderArtists(): void {
        let orderedArtists: ArtistModel[] = [];

        try {
            switch (this.selectedArtistOrder) {
                case ArtistOrder.byArtistAscending:
                    orderedArtists = this.artistOrdering.getArtistsOrderedAscending(this.artists);
                    break;
                case ArtistOrder.byArtistDescending:
                    orderedArtists = this.artistOrdering.getArtistsOrderedDescending(this.artists);
                    break;
                default: {
                    orderedArtists = this.artistOrdering.getArtistsOrderedAscending(this.artists);
                    break;
                }
            }

            this.semanticZoomHeaderAdder.addZoomHeaders(orderedArtists);
            this.applySelectedArtists();
        } catch (e) {
            this.logger.error(`Could not order artists. Error: ${e.message}`, 'ArtistBrowserComponent', 'orderArtists');
        }

        this.orderedArtists = [...orderedArtists];
    }

    private applySelectedArtists(): void {
        const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);

        if (selectedArtists == undefined) {
            return;
        }

        for (const selectedArtist of selectedArtists) {
            selectedArtist.isSelected = true;
        }
    }

    private async scrollToZoomHeaderAsync(text: string): Promise<void> {
        this.shouldZoomOut = false;
        await this.scheduler.sleepAsync(Constants.semanticZoomInDelayMilliseconds);

        const selectedIndex = this._artists.findIndex((elem) => elem.zoomHeader === text && elem.isZoomHeader);

        if (selectedIndex > -1) {
            this.viewPort.scrollToIndex(selectedIndex, 'smooth');
        }
    }
}
