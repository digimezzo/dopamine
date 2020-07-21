import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { Folder } from '../../data/entities/folder';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { Desktop } from '../../core/io/desktop';

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
        private dialogService: BaseDialogService) { }

    public selectedFolder: Folder;
    public folders: Folder[] = [];

    public ngOnInit(): void {
        this.getFolders();
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.Welcome.Music.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (selectedFolderPath) {
            try {
                await this.folderService.addNewFolderAsync(selectedFolderPath);
                await this.getFolders();
            } catch (error) {
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
            } catch (error) {
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.DeleteFolderError'));
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
