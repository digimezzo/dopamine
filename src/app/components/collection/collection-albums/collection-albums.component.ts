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
    private _activeAlbumOrder: AlbumOrder;
    private _activeAlbum: AlbumModel;

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

    public get activeAlbumOrder(): AlbumOrder {
        return this._activeAlbumOrder;
    }
    public set activeAlbumOrder(v: AlbumOrder) {
        this._activeAlbumOrder = v;
        this.albumsPersister.saveActiveAlbumOrderToSettings(v);
    }

    public get activeAlbum(): AlbumModel {
        return this._activeAlbum;
    }
    public set activeAlbum(v: AlbumModel) {
        this._activeAlbum = v;
        this.albumsPersister.saveActiveAlbumToSettings(v);
    }

    public ngOnDestroy(): void {
        this.albums = [];
    }

    public ngOnInit(): void {
        this.activeAlbumOrder = this.albumsPersister.getActiveAlbumOrderFromSettings();
        this.fillLists();
        this.activeAlbum = this.albumsPersister.getActiveAlbumFromSettings(this.albums);
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
