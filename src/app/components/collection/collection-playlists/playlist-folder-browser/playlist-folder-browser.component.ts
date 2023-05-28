import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { Strings } from '../../../../common/strings';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BasePlaylistFolderService } from '../../../../services/playlist-folder/base-playlist-folder.service';
import { PlaylistFolderModel } from '../../../../services/playlist-folder/playlist-folder-model';
import { BasePlaylistService } from '../../../../services/playlist/base-playlist.service';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { PlaylistFoldersPersister } from '../playlist-folders-persister';

@Component({
    selector: 'app-playlist-folder-browser',
    host: { style: 'display: block' },
    templateUrl: './playlist-folder-browser.component.html',
    styleUrls: ['./playlist-folder-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class PlaylistFolderBrowserComponent implements OnInit {
    private _playlistFolders: PlaylistFolderModel[] = [];
    private _playlistFoldersPersister: PlaylistFoldersPersister;

    constructor(
        public appearanceService: BaseAppearanceService,
        public playlistFolderService: BasePlaylistFolderService,
        public playlistService: BasePlaylistService,
        public playbackService: BasePlaybackService,
        private dialogService: BaseDialogService,
        private translatorService: BaseTranslatorService,
        public contextMenuOpener: ContextMenuOpener,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private logger: Logger
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

    public ngOnInit(): void {}

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
                this.playlistFolderService.renamePlaylistFolder(playlistFolder, newPlaylistFolderName);
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
                this.playlistFolderService.createPlaylistFolder(playlistFolderName);
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
    }

    public async setSelectedPlaylistFoldersAsync(event: any, playlistFolderToSelect: PlaylistFolderModel): Promise<void> {
        this.mouseSelectionWatcher.setSelectedItems(event, playlistFolderToSelect);
        this.playlistFoldersPersister.setSelectedPlaylistFolders(this.mouseSelectionWatcher.selectedItems);
        this.playlistService.setActivePlaylistFolder(this.mouseSelectionWatcher.selectedItems);
    }

    private applySelectedPlaylistFolders(): void {
        const selectedPlaylistFolders: PlaylistFolderModel[] = this.playlistFoldersPersister.getSelectedPlaylistFolders(
            this.playlistFolders
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
