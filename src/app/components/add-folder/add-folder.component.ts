import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Desktop } from '../../core/io/desktop';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { Strings } from '../../core/strings';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { FolderModel } from '../../services/folder/folder-model';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Component({
    selector: 'app-add-folder',
    host: { style: 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddFolderComponent implements OnInit {
    constructor(
        private desktop: Desktop,
        private translatorService: BaseTranslatorService,
        private folderService: BaseFolderService,
        private dialogService: BaseDialogService,
        public indexingService: BaseIndexingService,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    @Input() public showCheckBoxes: boolean = false;

    public selectedFolder: FolderModel;
    public folders: FolderModel[] = [];

    public get showAllFoldersInCollection(): boolean {
        return this.settings.showAllFoldersInCollection;
    }

    public set showAllFoldersInCollection(v: boolean) {
        this.settings.showAllFoldersInCollection = v;

        if (v) {
            try {
                this.folderService.setAllFoldersVisible();
                this.getFoldersAsync();
            } catch (e) {
                this.logger.error(
                    `Could not set all folders visible. Error: ${e.message}`,
                    'AddFolderComponent',
                    'showAllFoldersInCollection'
                );
            }
        }
    }

    public async ngOnInit(): Promise<void> {
        await this.getFoldersAsync();
    }

    public setFolderVisibility(folder: FolderModel): void {
        this.showAllFoldersInCollection = false;

        try {
            this.folderService.setFolderVisibility(folder);
        } catch (e) {
            this.logger.error(`Could not set folder visibility. Error: ${e.message}`, 'AddFolderComponent', 'setFolderVisibility');
        }
    }

    public async getFoldersAsync(): Promise<void> {
        try {
            this.folders = this.folderService.getFolders();
        } catch (e) {
            this.logger.error(`Could not get folders. Error: ${e.message}`, 'AddFolderComponent', 'getFolders');
            const errorText: string = await this.translatorService.getAsync('ErrorTexts.GetFoldersError');
            this.dialogService.showErrorDialog(errorText);
        }
    }

    public setSelectedFolder(folder: FolderModel): void {
        this.selectedFolder = folder;
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.ManageCollection.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (!Strings.isNullOrWhiteSpace(selectedFolderPath)) {
            try {
                await this.folderService.addFolderAsync(selectedFolderPath);
                await this.getFoldersAsync();
            } catch (e) {
                this.logger.error(
                    `Could not add folder with path='${selectedFolderPath}'. Error: ${e.message}`,
                    'AddFolderComponent',
                    'addFolderAsync'
                );
                const errorText: string = await this.translatorService.getAsync('ErrorTexts.AddFolderError');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async deleteFolderAsync(folder: FolderModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('DialogTitles.ConfirmDeleteFolder');
        const dialogText: string = await this.translatorService.getAsync('DialogTexts.ConfirmDeleteFolder', { folderPath: folder.path });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                this.folderService.deleteFolder(folder);
                await this.getFoldersAsync();
            } catch (e) {
                this.logger.error(`Could not delete folder. Error: ${e.message}`, 'AddFolderComponent', 'deleteFolderAsync');
                const errorText: string = await this.translatorService.getAsync('ErrorTexts.DeleteFolderError');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
