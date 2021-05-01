import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constants } from '../../../core/base/constants';
import { Scheduler } from '../../../core/scheduler/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { AlbumOrder } from '../album-order';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';

@Component({
    selector: 'app-album-browser',
    host: { style: 'display: block' },
    templateUrl: './album-browser.component.html',
    styleUrls: ['./album-browser.component.scss'],
})
export class AlbumBrowserComponent implements OnInit {
    private _albums: AlbumModel[] = [];
    private availableWidthInPixels: number;

    constructor(private albumRowsGetter: AlbumRowsGetter, private scheduler: Scheduler) {}

    public albumOrder: typeof AlbumOrder = AlbumOrder;
    public albumRows: AlbumRow[] = [];

    @ViewChild('albumBrowserElement') public albumBrowserElement: ElementRef;

    @Input() public activeAlbumOrder: AlbumOrder;
    @Output() public activeAlbumOrderChange: EventEmitter<AlbumOrder> = new EventEmitter<AlbumOrder>();

    @Input() public activeAlbum: AlbumModel;
    @Output() public activeAlbumChange: EventEmitter<AlbumModel> = new EventEmitter<AlbumModel>();

    public get albums(): AlbumModel[] {
        return this._albums;
    }

    @Input()
    public set albums(v: AlbumModel[]) {
        this._albums = v;
        this.fillAlbumRows();
    }

    public async ngOnInit(): Promise<void> {
        // HACK: we must wait for the view to be initialized because need the size of view elements.
        // Ideally, we could move this code to ngAfterViewInit(). Unfortunately, Angular in all their wisdom,
        // decided that a ExpressionChangedAfterItHasBeenCheckedError (only in DEV mode! Crazy.) is thrown
        // when code that changes template-bound values is executed in ngAfterViewInit().
        await this.waitForViewInitializationAsync();

        fromEvent(window, 'resize')
            .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds))
            .subscribe((event: any) => {
                this.fillAlbumRowsIfAvailableWidthChanged();
            });

        fromEvent(document, 'mouseup')
            .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds))
            .subscribe((event: any) => {
                this.fillAlbumRowsIfAvailableWidthChanged();
            });

        this.fillAlbumRowsIfAvailableWidthChanged();
    }

    public setActiveAlbum(event: any, album: AlbumModel): void {
        if (event.ctrlKey) {
            this.activeAlbum = undefined;
        } else {
            this.activeAlbum = album;
        }

        this.activeAlbumChange.emit(this.activeAlbum);
    }

    public toggleAlbumOrder(): void {
        switch (this.activeAlbumOrder) {
            case this.albumOrder.byAlbumTitleAscending:
                this.activeAlbumOrder = this.albumOrder.byAlbumTitleDescending;
                break;
            case this.albumOrder.byAlbumTitleDescending:
                this.activeAlbumOrder = this.albumOrder.byDateAdded;
                break;
            case this.albumOrder.byDateAdded:
                this.activeAlbumOrder = this.albumOrder.byDateCreated;
                break;
            case this.albumOrder.byDateCreated:
                this.activeAlbumOrder = this.albumOrder.byAlbumArtist;
                break;
            case this.albumOrder.byAlbumArtist:
                this.activeAlbumOrder = this.albumOrder.byYearAscending;
                break;
            case this.albumOrder.byYearAscending:
                this.activeAlbumOrder = this.albumOrder.byYearDescending;
                break;
            case this.albumOrder.byYearDescending:
                this.activeAlbumOrder = this.albumOrder.byLastPlayed;
                break;
            case this.albumOrder.byLastPlayed:
                this.activeAlbumOrder = this.albumOrder.byAlbumTitleAscending;
                break;
            default: {
                this.activeAlbumOrder = this.albumOrder.byAlbumTitleAscending;
                break;
            }
        }

        this.activeAlbumOrderChange.emit(this.activeAlbumOrder);

        this.fillAlbumRows();
    }

    private async waitForViewInitializationAsync(): Promise<void> {
        while (this.albumBrowserElement == undefined) {
            await this.scheduler.sleepAsync(50);
        }
    }

    private fillAlbumRowsIfAvailableWidthChanged(): void {
        const newAvailableWidthInPixels: number = this.albumBrowserElement.nativeElement.offsetWidth;

        if (this.availableWidthInPixels !== newAvailableWidthInPixels) {
            this.availableWidthInPixels = newAvailableWidthInPixels;
            this.fillAlbumRows();
        }
    }

    private fillAlbumRows(): void {
        if (this.albumBrowserElement == undefined) {
            return;
        }

        this.albumRows = this.albumRowsGetter.getAlbumRows(this.availableWidthInPixels, this.activeAlbumOrder, this.albums);
    }
}
