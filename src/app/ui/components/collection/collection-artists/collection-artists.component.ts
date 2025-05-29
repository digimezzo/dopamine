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
            this.artistsPersister.selectedArtistsChanged$.subscribe((displayNames: string[]) => {
                this.albumsPersister.resetSelectedAlbums();
                const artists: ArtistModel[] = this.getArtistsByDisplayNames(displayNames);
                this.getAlbumsForArtists(artists);
                this.getTracksForArtists(artists);
            }),
        );

        this.subscription.add(
            this.artistsPersister.selectedArtistTypeChanged$.subscribe(() => {
                this.albumsPersister.resetSelectedAlbums();
                this.getArtists();
            }),
        );

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
        this.settings.artistsLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = <number>event.sizes[2];
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
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionArtistsComponent', 'fillListsAsync');
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
        this.getAlbumsForArtists(selectedArtists);
    }

    private getTracks(): void {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums.length > 0) {
            this.getTracksForAlbumKeys(selectedAlbums.map((x) => x.albumKey));
        } else {
            const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);
            this.getTracksForArtists(selectedArtists);
        }
    }

    private getTracksForArtists(artists: ArtistModel[]): void {
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

    private getAlbumsForArtists(artists: ArtistModel[]): void {
        if (artists.length > 0) {
            const selectedArtistType: ArtistType = this.artistsPersister.getSelectedArtistType();
            this.albums = this.albumService.getAlbumsForArtists(artists, selectedArtistType);
        } else {
            this.albums = this.albumService.getAllAlbums();
        }
    }

    private getArtistsByDisplayNames(displayNames: string[]): ArtistModel[] {
        return this.artists.filter((artist) => displayNames.includes(artist.displayName));
    }
}
