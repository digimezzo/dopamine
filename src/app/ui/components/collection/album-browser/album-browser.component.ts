import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { NativeElementProxy } from '../../../../common/native-element-proxy';
import { AlbumModel } from '../../../../services/album/album-model';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { AlbumOrder, albumOrderKey } from '../album-order';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';
import { ApplicationServiceBase } from '../../../../services/application/application.service.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../context-menu-opener';
import { Timer } from '../../../../common/scheduling/timer';
import { Subject } from 'rxjs';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { TrackModels } from '../../../../services/track/track-models';
import { TrackServiceBase } from '../../../../services/track/track.service.base';

@Component({
    selector: 'app-album-browser',
    host: { style: 'display: block' },
    templateUrl: './album-browser.component.html',
    styleUrls: ['./album-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class AlbumBrowserComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private _albums: AlbumModel[] = [];
    private _albumsPersister: BaseAlbumsPersister;
    private availableWidthInPixels: number = 0;
    private destroy$ = new Subject<void>();

    public constructor(
        public trackService: TrackServiceBase,
        public playbackService: PlaybackService,
        private applicationService: ApplicationServiceBase,
        private albumRowsGetter: AlbumRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        public addToPlaylistMenu: AddToPlaylistMenu,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public readonly albumOrders: AlbumOrder[] = Object.values(AlbumOrder).filter((x): x is AlbumOrder => typeof x === 'number');
    public readonly albumOrderKey = albumOrderKey;

    public albumOrderEnum: typeof AlbumOrder = AlbumOrder;

    public useCompactYearView: boolean = false;

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public toggleYearView(): void {
        this.useCompactYearView = !this.useCompactYearView;
        this.settings.useCompactYearView = this.useCompactYearView;
        this.orderAlbums();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['albums'] || changes['albumsPersister']) {
            if (this.albumsPersister) {
                this.orderAlbums();
            }
        }
    }

    @ViewChild('albumContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public albumContextMenu: MatMenuTrigger;

    public albumRows: AlbumRow[] = [];

    public selectedAlbumOrder: AlbumOrder;

    @ViewChild('albumBrowserElement') public albumBrowserElement: ElementRef;

    public get albumsPersister(): BaseAlbumsPersister {
        return this._albumsPersister;
    }

    @Input()
    public set albumsPersister(v: BaseAlbumsPersister) {
        this._albumsPersister = v;
        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
    }

    public get albums(): AlbumModel[] {
        return this._albums;
    }

    @Input()
    public set albums(v: AlbumModel[]) {
        this._albums = v;
        this.mouseSelectionWatcher.initialize(this.albums, false);
    }

    public get isSortedByYear(): boolean {
        return this.selectedAlbumOrder === AlbumOrder.byYearAscending || this.selectedAlbumOrder === AlbumOrder.byYearDescending;
    }

    public ngOnInit(): void {
        this.useCompactYearView = this.settings.useCompactYearView;
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.initializeAvailableWidth();

            this.applicationService.windowSizeChanged$
                .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds), takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.hasAvailableWidthChanged()) {
                        this.orderAlbums();
                    }
                });

            this.applicationService.mouseButtonReleased$
                .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds), takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.hasAvailableWidthChanged()) {
                        this.orderAlbums();
                    }
                });
        }, 0);
    }

    public setSelectedAlbums(event: MouseEvent, albumToSelect: AlbumModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, albumToSelect);
        this.albumsPersister.setSelectedAlbums(this.mouseSelectionWatcher.selectedItems as AlbumModel[]);
    }

    public applyAlbumOrder = (albumOrder: AlbumOrder): void => {
        this.selectedAlbumOrder = albumOrder;
        this.albumsPersister.setSelectedAlbumOrder(this.selectedAlbumOrder);
        this.orderAlbums();
    };

    private applySelectedAlbums(): void {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums == undefined) {
            return;
        }

        for (const selectedAlbum of selectedAlbums) {
            selectedAlbum.isSelected = true;
        }
    }

    private orderAlbums(): void {
        try {
            const timer = new Timer();
            timer.start();

            this.albumRows = this.albumRowsGetter.getAlbumRows(
                this.availableWidthInPixels,
                this.albums,
                this.selectedAlbumOrder,
                this.useCompactYearView,
            );
            this.applySelectedAlbums();

            timer.stop();

            this.logger.info(
                `Finished ordering albums. Time required: ${timer.elapsedMilliseconds} ms`,
                'AlbumBrowserComponent',
                'orderAlbums',
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order albums', 'AlbumBrowserComponent', 'orderAlbums');
        }
    }

    private initializeAvailableWidth(): void {
        this.availableWidthInPixels = this.nativeElementProxy.getElementWidth(this.albumBrowserElement);
    }

    private hasAvailableWidthChanged(): boolean {
        const newAvailableWidthInPixels: number = this.nativeElementProxy.getElementWidth(this.albumBrowserElement);

        if (this.availableWidthInPixels === newAvailableWidthInPixels) {
            return false;
        }

        this.availableWidthInPixels = newAvailableWidthInPixels;

        return true;
    }

    public onAlbumContextMenu(event: MouseEvent, album: AlbumModel): void {
        this.contextMenuOpener.open(this.albumContextMenu, event, album);
    }

    public async onAddToQueueAsync(album: AlbumModel): Promise<void> {
        await this.playbackService.addAlbumToQueueAsync(album);
    }

    public async onShuffleAndPlayAsync(album: AlbumModel): Promise<void> {
        if (album == undefined) {
            return;
        }

        this.playbackService.forceShuffled();
        await this.playbackService.enqueueAndPlayAlbumAsync(album);
    }

    public async shuffleAllAsync(): Promise<void> {
        const tracks: TrackModels = this.trackService.getVisibleTracks();
        this.playbackService.forceShuffled();
        await this.playbackService.enqueueAndPlayTracksAsync(tracks.tracks);
    }
}
