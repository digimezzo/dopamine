import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseGenreService } from '../../../services/genre/base-genre.service';
import { GenreModel } from '../../../services/genre/genre-model';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresPersister } from './genres-persister';
import { GenresTracksPersister } from './genres-tracks-persister';

@Component({
    selector: 'app-collection-genres',
    templateUrl: './collection-genres.component.html',
    styleUrls: ['./collection-genres.component.scss'],
})
export class CollectionGenresComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    constructor(
        public searchService: BaseSearchService,
        public genresPersister: GenresPersister,
        public albumsPersister: GenresAlbumsPersister,
        public tracksPersister: GenresTracksPersister,
        private collectionPersister: CollectionPersister,
        private indexingService: BaseIndexingService,
        private collectionService: BaseCollectionService,
        private genreService: BaseGenreService,
        private albumService: BaseAlbumService,
        private trackService: BaseTrackService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.genresLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.genresLeftPaneWidthPercent - this.settings.genresRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.genresRightPaneWidthPercent;

    public genres: GenreModel[] = [];
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
            this.genresPersister.selectedGenresChanged$.subscribe((genres: string[]) => {
                this.albumsPersister.resetSelectedAlbums();
                this.getAlbumsForGenres(genres);
                this.getTracksForGenres(genres);
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
        this.settings.genresLeftPaneWidthPercent = event.sizes[0];
        this.settings.genresRightPaneWidthPercent = event.sizes[2];
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === Constants.genresTabLabel) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getGenres();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getAlbums();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            this.getTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionGenresComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.genres = [];
        this.albums = [];
        this.tracks = new TrackModels();
    }

    private getGenres(): void {
        this.genres = this.genreService.getGenres();
    }

    private getAlbums(): void {
        const selectedGenres: GenreModel[] = this.genresPersister.getSelectedGenres(this.genres);
        this.getAlbumsForGenres(selectedGenres.map((x) => x.displayName));
    }

    private getTracks(): void {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums.length > 0) {
            this.getTracksForAlbumKeys(selectedAlbums.map((x) => x.albumKey));
        } else {
            const selectedGenres: GenreModel[] = this.genresPersister.getSelectedGenres(this.genres);
            this.getTracksForGenres(selectedGenres.map((x) => x.displayName));
        }
    }

    private getTracksForGenres(genres: string[]): void {
        if (genres.length > 0) {
            this.tracks = this.trackService.getTracksForGenres(genres);
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

    private getAlbumsForGenres(genres: string[]): void {
        if (genres.length > 0) {
            this.albums = this.albumService.getAlbumsForGenres(genres);
        } else {
            this.albums = this.albumService.getAllAlbums();
        }
    }
}
