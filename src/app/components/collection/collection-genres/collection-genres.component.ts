import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { Scheduler } from '../../../core/scheduler/scheduler';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { AlbumOrder } from '../album-order';
import { GenresAlbumsPersister } from './genres-albums-persister';

@Component({
    selector: 'app-collection-genres',
    templateUrl: './collection-genres.component.html',
    styleUrls: ['./collection-genres.component.scss'],
    providers: [GenresAlbumsPersister],
})
export class CollectionGenresComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;

    constructor(
        public albumsPersister: GenresAlbumsPersister,
        private albumService: BaseAlbumService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.genresLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.genresLeftPaneWidthPercent - this.settings.genresRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.genresRightPaneWidthPercent;

    public albums: AlbumModel[] = [];

    public get selectedAlbumOrder(): AlbumOrder {
        return this._selectedAlbumOrder;
    }
    public set selectedAlbumOrder(v: AlbumOrder) {
        this._selectedAlbumOrder = v;
        this.albumsPersister.setSelectedAlbumOrder(v);
    }

    public ngOnDestroy(): void {
        this.albums = [];
    }

    public async ngOnInit(): Promise<void> {
        this.selectedAlbumOrder = this.albumsPersister.getSelectedAlbumOrder();
        this.fillListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.genresLeftPaneWidthPercent = event.sizes[0];
        this.settings.genresRightPaneWidthPercent = event.sizes[2];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(250);

        try {
            this.albums = this.albumService.getAllAlbums();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionGenresComponent', 'fillLists');
        }
    }
}
