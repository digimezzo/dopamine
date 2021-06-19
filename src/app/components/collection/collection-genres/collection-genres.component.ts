import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseGenreService } from '../../../services/genre/base-genre.service';
import { GenreModel } from '../../../services/genre/genre-model';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModels } from '../../../services/track/track-models';
import { AlbumOrder } from '../album-order';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresTracksPersister } from './genres-tracks-persister';

@Component({
    selector: 'app-collection-genres',
    templateUrl: './collection-genres.component.html',
    styleUrls: ['./collection-genres.component.scss'],
    providers: [GenresAlbumsPersister, GenresTracksPersister],
})
export class CollectionGenresComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;
    private subscription: Subscription = new Subscription();

    constructor(
        public albumsPersister: GenresAlbumsPersister,
        public tracksPersister: GenresTracksPersister,
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
        this.fillListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.genresLeftPaneWidthPercent = event.sizes[0];
        this.settings.genresRightPaneWidthPercent = event.sizes[2];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.listLoadDelayMilliseconds);

        try {
            this.getGenres();
            this.getAlbums();
            this.getTracks();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionGenresComponent', 'fillLists');
        }
    }

    private getGenres(): void {
        this.genres = this.genreService.getGenres();
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
            this.tracks = this.trackService.getAlbumTracks(albumKeys);
        } else {
            this.tracks = this.trackService.getAllTracks();
        }
    }
}
