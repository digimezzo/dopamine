import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { AlbumModel } from '../../../../services/album/album-model';
import { TrackModels } from '../../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { AlbumsAlbumsPersister } from './albums-albums-persister';
import { AlbumsTracksPersister } from './albums-tracks-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { AlbumServiceBase } from '../../../../services/album/album-service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-collection-albums',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './collection-albums.component.html',
    styleUrls: ['./collection-albums.component.scss'],
})
export class CollectionAlbumsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        public albumsPersister: AlbumsAlbumsPersister,
        public tracksPersister: AlbumsTracksPersister,
        private indexingService: IndexingService,
        private collectionService: CollectionServiceBase,
        private albumService: AlbumServiceBase,
        private trackService: TrackServiceBase,
        private settings: SettingsBase,
        private scheduler: SchedulerBase,
        private logger: Logger,
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
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.albumsPersister.selectedAlbumsChanged$.subscribe((albumKeys: string[]) => {
                this.getTracksForAlbumKeys(albumKeys);
            }),
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.fillListsAsync();
    }

    public splitDragEnd(event: IOutputData): void {
        this.settings.albumsRightPaneWidthPercent = <number>event.sizes[1];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getAlbums();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getTracks();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionAlbumsComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.albums = [];
        this.tracks = new TrackModels();
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
            this.tracks = this.trackService.getVisibleTracks();
        }
    }
}
