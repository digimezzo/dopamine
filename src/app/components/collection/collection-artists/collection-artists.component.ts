import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { ArtistsAlbumsPersister } from './artists-albums-persister';
import { ArtistsTracksPersister } from './artists-tracks-persister';

@Component({
    selector: 'app-collection-artists',
    templateUrl: './collection-artists.component.html',
    styleUrls: ['./collection-artists.component.scss'],
    providers: [ArtistsAlbumsPersister, ArtistsTracksPersister],
})
export class CollectionArtistsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    constructor(
        public albumsPersister: ArtistsAlbumsPersister,
        public tracksPersister: ArtistsTracksPersister,
        private albumService: BaseAlbumService,
        private trackService: BaseTrackService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.artistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.artistsLeftPaneWidthPercent - this.settings.artistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.artistsRightPaneWidthPercent;

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

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.fillListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.artistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = event.sizes[2];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.listLoadDelayMilliseconds);

        try {
            this.getAlbums();
            this.getTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionArtistsComponent', 'fillLists');
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
