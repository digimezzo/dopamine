import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { BaseScheduler } from '../../../common/scheduler/base-scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { PlaylistFolderModel } from '../../../services/playlist/playlist-folder-model';
import { PlaylistModel } from '../../../services/playlist/playlist-model';
import { CollectionPersister } from '../collection-persister';
import { CollectionTab } from '../collection-tab';
import { PlaylistFoldersPersister } from './playlist-folders-persister';

@Component({
    selector: 'app-collection-playlists',
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        public playlistService: BasePlaylistService,
        public appearanceService: BaseAppearanceService,
        private collectionPersister: CollectionPersister,
        public playlistFoldersPersister: PlaylistFoldersPersister,
        private settings: BaseSettings,
        private scheduler: BaseScheduler,
        private logger: Logger
    ) {}

    public leftPaneSize: number = this.settings.playlistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.playlistsLeftPaneWidthPercent - this.settings.playlistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.playlistsRightPaneWidthPercent;

    public playlistFolders: PlaylistFolderModel[] = [];
    public playlists: PlaylistModel[] = [];

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(async () => {
                await this.processListsAsync(true);
            })
        );

        this.subscription.add(
            this.playlistFoldersPersister.selectedPlaylistFoldersChanged$.subscribe(async (playlistFolders: PlaylistFolderModel[]) => {
                await this.getPlaylistsForPlaylistFoldersAsync(playlistFolders);
            })
        );

        await this.processListsAsync(true);
    }

    public splitDragEnd(event: any): void {
        this.settings.playlistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = event.sizes[2];
    }

    private async processListsAsync(performSleep: boolean): Promise<void> {
        if (this.collectionPersister.selectedTab === CollectionTab.playlists) {
            await this.fillListsAsync(performSleep);
        } else {
            this.clearLists();
        }
    }

    private clearLists(): void {
        this.playlistFolders = [];
        this.playlists = [];
    }

    private async fillListsAsync(performSleep: boolean): Promise<void> {
        if (performSleep) {
            await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);
        }

        try {
            if (performSleep) {
                this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            }

            await this.getPlaylistFoldersAsync();

            if (performSleep) {
                await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            }

            await this.getPlaylistsAsync();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionPlaylistsComponent', 'fillListsAsync');
        }
    }

    private async getPlaylistFoldersAsync(): Promise<void> {
        this.playlistFolders = await this.playlistService.getPlaylistFoldersAsync();
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
}
