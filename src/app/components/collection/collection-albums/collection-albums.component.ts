import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { AlbumOrder } from '../album-order';
import { AlbumsPersister } from './albums-persister';

@Component({
    selector: 'app-collection-albums',
    templateUrl: './collection-albums.component.html',
    styleUrls: ['./collection-albums.component.scss'],
})
export class CollectionAlbumsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;

    constructor(
        public albumsPersister: AlbumsPersister,
        private albumService: BaseAlbumService,
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
        this.albumsPersister.setSelectedAlbumOrder(v);
    }

    public ngOnDestroy(): void {
        this.albums = [];
    }

    public ngOnInit(): void {
        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        this.fillLists();
    }

    public splitDragEnd(event: any): void {
        this.settings.albumsRightPaneWidthPercent = event.sizes[1];
    }

    private fillLists(): void {
        try {
            this.albums = this.albumService.getAllAlbums();
        } catch (e) {
            this.logger.error(`Could not get albums. Error: ${e.message}`, 'CollectionAlbumsComponent', 'fillLists');
        }
    }
}
