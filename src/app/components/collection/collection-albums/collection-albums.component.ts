import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
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
    private subscription: Subscription = new Subscription();

    constructor(
        public albumsPersister: AlbumsAlbumsPersister,
        public tracksPersister: AlbumsTracksPersister,
        private indexingService: BaseIndexingService,
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
        this.subscription.unsubscribe();
        this.albums = [];
        this.tracks = new TrackModels();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.albumsPersister.selectedAlbumsChanged$.subscribe((albumKeys: string[]) => {
                this.getTracksForAlbumKeys(albumKeys);
            })
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(() => {
                this.fillListsAsync();
            })
        );

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.fillListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.albumsRightPaneWidthPercent = event.sizes[1];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.listLoadDelayMilliseconds);

        try {
            this.getAlbums();
            this.getTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionAlbumsComponent', 'fillLists');
        }
    }

    private getAlbums(): void {
        this.albums = this.albumService.getAllAlbums();
    }

    private getTracks(): void {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);
        this.getTracksForAlbumKeys(selectedAlbums.map((x) => x.albumKey));
    }

    private getTracksForAlbumKeys(albumKeys: string[]): void {
        if (albumKeys.length > 0) {
            this.tracks = this.trackService.getTracksForAlbums(albumKeys);
        } else {
            this.tracks = this.trackService.getAllTracks();
        }
    }
}
