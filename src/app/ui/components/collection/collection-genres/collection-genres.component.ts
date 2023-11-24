import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { AlbumModel } from '../../../../services/album/album-model';
import { GenreModel } from '../../../../services/genre/genre-model';
import { TrackModels } from '../../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresPersister } from './genres-persister';
import { GenresTracksPersister } from './genres-tracks-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { GenreServiceBase } from '../../../../services/genre/genre.service.base';
import { AlbumServiceBase } from '../../../../services/album/album-service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-collection-genres',
    templateUrl: './collection-genres.component.html',
    styleUrls: ['./collection-genres.component.scss'],
})
export class CollectionGenresComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        public genresPersister: GenresPersister,
        public albumsPersister: GenresAlbumsPersister,
        public tracksPersister: GenresTracksPersister,
        private collectionPersister: CollectionPersister,
        private indexingService: IndexingServiceBase,
        private collectionService: CollectionServiceBase,
        private genreService: GenreServiceBase,
        private albumService: AlbumServiceBase,
        private trackService: TrackServiceBase,
        private settings: SettingsBase,
        private scheduler: SchedulerBase,
        private logger: Logger,
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
            }),
        );

        this.subscription.add(
            this.albumsPersister.selectedAlbumsChanged$.subscribe((albumKeys: string[]) => {
                this.getTracksForAlbumKeys(albumKeys);
            }),
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            }),
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            }),
        );

        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            }),
        );

        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        await this.processListsAsync();
    }

    public splitDragEnd(event: IOutputData): void {
        this.settings.genresLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.genresRightPaneWidthPercent = <number>event.sizes[2];
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
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionGenresComponent', 'fillListsAsync');
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
