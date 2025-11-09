import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { AlbumModel } from '../../../../services/album/album-model';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
import { TrackModels } from '../../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { ArtistsAlbumsPersister } from './artists-albums-persister';
import { ArtistsPersister } from './artists-persister';
import { ArtistsTracksPersister } from './artists-tracks-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { ArtistServiceBase } from '../../../../services/artist/artist.service.base';
import { AlbumServiceBase } from '../../../../services/album/album-service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-collection-artists',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './collection-artists.component.html',
    styleUrls: ['./collection-artists.component.scss'],
})
export class CollectionArtistsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        public artistsPersister: ArtistsPersister,
        public albumsPersister: ArtistsAlbumsPersister,
        public tracksPersister: ArtistsTracksPersister,
        private indexingService: IndexingService,
        private collectionService: CollectionServiceBase,
        private artistService: ArtistServiceBase,
        private albumService: AlbumServiceBase,
        private trackService: TrackServiceBase,
        private settings: SettingsBase,
        private scheduler: SchedulerBase,
        private logger: Logger,
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
            this.artistsPersister.selectedArtistsChanged$.subscribe(async (displayNames: string[]) => {
                this.albumsPersister.resetSelectedAlbums();
                const artists: ArtistModel[] = this.getArtistsByDisplayNames(displayNames);
                await this.getAlbumsForArtistsAsync(artists);
                await this.getTracksForArtistsAsync(artists);
            }),
        );

        this.subscription.add(
            this.artistsPersister.selectedArtistTypeChanged$.subscribe(async () => {
                this.albumsPersister.resetSelectedAlbums();
                await this.getArtistsAsync();
            }),
        );

        this.subscription.add(
            this.albumsPersister.selectedAlbumsChanged$.subscribe(async (albumKeys: string[]) => {
                await this.getTracksForAlbumKeysAsync(albumKeys);
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
        this.settings.artistsLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = <number>event.sizes[2];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getArtistsAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getAlbumsAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getTracksAsync();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionArtistsComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.artists = [];
        this.albums = [];
        this.tracks = new TrackModels();
    }

    private async getArtistsAsync(): Promise<void> {
        const selectedArtistType: ArtistType = this.artistsPersister.getSelectedArtistType();
        this.artists = await this.artistService.getArtistsAsync(selectedArtistType);
    }

    private async getAlbumsAsync(): Promise<void> {
        const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);
        await this.getAlbumsForArtistsAsync(selectedArtists);
    }

    private async getTracksAsync(): Promise<void> {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums.length > 0) {
            await this.getTracksForAlbumKeysAsync(selectedAlbums.map((x) => x.albumKey));
        } else {
            const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);
            await this.getTracksForArtistsAsync(selectedArtists);
        }
    }

    private async getTracksForArtistsAsync(artists: ArtistModel[]): Promise<void> {
        if (artists.length > 0) {
            const artistType: ArtistType = this.artistsPersister.getSelectedArtistType();
            this.tracks = await this.trackService.getTracksForArtistsAsync(artists, artistType);
        } else {
            this.tracks = await this.trackService.getVisibleTracksAsync();
        }
    }

    private async getTracksForAlbumKeysAsync(albumKeys: string[]): Promise<void> {
        if (albumKeys.length > 0) {
            this.tracks = await this.trackService.getTracksForAlbumsAsync(albumKeys);
        } else {
            this.tracks = await this.trackService.getVisibleTracksAsync();
        }
    }

    private async getAlbumsForArtistsAsync(artists: ArtistModel[]): Promise<void> {
        if (artists.length > 0) {
            const selectedArtistType: ArtistType = this.artistsPersister.getSelectedArtistType();
            this.albums = await this.albumService.getAlbumsForArtistsAsync(artists, selectedArtistType);
        } else {
            this.albums = await this.albumService.getAllAlbumsAsync();
        }
    }

    private getArtistsByDisplayNames(displayNames: string[]): ArtistModel[] {
        return this.artists.filter((artist) => displayNames.includes(artist.displayName));
    }
}
