import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constants } from '../../../core/base/constants';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { AlbumOrder } from '../album-order';
import { AlbumRow } from '../album-row';
import { AlbumSpaceCalculator } from '../album-space-calculator';

@Component({
    selector: 'app-collection-albums',
    templateUrl: './collection-albums.component.html',
    styleUrls: ['./collection-albums.component.scss'],
})
export class CollectionAlbumsComponent implements OnInit, OnDestroy {
    constructor(
        public playbackService: BasePlaybackService,
        private albumService: BaseAlbumService,
        private albumSpaceCalculator: AlbumSpaceCalculator,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    // This is required to use enum values in the template
    public albumOrder: typeof AlbumOrder = AlbumOrder;

    private subscription: Subscription = new Subscription();

    public leftPaneSize: number = 100 - this.settings.albumsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.albumsRightPaneWidthPercent;

    public albums: AlbumModel[] = [];
    public albumRows: AlbumRow[] = [];

    public selectedAlbum: AlbumModel;

    public activeAlbumOrder: AlbumOrder = AlbumOrder.byAlbumTitleAscending;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.fillLists();

        fromEvent(window, 'resize')
            .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds))
            .subscribe((event: any) => {
                this.fillLists();
            });
    }

    public splitDragEnd(event: any): void {
        this.settings.albumsRightPaneWidthPercent = event.sizes[1];
        this.fillLists();
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

        this.fillLists();
    }

    public setSelectedAlbum(event: any, album: AlbumModel): void {
        if (event.ctrlKey) {
            this.selectedAlbum = undefined;
        } else {
            this.selectedAlbum = album;
        }
    }

    private fillLists(): void {
        if (this.albums.length === 0) {
            this.albums = this.albumService.getAllAlbums();
        }

        const numberOfAlbumsPerRow: number = this.albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
            Constants.albumSizeInPixels,
            100 - this.settings.albumsRightPaneWidthPercent
        );

        this.albumRows = [];

        let orderedAlbums: AlbumModel[] = [];

        switch (this.activeAlbumOrder) {
            case AlbumOrder.byAlbumTitleAscending:
                orderedAlbums = this.albums.sort((a, b) => (a.albumTitle > b.albumTitle ? 1 : -1));
                break;
            case AlbumOrder.byAlbumTitleDescending:
                orderedAlbums = this.albums.sort((a, b) => (a.albumTitle < b.albumTitle ? 1 : -1));
                break;
            case AlbumOrder.byDateAdded:
                orderedAlbums = this.albums.sort((a, b) => (a.dateAddedInTicks < b.dateAddedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byDateCreated:
                orderedAlbums = this.albums.sort((a, b) => (a.dateFileCreatedInTicks < b.dateFileCreatedInTicks ? 1 : -1));
                break;
            case AlbumOrder.byAlbumArtist:
                orderedAlbums = this.albums.sort((a, b) => (a.albumArtist > b.albumArtist ? 1 : -1));
                break;
            case AlbumOrder.byYearAscending:
                orderedAlbums = this.albums.sort((a, b) => (a.year > b.year ? 1 : -1));
                break;
            case AlbumOrder.byYearDescending:
                orderedAlbums = this.albums.sort((a, b) => (a.year < b.year ? 1 : -1));
                break;
            case AlbumOrder.byLastPlayed:
                orderedAlbums = this.albums.sort((a, b) => (a.dateLastPlayedInTicks < b.dateLastPlayedInTicks ? 1 : -1));
                break;
            default: {
                orderedAlbums = this.albums.sort((a, b) => (a.albumTitle > b.albumTitle ? 1 : -1));
                break;
            }
        }

        let lastYear: number = -1;
        const alreadyUsedYearHeaders: string[] = [];

        for (const album of orderedAlbums) {
            if (this.activeAlbumOrder === AlbumOrder.byYearAscending || this.activeAlbumOrder === AlbumOrder.byYearDescending) {
                album.showYear = true;

                if (
                    this.albumRows.length === 0 ||
                    this.albumRows[this.albumRows.length - 1].albums.length === numberOfAlbumsPerRow ||
                    album.year !== lastYear
                ) {
                    if (album.year !== lastYear) {
                        lastYear = album.year;
                    }

                    this.albumRows.push(new AlbumRow());
                }

                if (!alreadyUsedYearHeaders.includes(album.year.toString())) {
                    alreadyUsedYearHeaders.push(album.year.toString());
                    if (album.year == undefined || album.year === 0) {
                        album.yearHeader = '?';
                    } else {
                        album.yearHeader = album.year.toString();
                    }
                } else {
                    album.yearHeader = '';
                }

                this.albumRows[this.albumRows.length - 1].albums.push(album);

                if (this.albumRows[this.albumRows.length - 1].albums[0].yearHeader.length === 0) {
                    album.showYear = false;
                }
            } else {
                album.showYear = false;
                if (this.albumRows.length === 0 || this.albumRows[this.albumRows.length - 1].albums.length === numberOfAlbumsPerRow) {
                    this.albumRows.push(new AlbumRow());
                }

                this.albumRows[this.albumRows.length - 1].albums.push(album);
            }
        }
    }
}
