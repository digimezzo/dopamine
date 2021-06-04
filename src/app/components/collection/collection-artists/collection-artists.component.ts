import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../core/logger';
import { Scheduler } from '../../../core/scheduler/scheduler';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { AlbumOrder } from '../album-order';
import { ArtistsAlbumsPersister } from './artists-albums-persister';

@Component({
    selector: 'app-collection-artists',
    templateUrl: './collection-artists.component.html',
    styleUrls: ['./collection-artists.component.scss'],
    providers: [ArtistsAlbumsPersister],
})
export class CollectionArtistsComponent implements OnInit, OnDestroy {
    private _selectedAlbumOrder: AlbumOrder;

    constructor(
        public albumsPersister: ArtistsAlbumsPersister,
        private albumService: BaseAlbumService,
        private settings: BaseSettings,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.artistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.artistsLeftPaneWidthPercent - this.settings.artistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.artistsRightPaneWidthPercent;

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
        await this.fillListsASync();
    }

    public splitDragEnd(event: any): void {
        this.settings.artistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.artistsRightPaneWidthPercent = event.sizes[2];
    }

    private async fillListsASync(): Promise<void> {
        await this.scheduler.sleepAsync(250);

        try {
            this.albums = this.albumService.getAllAlbums();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionArtistsComponent', 'fillLists');
        }
    }
}
