import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { PlaylistFolderModel } from '../../../../services/playlist-folder/playlist-folder-model';
import { PlaylistModel } from '../../../../services/playlist/playlist-model';
import { TrackModels } from '../../../../services/track/track-models';
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
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private static gettingTracksFlag = false;

    public constructor(
        public searchService: SearchServiceBase,
        public playlistFoldersPersister: PlaylistFoldersPersister,
        public playlistsPersister: PlaylistsPersister,
        public tracksPersister: PlaylistsTracksPersister,
        private playlistFolderService: PlaylistFolderServiceBase,
        private playlistService: PlaylistServiceBase,
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
            this.playlistFoldersPersister.selectedPlaylistFoldersChanged$.subscribe((playlistFolders: PlaylistFolderModel[]) => {
                this.playlistsPersister.resetSelectedPlaylists();
                PromiseUtils.noAwait(this.getPlaylistsForPlaylistFoldersAndGetTracksAsync(playlistFolders));
            }),
        );

        this.subscription.add(
            this.playlistFolderService.playlistFoldersChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
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

        await this.fillListsAsync();
    }

    public splitDragEnd(event: IOutputData): void {
        this.settings.playlistsLeftPaneWidthPercent = <number>event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = <number>event.sizes[2];
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

    private async waitForPrevGetTracks(): Promise<void> {
        return new Promise((resolve, reject) => {
            const checkGettingTracks = (x: number) => {
                if (x >= 10) { reject(); }

                if(CollectionPlaylistsComponent.gettingTracksFlag) {
                    setTimeout(() => { checkGettingTracks(x + 1); }, 500);
                } else {
                    resolve();
                }
            };

            checkGettingTracks(0);
        });
    }

    private async getTracksAsync(): Promise<void> {
        await this.waitForPrevGetTracks();

        CollectionPlaylistsComponent.gettingTracksFlag = true;

        const selectedPlaylists: PlaylistModel[] = this.playlistsPersister.getSelectedPlaylists(this.playlists);

        if (selectedPlaylists.length > 0) {
            this.tracks = await this.playlistService.getTracksAsync(selectedPlaylists);
        } else {
            this.tracks = new TrackModels();
        }

        CollectionPlaylistsComponent.gettingTracksFlag = false;
    }

    private async getPlaylistsForPlaylistFoldersAndGetTracksAsync(playlistFolders: PlaylistFolderModel[]): Promise<void> {
        await this.getPlaylistsForPlaylistFoldersAsync(playlistFolders);
        await this.getTracksAsync();
    }
}
