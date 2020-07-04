import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Desktop } from '../../core/desktop';
import { TranslatorServiceBase } from '../../services/translator/translator-service-base';
import { FolderServiceBase } from '../../services/folder/folder-service-base';
import { Folder } from '../../data/entities/folder';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'app-add-folder',
    host: { 'style': 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFolderComponent implements OnInit {
    constructor(private dialog: MatDialog, private desktop: Desktop, private translatorService: TranslatorServiceBase,
        private folderService: FolderServiceBase) { }

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
        const title: string = await this.translatorService.getAsync('DialogTitles.ConfirmDeleteFolder');
        const text: string = await this.translatorService.getAsync('DialogTexts.ConfirmDeleteFolder', { folderPath: folder.path });

        const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px', data: { dialogTitle: title, dialogText: text }
        });

        dialogRef.afterClosed().subscribe(async (result: any) => {
            if (result) {
                // const operation: Operation = await this.collection.deleteNotebooksAsync(this.selectionWatcher.selectedItems.map(x => x.id));

                // if (operation === Operation.Error) {
                //     const errorText: string = (await this.translator.getAsync('ErrorTexts.DeleteNotebooksError'));
                //     this.dialog.open(ErrorDialogComponent, {
                //         width: '450px', data: { errorText: errorText }
                //     });
                // }
            }
        });
    }
}
