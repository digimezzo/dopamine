import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmThat } from '../../core/confirm-that';
import { Desktop } from '../../core/io/desktop';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Component({
    selector: 'app-add-folder',
    host: { 'style': 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFolderComponent implements OnInit {
    constructor(
        private desktop: Desktop,
        private translatorService: BaseTranslatorService,
        private folderService: BaseFolderService,
        private dialogService: BaseDialogService,
        private logger: Logger) { }

    public selectedFolder: Folder;
    public folders: Folder[] = [];

    public ngOnInit(): void {
        this.getFolders();
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.Welcome.Music.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (ConfirmThat.isNotNullOrWhiteSpace(selectedFolderPath)) {
            try {
                await this.folderService.addNewFolderAsync(selectedFolderPath);
                await this.getFolders();
            } catch (e) {
                this.logger.error(`An error occurred while adding the folder. Error: ${e.message}`, 'AddFolderComponent', 'addFolderAsync');
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.AddFolderError'));
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public getFolders(): void {
        this.folders = this.folderService.getFolders();
    }

    public setSelectedFolder(folder: Folder): void {
        this.selectedFolder = folder;
    }

    public async deleteFolderAsync(folder: Folder): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('DialogTitles.ConfirmDeleteFolder');
        const dialogText: string = await this.translatorService.getAsync('DialogTexts.ConfirmDeleteFolder', { folderPath: folder.path });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                this.folderService.deleteFolder(folder);
                this.getFolders();
            } catch (e) {
                this.logger.error(
                    `An error occurred while deleting the folder. Error: ${e.message}`,
                    'AddFolderComponent',
                    'deleteFolderAsync');
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.DeleteFolderError'));
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
