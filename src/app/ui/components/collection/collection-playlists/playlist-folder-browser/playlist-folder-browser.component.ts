import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Logger } from '../../../../../common/logger';
import { StringUtils } from '../../../../../common/utils/string-utils';
import { PlaylistFolderModel } from '../../../../../services/playlist-folder/playlist-folder-model';
import { PlaylistFoldersPersister } from '../playlist-folders-persister';
import { AppearanceServiceBase } from '../../../../../services/appearance/appearance.service.base';
import { PlaylistFolderServiceBase } from '../../../../../services/playlist-folder/playlist-folder.service.base';
import { PlaylistServiceBase } from '../../../../../services/playlist/playlist.service.base';
import { PlaybackServiceBase } from '../../../../../services/playback/playback.service.base';
import { DialogServiceBase } from '../../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';

@Component({
    selector: 'app-playlist-folder-browser',
    host: { style: 'display: block' },
    templateUrl: './playlist-folder-browser.component.html',
    styleUrls: ['./playlist-folder-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class PlaylistFolderBrowserComponent {
    private _playlistFolders: PlaylistFolderModel[] = [];
    private _playlistFoldersPersister: PlaylistFoldersPersister;

    public constructor(
        public appearanceService: AppearanceServiceBase,
        public playlistFolderService: PlaylistFolderServiceBase,
        public playlistService: PlaylistServiceBase,
        public playbackService: PlaybackServiceBase,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
        public contextMenuOpener: ContextMenuOpener,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private logger: Logger,
    ) {}

    public get playlistFolders(): PlaylistFolderModel[] {
        return this._playlistFolders;
    }

    @Input()
    public set playlistFolders(v: PlaylistFolderModel[]) {
        this._playlistFolders = v;
        this.mouseSelectionWatcher.initialize(this.playlistFolders, false);

        // When the component is first rendered, it happens that playlistFoldersPersister is undefined.
        if (this.playlistFoldersPersister != undefined) {
            this.applySelectedPlaylistFolders();
        }
    }

    public get playlistFoldersPersister(): PlaylistFoldersPersister {
        return this._playlistFoldersPersister;
    }

    @Input()
    public set playlistFoldersPersister(v: PlaylistFoldersPersister) {
        this._playlistFoldersPersister = v;
        this.applySelectedPlaylistFolders();
    }

    @ViewChild('playlistFolderContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public playlistFolderContextMenu: MatMenuTrigger;

    public onPlaylistFolderContextMenu(event: MouseEvent, playlistFolder: PlaylistFolderModel): void {
        if (playlistFolder.isModifiable) {
            this.contextMenuOpener.open(this.playlistFolderContextMenu, event, playlistFolder);
        }
    }

    public async onDeletePlaylistFolderAsync(playlistFolder: PlaylistFolderModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('confirm-delete-playlist-folder');
        const dialogText: string = await this.translatorService.getAsync('confirm-delete-playlist-folder-long', {
            playlistFolderName: playlistFolder.name,
        });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                this.playlistFolderService.deletePlaylistFolder(playlistFolder);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not delete playlist folder', 'CollectionPlaylistsComponent', 'onDeletePlaylistFolderAsync');

                const errorText: string = await this.translatorService.getAsync('delete-playlist-folder-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async onRenamePlaylistFolderAsync(playlistFolder: PlaylistFolderModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('rename-playlist-folder');
        const placeholderText: string = await this.translatorService.getAsync('rename-playlist-folder-placeholder');

        const newPlaylistFolderName: string = await this.dialogService.showInputDialogAsync(
            dialogTitle,
            placeholderText,
            playlistFolder.name,
        );

        if (!StringUtils.isNullOrWhiteSpace(newPlaylistFolderName)) {
            try {
                this.playlistFolderService.renamePlaylistFolder(playlistFolder, newPlaylistFolderName);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not rename playlist folder', 'CollectionPlaylistsComponent', 'onRenamePlaylistFolderAsync');

                const errorText: string = await this.translatorService.getAsync('rename-playlist-folder-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async createPlaylistFolderAsync(): Promise<void> {
        const playlistFolderName: string = await this.dialogService.showInputDialogAsync(
            this.translatorService.get('create-playlist-folder'),
            this.translatorService.get('playlist-folder-name'),
            '',
        );

        try {
            if (!StringUtils.isNullOrWhiteSpace(playlistFolderName)) {
                this.playlistFolderService.createPlaylistFolder(playlistFolderName);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not create playlist folder', 'CollectionPlaylistsComponent', 'createPlaylistFolderAsync');

            const dialogText: string = await this.translatorService.getAsync('create-playlist-folder-error');
            this.dialogService.showErrorDialog(dialogText);
        }
    }

    public setSelectedPlaylistFolders(event: MouseEvent, playlistFolderToSelect: PlaylistFolderModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, playlistFolderToSelect);
        this.playlistFoldersPersister.setSelectedPlaylistFolders(this.mouseSelectionWatcher.selectedItems as PlaylistFolderModel[]);
        this.playlistService.setActivePlaylistFolder(this.mouseSelectionWatcher.selectedItems as PlaylistFolderModel[]);
    }

    private applySelectedPlaylistFolders(): void {
        const selectedPlaylistFolders: PlaylistFolderModel[] = this.playlistFoldersPersister.getSelectedPlaylistFolders(
            this.playlistFolders,
        );

        this.playlistService.setActivePlaylistFolder(selectedPlaylistFolders);

        if (selectedPlaylistFolders == undefined) {
            return;
        }

        for (const selectedPlaylistFolder of selectedPlaylistFolders) {
            selectedPlaylistFolder.isSelected = true;
        }
    }
}
