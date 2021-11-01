import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { BaseScheduler } from '../../../common/scheduler/base-scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { PlaylistFolderModel } from '../../../services/playlist/playlist-folder-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionPersister } from '../collection-persister';
import { CollectionTab } from '../collection-tab';

@Component({
    selector: 'app-collection-playlists',
    templateUrl: './collection-playlists.component.html',
    styleUrls: ['./collection-playlists.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class CollectionPlaylistsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        public playlistService: BasePlaylistService,
        public appearanceService: BaseAppearanceService,
        private dialogService: BaseDialogService,
        private translatorService: BaseTranslatorService,
        private collectionPersister: CollectionPersister,
        private settings: BaseSettings,
        private scheduler: BaseScheduler,
        private logger: Logger,
        private playlistFoldersSelectionWatcher: MouseSelectionWatcher
    ) {}

    @ViewChild(MatMenuTrigger)
    public playlistFolderContextMenu: MatMenuTrigger;

    public playlistFolderContextMenuPosition: any = { x: '0px', y: '0px' };

    public leftPaneSize: number = this.settings.playlistsLeftPaneWidthPercent;
    public centerPaneSize: number = 100 - this.settings.playlistsLeftPaneWidthPercent - this.settings.playlistsRightPaneWidthPercent;
    public rightPaneSize: number = this.settings.playlistsRightPaneWidthPercent;

    public playlistFolders: PlaylistFolderModel[] = [];

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

        await this.processListsAsync();
    }

    public splitDragEnd(event: any): void {
        this.settings.playlistsLeftPaneWidthPercent = event.sizes[0];
        this.settings.playlistsRightPaneWidthPercent = event.sizes[2];
    }

    public async createPlaylistFolderAsync(): Promise<void> {
        const playlistFolderName: string = await this.dialogService.showInputDialogAsync(
            this.translatorService.get('create-playlist-folder'),
            this.translatorService.get('playlist-folder-name')
        );

        try {
            if (!Strings.isNullOrWhiteSpace(playlistFolderName)) {
                this.playlistService.createPlaylistFolder(playlistFolderName);
            }
        } catch (e) {
            this.logger.error(
                `Could not create playlist folder. Error: ${e.message}`,
                'CollectionPlaylistsComponent',
                'createPlaylistFolderAsync'
            );

            this.dialogService.showErrorDialog(this.translatorService.get('create-playlist-folder-error'));
        }
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === CollectionTab.playlists) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private clearLists(): void {
        this.playlistFolders = [];
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);

        try {
            await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
            await this.getPlaylistFoldersAsync();
        } catch (e) {
            this.logger.error(`Could not fill lists. Error: ${e.message}`, 'CollectionPlaylistsComponent', 'fillListsAsync');
        }
    }

    private async getPlaylistFoldersAsync(): Promise<void> {
        this.playlistFolders = await this.playlistService.getPlaylistFoldersAsync();
        this.playlistFoldersSelectionWatcher.initialize(this.playlistFolders, false);
    }

    public setSelectedPlaylistFolders(event: any, playlistFolderToSelect: PlaylistFolderModel): void {
        this.playlistFoldersSelectionWatcher.setSelectedItems(event, playlistFolderToSelect);
    }

    public onPlaylistFolderContextMenu(event: MouseEvent, playlistFolder: PlaylistFolderModel): void {
        event.preventDefault();
        this.playlistFolderContextMenuPosition.x = event.clientX + 'px';
        this.playlistFolderContextMenuPosition.y = event.clientY + 'px';
        this.playlistFolderContextMenu.menuData = { playlistFolder: playlistFolder };
        this.playlistFolderContextMenu.menu.focusFirstItem('mouse');
        this.playlistFolderContextMenu.openMenu();
    }

    public onRenamePlaylistFolder(playlistFolder: PlaylistFolderModel): void {
        alert(`Click on Action 1 for ${playlistFolder.path}`);
    }

    public onDeletePlaylistFolder(playlistFolder: PlaylistFolderModel): void {
        alert(`Click on Action 2 for ${playlistFolder.path}`);
    }
}
