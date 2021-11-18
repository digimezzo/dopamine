import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { Logger } from '../../../../common/logger';
import { Strings } from '../../../../common/strings';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BasePlaylistService } from '../../../../services/playlist/base-playlist.service';
import { PlaylistFolderModel } from '../../../../services/playlist/playlist-folder-model';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';

@Component({
    selector: 'app-playlist-folder-browser',
    templateUrl: './playlist-folder-browser.component.html',
    styleUrls: ['./playlist-folder-browser.component.scss'],
})
export class PlaylistFolderBrowserComponent implements OnInit {
    constructor(
        public playlistService: BasePlaylistService,
        private dialogService: BaseDialogService,
        private translatorService: BaseTranslatorService,
        public contextMenuOpener: ContextMenuOpener,
        private logger: Logger
    ) {}

    public playlistFolders: PlaylistFolderModel[] = [];

    @ViewChild(MatMenuTrigger)
    public playlistFolderContextMenu: MatMenuTrigger;

    public ngOnInit(): void {}

    public onPlaylistFolderContextMenu(event: MouseEvent, playlistFolder: PlaylistFolderModel): void {
        this.contextMenuOpener.open(this.playlistFolderContextMenu, event, playlistFolder);
    }

    public async onDeletePlaylistFolderAsync(playlistFolder: PlaylistFolderModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('confirm-delete-playlist-folder');
        const dialogText: string = await this.translatorService.getAsync('confirm-delete-playlist-folder-long', {
            playlistFolderName: playlistFolder.name,
        });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                this.playlistService.deletePlaylistFolder(playlistFolder);
                // await this.fillListsAsync(false);
            } catch (e) {
                this.logger.error(
                    `Could not delete playlist folder. Error: ${e.message}`,
                    'CollectionPlaylistsComponent',
                    'onDeletePlaylistFolderAsync'
                );

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
            playlistFolder.name
        );

        if (!Strings.isNullOrWhiteSpace(newPlaylistFolderName)) {
            try {
                this.playlistService.renamePlaylistFolder(playlistFolder, newPlaylistFolderName);
                // await this.fillListsAsync(false);
            } catch (e) {
                this.logger.error(
                    `Could not rename playlist folder. Error: ${e.message}`,
                    'CollectionPlaylistsComponent',
                    'onRenamePlaylistFolderAsync'
                );
                const errorText: string = await this.translatorService.getAsync('rename-playlist-folder-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async createPlaylistFolderAsync(): Promise<void> {
        const playlistFolderName: string = await this.dialogService.showInputDialogAsync(
            this.translatorService.get('create-playlist-folder'),
            this.translatorService.get('playlist-folder-name'),
            ''
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

            const dialogText: string = await this.translatorService.getAsync('create-playlist-folder-error');
            this.dialogService.showErrorDialog(dialogText);
        }

        // await this.processListsAsync(false);
    }
}
