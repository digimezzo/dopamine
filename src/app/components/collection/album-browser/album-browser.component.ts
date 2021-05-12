import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Logger } from '../../../core/logger';
import { NativeElementProxy } from '../../../core/native-element-proxy';
import { SelectionWatcher } from '../../../core/selection-watcher';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
import { AlbumOrder } from '../album-order';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';

@Component({
    selector: 'app-album-browser',
    host: { style: 'display: block' },
    templateUrl: './album-browser.component.html',
    styleUrls: ['./album-browser.component.scss'],
})
export class AlbumBrowserComponent implements OnInit, AfterViewInit {
    private _albums: AlbumModel[] = [];
    private availableWidthInPixels: number = 0;

    constructor(
        private applicationService: BaseApplicationService,
        private albumRowsGetter: AlbumRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        private selectionWatcher: SelectionWatcher,
        private logger: Logger
    ) {}

    public albumOrderEnum: typeof AlbumOrder = AlbumOrder;
    public albumRows: AlbumRow[] = [];

    @ViewChild('albumBrowserElement') public albumBrowserElement: ElementRef;

    @Input() public selectedAlbumOrder: AlbumOrder;
    @Output() public selectedAlbumOrderChange: EventEmitter<AlbumOrder> = new EventEmitter<AlbumOrder>();

    @Input()
    public set selectedAlbums(v: AlbumModel[]) {
        this.applySelectedAlbums(v);
    }

    @Output() public selectedAlbumsChange: EventEmitter<AlbumModel[]> = new EventEmitter<AlbumModel[]>();

    public get albums(): AlbumModel[] {
        return this._albums;
    }

    @Input()
    public set albums(v: AlbumModel[]) {
        this._albums = v;
        this.fillAlbumRows();
    }

    public ngOnInit(): void {
        this.applicationService.windowSizeChanged$.subscribe(() => {
            this.fillAlbumRowsIfAvailableWidthChanged();
        });

        this.applicationService.mouseButtonReleased$.subscribe(() => {
            this.fillAlbumRowsIfAvailableWidthChanged();
        });
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.fillAlbumRows();
        }, 0);
    }

    public setSelectedAlbums(event: any, albumToSelect: AlbumModel): void {
        if (event && event.ctrlKey) {
            // CTRL is pressed: add item to, or remove item from selection
            this.selectionWatcher.toggleItemSelection(albumToSelect);
        } else if (event && event.shiftKey) {
            // SHIFT is pressed: select a range of items
            this.selectionWatcher.selectItemsRange(albumToSelect);
        } else {
            // No modifier key is pressed: select only 1 item
            this.selectionWatcher.selectSingleItem(albumToSelect);
        }

        this.selectedAlbumsChange.emit(this.selectionWatcher.selectedItems);
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

        this.selectedAlbumOrderChange.emit(this.selectedAlbumOrder);

        this.fillAlbumRows();
    }

    private applySelectedAlbums(selectedAlbums: AlbumModel[]): void {
        let albumKeys: string[] = [];

        if (selectedAlbums != undefined) {
            albumKeys = selectedAlbums.map((x) => x.albumKey);
        }

        for (const album of this.albums) {
            if (albumKeys.includes(album.albumKey)) {
                album.isSelected = true;
            }
        }

        this.selectedAlbumsChange.emit(this.albums.filter((x) => x.isSelected));
    }

    private fillAlbumRowsIfAvailableWidthChanged(): void {
        try {
            const newAvailableWidthInPixels: number = this.nativeElementProxy.getElementWidth(this.albumBrowserElement);

            if (newAvailableWidthInPixels === 0) {
                return;
            }

            if (this.availableWidthInPixels === newAvailableWidthInPixels) {
                return;
            }

            this.availableWidthInPixels = newAvailableWidthInPixels;
            this.albumRows = this.albumRowsGetter.getAlbumRows(newAvailableWidthInPixels, this.albums, this.selectedAlbumOrder);
        } catch (e) {
            this.logger.error(
                `Could not fill album rows after available width changed. Error: ${e.message}`,
                'AlbumBrowserComponent',
                'fillAlbumRowsIfAvailableWidthChanged'
            );
        }
    }

    private fillAlbumRows(): void {
        try {
            const newAvailableWidthInPixels: number = this.nativeElementProxy.getElementWidth(this.albumBrowserElement);

            if (newAvailableWidthInPixels === 0) {
                return;
            }

            this.availableWidthInPixels = newAvailableWidthInPixels;
            this.albumRows = this.albumRowsGetter.getAlbumRows(newAvailableWidthInPixels, this.albums, this.selectedAlbumOrder);

            this.selectionWatcher.reset(this.albums, false);
        } catch (e) {
            this.logger.error(`Could not fill album rows. Error: ${e.message}`, 'AlbumBrowserComponent', 'fillAlbumRows');
        }
    }
}
