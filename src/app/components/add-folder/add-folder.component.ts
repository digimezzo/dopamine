import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Desktop } from '../../core/desktop';
import { TranslatorServiceBase } from '../../services/translator/translator-service-base';
import { FolderServiceBase } from '../../services/folder/folder-service-base';
import { Folder } from '../../data/entities/folder';
import { DialogServiceBase } from '../../services/dialog/dialog-service.base';

@Component({
    selector: 'app-add-folder',
    host: { 'style': 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFolderComponent implements OnInit {
    constructor(private desktop: Desktop, private translatorService: TranslatorServiceBase,
        private folderService: FolderServiceBase, private dialogService: DialogServiceBase) { }

    public selectedFolder: Folder;
    public folders: Folder[] = [];

    public async ngOnInit(): Promise<void> {
        await this.getFoldersAsync();
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.Welcome.Music.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (selectedFolderPath) {
            try {
                await this.folderService.addNewFolderAsync(selectedFolderPath);
                await this.getFoldersAsync();
            } catch (error) {
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.AddFolderError'));
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async getFoldersAsync(): Promise<void> {
        this.folders = await this.folderService.getFoldersAsync();
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
                await this.folderService.deleteFolderAsync(folder);
                await this.getFoldersAsync();
            } catch (error) {
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.DeleteFolderError'));
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
