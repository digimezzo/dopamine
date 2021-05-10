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

    @Input() public selectedAlbum: AlbumModel;
    @Output() public selectedAlbumChange: EventEmitter<AlbumModel> = new EventEmitter<AlbumModel>();

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

    public setSelectedAlbum(event: any, album: AlbumModel): void {
        if (event.ctrlKey) {
            this.selectedAlbum = undefined;
        } else {
            this.selectedAlbum = album;
        }

        this.selectedAlbumChange.emit(this.selectedAlbum);
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
        } catch (e) {
            this.logger.error(`Could not fill album rows. Error: ${e.message}`, 'AlbumBrowserComponent', 'fillAlbumRows');
        }
    }
}
