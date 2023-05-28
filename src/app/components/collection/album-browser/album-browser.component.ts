import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { debounceTime } from 'rxjs/operators';
import { Constants } from '../../../common/application/constants';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { NativeElementProxy } from '../../../common/native-element-proxy';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { AlbumOrder } from '../album-order';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';

@Component({
    selector: 'app-album-browser',
    host: { style: 'display: block' },
    templateUrl: './album-browser.component.html',
    styleUrls: ['./album-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class AlbumBrowserComponent implements OnInit, AfterViewInit {
    private _albums: AlbumModel[] = [];
    private _albumsPersister: BaseAlbumsPersister;
    private availableWidthInPixels: number = 0;

    constructor(
        public playbackService: BasePlaybackService,
        private applicationService: BaseApplicationService,
        private albumRowsGetter: AlbumRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        public addToPlaylistMenu: AddToPlaylistMenu,
        private logger: Logger
    ) {}

    @ViewChild('albumContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public albumContextMenu: MatMenuTrigger;

    public albumOrderEnum: typeof AlbumOrder = AlbumOrder;
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
        this.orderAlbums();
    }

    public get albums(): AlbumModel[] {
        return this._albums;
    }

    @Input()
    public set albums(v: AlbumModel[]) {
        this._albums = v;
        this.mouseSelectionWatcher.initialize(this.albums, false);

        // When the component is first rendered, it happens that albumsPersister is undefined.
        if (this.albumsPersister != undefined) {
            this.orderAlbums();
        }
    }

    public ngOnInit(): void {
        this.applicationService.windowSizeChanged$.pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds)).subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderAlbums();
            }
        });

        this.applicationService.mouseButtonReleased$.pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds)).subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderAlbums();
            }
        });
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.initializeAvailableWidth();
            this.orderAlbums();
        }, 0);
    }

    public setSelectedAlbums(event: any, albumToSelect: AlbumModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, albumToSelect);
        this.albumsPersister.setSelectedAlbums(this.mouseSelectionWatcher.selectedItems);
    }

    public toggleAlbumOrder(): void {
        switch (this.selectedAlbumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                this.selectedAlbumOrder = AlbumOrder.byAlbumTitleDescending;
                break;
            case AlbumOrder.byAlbumTitleDescending:
                this.selectedAlbumOrder = AlbumOrder.byDateAdded;
                break;
            case AlbumOrder.byDateAdded:
                this.selectedAlbumOrder = AlbumOrder.byDateCreated;
                break;
            case AlbumOrder.byDateCreated:
                this.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
                break;
            case AlbumOrder.byAlbumArtist:
                this.selectedAlbumOrder = AlbumOrder.byYearAscending;
                break;
            case AlbumOrder.byYearAscending:
                this.selectedAlbumOrder = AlbumOrder.byYearDescending;
                break;
            case AlbumOrder.byYearDescending:
                this.selectedAlbumOrder = AlbumOrder.byLastPlayed;
                break;
            case AlbumOrder.byLastPlayed:
                this.selectedAlbumOrder = AlbumOrder.random;
                break;
            case AlbumOrder.random:
                this.selectedAlbumOrder = AlbumOrder.byAlbumTitleAscending;
                break;
            default: {
                this.selectedAlbumOrder = AlbumOrder.byAlbumTitleAscending;
                break;
            }
        }

        this.albumsPersister.setSelectedAlbumOrder(this.selectedAlbumOrder);
        this.orderAlbums();
    }

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
            this.albumRows = this.albumRowsGetter.getAlbumRows(this.availableWidthInPixels, this.albums, this.selectedAlbumOrder);
            this.applySelectedAlbums();
        } catch (e) {
            this.logger.error(`Could not order albums. Error: ${e.message}`, 'AlbumBrowserComponent', 'orderAlbums');
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

    public async onAlbumContextMenuAsync(event: MouseEvent, album: AlbumModel): Promise<void> {
        this.contextMenuOpener.open(this.albumContextMenu, event, album);
    }

    public async onAddToQueueAsync(album: AlbumModel): Promise<void> {
        await this.playbackService.addAlbumToQueueAsync(album);
    }
}
