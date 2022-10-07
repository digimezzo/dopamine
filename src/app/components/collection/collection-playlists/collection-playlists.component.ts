import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { BaseScheduler } from '../../../common/scheduling/base-scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BasePlaylistFolderService } from '../../../services/playlist-folder/base-playlist-folder.service';
import { PlaylistFolderModel } from '../../../services/playlist-folder/playlist-folder-model';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { PlaylistModel } from '../../../services/playlist/playlist-model';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { TrackModels } from '../../../services/track/track-models';
import { CollectionPersister } from '../collection-persister';
import { PlaylistFoldersPersister } from './playlist-folders-persister';
import { PlaylistsPersister } from './playlists-persister';
import { PlaylistsTracksPersister } from './playlists-tracks-persister';

@Component({
    selector: 'app-collection-playlists',
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        public searchService: BaseSearchService,
        public playlistFoldersPersister: PlaylistFoldersPersister,
        public playlistsPersister: PlaylistsPersister,
        public tracksPersister: PlaylistsTracksPersister,
        private playlistFolderService: BasePlaylistFolderService,
        private playlistService: BasePlaylistService,
        private collectionPersister: CollectionPersister,
        private settings: BaseSettings,
        private scheduler: BaseScheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.playlistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.playlistsLeftPaneWidthPercent - this.settings.playlistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.playlistsRightPaneWidthPercent;

    public playlistFolders: PlaylistFolderModel[] = [];
    public playlists: PlaylistModel[] = [];
    public tracks: TrackModels = new TrackModels();

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(async () => {
                await this.processListsAsync();
            })
        );

        this.subscription.add(
            this.playlistFoldersPersister.selectedPlaylistFoldersChanged$.subscribe(async (playlistFolders: PlaylistFolderModel[]) => {
                this.playlistsPersister.resetSelectedPlaylists();
                await this.getPlaylistsForPlaylistFoldersAsync(playlistFolders);
                await this.getTracksAsync();
            })
        );

        this.subscription.add(
            this.playlistFolderService.playlistFoldersChanged$.subscribe(async () => {
                await this.processListsAsync();
            })
        );

        this.subscription.add(
            this.playlistService.playlistsChanged$.subscribe(async () => {
                await this.getPlaylistsAsync();
            })
        );

        this.subscription.add(
            this.playlistService.playlistTracksChanged$.subscribe(async () => {
                await this.getTracksAsync();
            })
        );

        this.subscription.add(
            this.playlistsPersister.selectedPlaylistsChanged$.subscribe(async (playlistNames: string[]) => {
                await this.getTracksAsync();
            })
        );

        await this.processListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.playlistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = event.sizes[2];
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === Constants.playlistsTabLabel) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private clearLists(): void {
        this.playlistFolders = [];
        this.playlists = [];
        this.tracks = new TrackModels();
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getPlaylistFoldersAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getPlaylistsAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getTracksAsync();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionPlaylistsComponent', 'fillListsAsync');
        }
    }

    private async getPlaylistFoldersAsync(): Promise<void> {
        this.playlistFolders = await this.playlistFolderService.getPlaylistFoldersAsync();
    }

    private async getPlaylistsAsync(): Promise<void> {
        const selectedPlaylistFolders: PlaylistFolderModel[] = this.playlistFoldersPersister.getSelectedPlaylistFolders(
            this.playlistFolders
        );

        this.playlists = await this.playlistService.getPlaylistsAsync(selectedPlaylistFolders);
    }

    private async getPlaylistsForPlaylistFoldersAsync(playlistFolders: PlaylistFolderModel[]): Promise<void> {
        this.playlists = await this.playlistService.getPlaylistsAsync(playlistFolders);
    }

    private async getTracksAsync(): Promise<void> {
        const selectedPlaylists: PlaylistModel[] = this.playlistsPersister.getSelectedPlaylists(this.playlists);

        if (selectedPlaylists.length > 0) {
            this.tracks = await this.playlistService.getTracksAsync(selectedPlaylists);
        } else {
            this.tracks = new TrackModels();
        }
    }
}
