import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { ArtistModel } from '../../../services/artist/artist-model';
import { ArtistType } from '../../../services/artist/artist-type';
import { BaseArtistService } from '../../../services/artist/base-artist.service';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { ArtistsAlbumsPersister } from './artists-albums-persister';
import { ArtistsPersister } from './artists-persister';
import { ArtistsTracksPersister } from './artists-tracks-persister';

@Component({
    selector: 'app-collection-artists',
    templateUrl: './collection-artists.component.html',
    styleUrls: ['./collection-artists.component.scss'],
})
export class CollectionArtistsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    constructor(
        public searchService: BaseSearchService,
        public artistsPersister: ArtistsPersister,
        public albumsPersister: ArtistsAlbumsPersister,
        public tracksPersister: ArtistsTracksPersister,
        private collectionPersister: CollectionPersister,
        private indexingService: BaseIndexingService,
        private collectionService: BaseCollectionService,
        private artistService: BaseArtistService,
        private albumService: BaseAlbumService,
        private trackService: BaseTrackService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.artistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.artistsLeftPaneWidthPercent - this.settings.artistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.artistsRightPaneWidthPercent;

    public artists: ArtistModel[] = [];
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
            this.artistsPersister.selectedArtistsChanged$.subscribe((artists: string[]) => {
                this.albumsPersister.resetSelectedAlbums();
                this.getAlbumsForArtists(artists);
                this.getTracksForArtists(artists);
            })
        );

        this.subscription.add(
            this.artistsPersister.selectedArtistTypeChanged$.subscribe((artistType: ArtistType) => {
                this.albumsPersister.resetSelectedAlbums();
                this.getArtists();
            })
        );

        this.subscription.add(
            this.albumsPersister.selectedAlbumsChanged$.subscribe((albumKeys: string[]) => {
                this.getTracksForAlbumKeys(albumKeys);
            })
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(async () => {
                await this.processListsAsync();
            })
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(async () => {
                await this.processListsAsync();
            })
        );

        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(async () => {
                await this.processListsAsync();
            })
        );

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.processListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.artistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = event.sizes[2];
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === Constants.artistsTabLabel) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getArtists();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getAlbums();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionArtistsComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.artists = [];
        this.albums = [];
        this.tracks = new TrackModels();
    }

    private getArtists(): void {
        const selectedArtistType: ArtistType = this.artistsPersister.getSelectedArtistType();
        this.artists = this.artistService.getArtists(selectedArtistType);
    }

    private getAlbums(): void {
        const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);
        this.getAlbumsForArtists(selectedArtists.map((x) => x.displayName));
    }

    private getTracks(): void {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums.length > 0) {
            this.getTracksForAlbumKeys(selectedAlbums.map((x) => x.albumKey));
        } else {
            const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);
            this.getTracksForArtists(selectedArtists.map((x) => x.displayName));
        }
    }

    private getTracksForArtists(artists: string[]): void {
        if (artists.length > 0) {
            const artistType: ArtistType = this.artistsPersister.getSelectedArtistType();
            this.tracks = this.trackService.getTracksForArtists(artists, artistType);
        } else {
            this.tracks = this.trackService.getVisibleTracks();
        }
    }

    private getTracksForAlbumKeys(albumKeys: string[]): void {
        if (albumKeys.length > 0) {
            this.tracks = this.trackService.getTracksForAlbums(albumKeys);
        } else {
            this.tracks = this.trackService.getVisibleTracks();
        }
    }

    private getAlbumsForArtists(artists: string[]): void {
        if (artists.length > 0) {
            const selectedArtistType: ArtistType = this.artistsPersister.getSelectedArtistType();
            this.albums = this.albumService.getAlbumsForArtists(artists, selectedArtistType);
        } else {
            this.albums = this.albumService.getAllAlbums();
        }
    }
}
