import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Desktop } from '../../core/desktop';
import { TranslatorServiceBase } from '../../services/translator/translator-service-base';
import { FolderServiceBase } from '../../services/folder/folder-service-base';
import { Folder } from '../../data/entities/folder';

@Component({
    selector: 'app-add-folder',
    host: { 'style': 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFolderComponent implements OnInit {
    constructor(private desktop: Desktop, private translatorService: TranslatorServiceBase, private folderService: FolderServiceBase) { }

    public selectedFolder: Folder;
    public folders: Folder[] = [];

    public async ngOnInit(): Promise<void> {
        await this.getFoldersAsync();
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.Welcome.Music.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (selectedFolderPath) {
            await this.folderService.addNewFolderAsync(selectedFolderPath);
        }
    }

    public async getFoldersAsync(): Promise<void> {
        this.folders = await this.folderService.getFoldersAsync();
    }

    public setSelectedFolder(folder: Folder): void {
        this.selectedFolder = folder;
    }

    public async deleteFolderAsync(folder: Folder): Promise<void> {

    }
}
