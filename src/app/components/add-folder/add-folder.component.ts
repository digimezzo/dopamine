import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Desktop } from '../../core/desktop';
import { TranslatorServiceBase } from '../../services/translator/translator-service-base';
import { FolderServiceBase } from '../../services/folder/folder-service-base';
import { Folder } from '../../data/entities/folder';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';

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
    public folders: Folder[];

    public async ngOnInit(): Promise<void> {
        await this.getFoldersAsync();
    }

    public async addFolderAsync (): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('Pages.Welcome.Music.SelectFolder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (selectedFolderPath) {
            try {
                await this.folderService.addNewFolderAsync(selectedFolderPath);
                await this.getFoldersAsync();
            } catch (error) {
                const errorText: string = (await this.translatorService.getAsync('ErrorTexts.AddFolderError'));
                this.dialog.open(ErrorDialogComponent, {
                    width: '450px', data: { errorText: errorText }
                });
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
        const title: string = await this.translatorService.getAsync('DialogTitles.ConfirmDeleteFolder');
        const text: string = await this.translatorService.getAsync('DialogTexts.ConfirmDeleteFolder', { folderPath: folder.path });

        const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px', data: { dialogTitle: title, dialogText: text }
        });

        dialogRef.afterClosed().subscribe(async (result: any) => {
            if (result) {
                try {
                    await this.folderService.deleteFolderAsync(folder);
                    await this.getFoldersAsync();
                } catch (error) {
                    const errorText: string = (await this.translatorService.getAsync('ErrorTexts.DeleteFolderError'));
                    this.dialog.open(ErrorDialogComponent, {
                        width: '450px', data: { errorText: errorText }
                    });
                }
            }
        });
    }
}
