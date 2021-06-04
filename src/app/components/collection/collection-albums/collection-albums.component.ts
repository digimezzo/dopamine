import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { Scheduler } from '../../../core/scheduler/scheduler';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { AlbumsAlbumsPersister } from './albums-albums-persister';
import { AlbumsTracksPersister } from './albums-tracks-persister';

@Component({
    selector: 'app-collection-albums',
    templateUrl: './collection-albums.component.html',
    styleUrls: ['./collection-albums.component.scss'],
    providers: [AlbumsAlbumsPersister, AlbumsTracksPersister],
})
export class CollectionAlbumsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;

    constructor(
        public albumsPersister: AlbumsAlbumsPersister,
        public tracksPersister: AlbumsTracksPersister,
        private albumService: BaseAlbumService,
        private trackService: BaseTrackService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = 100 - this.settings.albumsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.albumsRightPaneWidthPercent;

    public albums: AlbumModel[] = [];
    public tracks: TrackModels = new TrackModels();

    public get selectedAlbumOrder(): AlbumOrder {
        return this._selectedAlbumOrder;
    }
    public set selectedAlbumOrder(v: AlbumOrder) {
        this._selectedAlbumOrder = v;
        this.albumsPersister.setSelectedAlbumOrder(v);
    }

    public ngOnDestroy(): void {
        this.albums = [];
        this.tracks = new TrackModels();
    }

    public async ngOnInit(): Promise<void> {
        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.fillListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.albumsRightPaneWidthPercent = event.sizes[1];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(250);

        try {
            this.albums = this.albumService.getAllAlbums();
            this.tracks = this.trackService.getAllTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionAlbumsComponent', 'fillLists');
        }
    }
}
