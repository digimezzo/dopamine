import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { AlbumOrder } from '../album-order';
import { AlbumsPersister } from './albums-persister';

@Component({
    selector: 'app-collection-albums',
    templateUrl: './collection-albums.component.html',
    styleUrls: ['./collection-albums.component.scss'],
})
export class CollectionAlbumsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private _selectedAlbums: AlbumModel[];

    constructor(
        public playbackService: BasePlaybackService,
        private albumService: BaseAlbumService,
        private albumsPersister: AlbumsPersister,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    public leftPaneSize: number = 100 - this.settings.albumsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.albumsRightPaneWidthPercent;

    public albums: AlbumModel[] = [];

    public get selectedAlbumOrder(): AlbumOrder {
        return this._selectedAlbumOrder;
    }
    public set selectedAlbumOrder(v: AlbumOrder) {
        this._selectedAlbumOrder = v;
        this.albumsPersister.saveSelectedAlbumOrderToSettings(v);
    }

    public get selectedAlbums(): AlbumModel[] {
        return this._selectedAlbums;
    }

    public set selectedAlbums(v: AlbumModel[]) {
        this._selectedAlbums = v;
        this.albumsPersister.saveSelectedAlbumsToSettings(v);
    }

    public ngOnDestroy(): void {
        this.albums = [];
    }

    public ngOnInit(): void {
        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrderFromSettings();
        this.fillLists();
        this.selectedAlbums = this.albumsPersister.getSelectedAlbumsFromSettings(this.albums);
    }

    public splitDragEnd(event: any): void {
        this.settings.albumsRightPaneWidthPercent = event.sizes[1];
    }

    private fillLists(): void {
        if (this.albums.length === 0) {
            try {
                this.albums = this.albumService.getAllAlbums();
            } catch (e) {
                this.logger.error(`Could not get folders. Error: ${e.message}`, 'CollectionAlbumsComponent', 'fillLists');
            }
        }
    }
}
