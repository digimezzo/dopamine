import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../../common/application/constants';
import { Logger } from '../../../../../common/logger';
import { SemanticZoomHeaderAdder } from '../../../../../common/semantic-zoom-header-adder';
import { PromiseUtils } from '../../../../../common/utils/promise-utils';
import { ArtistModel } from '../../../../../services/artist/artist-model';
import { ArtistType, artistTypeKey } from '../../../../../services/artist/artist-type';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { ArtistsPersister } from '../artists-persister';
import { ArtistOrder, artistOrderKey } from './artist-order';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { SchedulerBase } from '../../../../../common/scheduling/scheduler.base';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { ArtistSorter } from '../../../../../common/sorting/artist-sorter';
import { Timer } from '../../../../../common/scheduling/timer';

@Component({
    selector: 'app-artist-browser',
    host: { style: 'display: block' },
    templateUrl: './artist-browser.component.html',
    styleUrls: ['./artist-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class ArtistBrowserComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport) public viewPort: CdkVirtualScrollViewport;

    public readonly artistTypes: ArtistType[] = Object.values(ArtistType).filter((x): x is ArtistType => typeof x === 'number');
    public readonly artistTypeKey = artistTypeKey;

    public readonly artistOrders: ArtistOrder[] = Object.values(ArtistOrder).filter((x): x is ArtistOrder => typeof x === 'number');
    public readonly artistOrderKey = artistOrderKey;

    private _artists: ArtistModel[] = [];
    private _artistsPersister: ArtistsPersister;
    private subscription: Subscription = new Subscription();

    public constructor(
        public playbackService: PlaybackService,
        private semanticZoomService: SemanticZoomServiceBase,
        private applicationService: ApplicationServiceBase,
        public addToPlaylistMenu: AddToPlaylistMenu,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        private artistSorter: ArtistSorter,
        private semanticZoomHeaderAdder: SemanticZoomHeaderAdder,
        private scheduler: SchedulerBase,
        private logger: Logger,
    ) {}

    public shouldZoomOut: boolean = false;

    @ViewChild('artistContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public artistContextMenu: MatMenuTrigger;

    public orderedArtists: ArtistModel[] = [];

    public selectedArtistOrder: ArtistOrder;

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
            }),
        );

        this.subscription.add(
            this.semanticZoomService.zoomInRequested$.subscribe((text: string) => {
                PromiseUtils.noAwait(this.scrollToZoomHeaderAsync(text));
            }),
        );

        this.subscription.add(
            this.applicationService.mouseButtonReleased$.subscribe(() => {
                this.shouldZoomOut = false;
            }),
        );
    }

    public setSelectedArtists(event: MouseEvent, artistToSelect: ArtistModel): void {
        if (!artistToSelect.isZoomHeader) {
            this.mouseSelectionWatcher.setSelectedItems(event, artistToSelect);
            this.artistsPersister.setSelectedArtists(this.mouseSelectionWatcher.selectedItems as ArtistModel[]);
        }
    }

    public applyArtistType = (artistType: ArtistType): void => {
        this.selectedArtistType = artistType;
        this.artistsPersister.setSelectedArtistType(this.selectedArtistType);
    };

    public applyArtistOrder = (artistOrder: ArtistOrder): void => {
        this.selectedArtistOrder = artistOrder;
        this.artistsPersister.setSelectedArtistOrder(this.selectedArtistOrder);
        this.orderArtists();
    };

    public onArtistContextMenu(event: MouseEvent, artist: ArtistModel): void {
        this.contextMenuOpener.open(this.artistContextMenu, event, artist);
    }

    public async onAddToQueueAsync(artist: ArtistModel): Promise<void> {
        await this.playbackService.addArtistToQueueAsync(artist, this.selectedArtistType);
    }

    private orderArtists(): void {
        let orderedArtists: ArtistModel[] = [];

        const timer = new Timer();
        timer.start();

        try {
            switch (this.selectedArtistOrder) {
                case ArtistOrder.byArtistAscending:
                    orderedArtists = this.artistSorter.sortAscending(this.artists);
                    break;
                case ArtistOrder.byArtistDescending:
                    orderedArtists = this.artistSorter.sortDescending(this.artists);
                    break;
                default: {
                    orderedArtists = this.artistSorter.sortAscending(this.artists);
                    break;
                }
            }

            orderedArtists = this.semanticZoomHeaderAdder.addZoomHeaders(orderedArtists) as ArtistModel[];

            timer.stop();

            this.logger.info(
                `Finished ordering artists. Time required: ${timer.elapsedMilliseconds} ms`,
                'ArtistBrowserComponent',
                'orderArtists',
            );

            this.applySelectedArtists();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order artists', 'ArtistBrowserComponent', 'orderArtists');
        }

        this.orderedArtists = [...orderedArtists];
    }

    private applySelectedArtists(): void {
        const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);

        for (const selectedArtist of selectedArtists) {
            selectedArtist.isSelected = true;
        }
    }

    private async scrollToZoomHeaderAsync(text: string): Promise<void> {
        this.shouldZoomOut = false;
        await this.scheduler.sleepAsync(Constants.semanticZoomInDelayMilliseconds);

        const selectedIndex = this.orderedArtists.findIndex((elem) => elem.zoomHeader === text && elem.isZoomHeader);

        if (selectedIndex > -1) {
            this.viewPort.scrollToIndex(selectedIndex, 'smooth');
        }
    }
}
