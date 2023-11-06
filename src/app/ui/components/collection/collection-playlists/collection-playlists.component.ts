import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { PlaylistFolderModel } from '../../../../services/playlist-folder/playlist-folder-model';
import { PlaylistModel } from '../../../../services/playlist/playlist-model';
import { TrackModels } from '../../../../services/track/track-models';
import { CollectionPersister } from '../collection-persister';
import { PlaylistFoldersPersister } from './playlist-folders-persister';
import { PlaylistsPersister } from './playlists-persister';
import { PlaylistsTracksPersister } from './playlists-tracks-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { PlaylistFolderServiceBase } from '../../../../services/playlist-folder/playlist-folder.service.base';
import { PlaylistServiceBase } from '../../../../services/playlist/playlist.service.base';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-collection-playlists',
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        public playlistFoldersPersister: PlaylistFoldersPersister,
        public playlistsPersister: PlaylistsPersister,
        public tracksPersister: PlaylistsTracksPersister,
        private playlistFolderService: PlaylistFolderServiceBase,
        private playlistService: PlaylistServiceBase,
        private collectionPersister: CollectionPersister,
        private settings: SettingsBase,
        private scheduler: SchedulerBase,
        private logger: Logger,
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
            this.collectionPersister.selectedTabChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            }),
        );

        this.subscription.add(
            this.playlistFoldersPersister.selectedPlaylistFoldersChanged$.subscribe((playlistFolders: PlaylistFolderModel[]) => {
                this.playlistsPersister.resetSelectedPlaylists();
                PromiseUtils.noAwait(this.getPlaylistsForPlaylistFoldersAndGetTracksAsync(playlistFolders));
            }),
        );

        this.subscription.add(
            this.playlistFolderService.playlistFoldersChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.processListsAsync());
            }),
        );

        this.subscription.add(
            this.playlistService.playlistsChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.getPlaylistsAsync());
            }),
        );

        this.subscription.add(
            this.playlistService.playlistTracksChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.getTracksAsync());
            }),
        );

        this.subscription.add(
            this.playlistsPersister.selectedPlaylistsChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.getTracksAsync());
            }),
        );

        await this.processListsAsync();
    }

    public splitDragEnd(event: IOutputData): void {
        this.settings.playlistsLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = <number>event.sizes[2];
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
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getPlaylistFoldersAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getPlaylistsAsync();

            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getTracksAsync();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not fill lists', 'CollectionPlaylistsComponent', 'fillListsAsync');
        }
    }

    private async getPlaylistFoldersAsync(): Promise<void> {
        this.playlistFolders = await this.playlistFolderService.getPlaylistFoldersAsync();
    }

    private async getPlaylistsAsync(): Promise<void> {
        const selectedPlaylistFolders: PlaylistFolderModel[] = this.playlistFoldersPersister.getSelectedPlaylistFolders(
            this.playlistFolders,
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

    private async getPlaylistsForPlaylistFoldersAndGetTracksAsync(playlistFolders: PlaylistFolderModel[]): Promise<void> {
        await this.getPlaylistsForPlaylistFoldersAsync(playlistFolders);
        await this.getTracksAsync();
    }
}
