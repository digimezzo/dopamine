import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { AlbumModel } from '../../../../services/album/album-model';
import { GenreModel } from '../../../../services/genre/genre-model';
import { TrackModels } from '../../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresPersister } from './genres-persister';
import { GenresTracksPersister } from './genres-tracks-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { GenreServiceBase } from '../../../../services/genre/genre.service.base';
import { AlbumServiceBase } from '../../../../services/album/album-service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-collection-genres',
    host: { style: 'display: block; width: 100%;' },
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
        private indexingService: IndexingService,
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
            this.genresPersister.selectedGenresChanged$.subscribe(async (genres: string[]) => {
                this.albumsPersister.resetSelectedAlbums();
                await this.getAlbumsForGenresAsync(genres);
                await this.getTracksForGenresAsync(genres);
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
        this.settings.genresLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.genresRightPaneWidthPercent = <number>event.sizes[2];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getGenresAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getAlbumsAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getTracksAsync();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionGenresComponent', 'fillListsAsync');
        }
    }

    private clearLists(): void {
        this.genres = [];
        this.albums = [];
        this.tracks = new TrackModels();
    }

    private async getGenresAsync(): Promise<void> {
        this.genres = await this.genreService.getGenresAsync();
    }

    private async getAlbumsAsync(): Promise<void> {
        const selectedGenres: GenreModel[] = this.genresPersister.getSelectedGenres(this.genres);
        await this.getAlbumsForGenresAsync(selectedGenres.map((x) => x.name));
    }

    private async getTracksAsync(): Promise<void> {
        const selectedAlbums: AlbumModel[] = this.albumsPersister.getSelectedAlbums(this.albums);

        if (selectedAlbums.length > 0) {
            await this.getTracksForAlbumKeysAsync(selectedAlbums.map((x) => x.albumKey));
        } else {
            const selectedGenres: GenreModel[] = this.genresPersister.getSelectedGenres(this.genres);
            await this.getTracksForGenresAsync(selectedGenres.map((x) => x.name));
        }
    }

    private async getTracksForGenresAsync(genres: string[]): Promise<void> {
        if (genres.length > 0) {
            this.tracks = await this.trackService.getTracksForGenresAsync(genres);
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

    private async getAlbumsForGenresAsync(genres: string[]): Promise<void> {
        if (genres.length > 0) {
            this.albums = await this.albumService.getAlbumsForGenresAsync(genres);
        } else {
            this.albums = await this.albumService.getAllAlbumsAsync();
        }
    }
}
