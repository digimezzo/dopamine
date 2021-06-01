import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Logger } from '../../../core/logger';
import { MouseSelectionWatcher } from '../../../core/mouse-selection-watcher';
import { NativeElementProxy } from '../../../core/native-element-proxy';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
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
        private applicationService: BaseApplicationService,
        private albumRowsGetter: AlbumRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private logger: Logger
    ) {}

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
        this.orderAlbums();
    }

    public get albums(): AlbumModel[] {
        return this._albums;
    }

    @Input()
    public set albums(v: AlbumModel[]) {
        this._albums = v;
        this.orderAlbums();
    }

    public ngOnInit(): void {
        this.applicationService.windowSizeChanged$.subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderAlbums();
            }
        });

        this.applicationService.mouseButtonReleased$.subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderAlbums();
            }
        });

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        this.mouseSelectionWatcher.initialize(this.albums, false);
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
        let albumKeys: string[] = [];

        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums != undefined) {
            albumKeys = selectedAlbums.map((x) => x.albumKey);
        }

        for (const album of this.albums) {
            if (albumKeys.includes(album.albumKey)) {
                album.isSelected = true;
            }
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
}
