import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { PromiseUtils } from '../../common/utils/promise-utils';
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
    public constructor(
        private desktop: BaseDesktop,
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
                PromiseUtils.noAwait(this.getFoldersAsync());
            } catch (e: unknown) {
                this.logger.error(e, 'Could not set all folders visible', 'AddFolderComponent', 'showAllFoldersInCollection');
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
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set folder visibility', 'AddFolderComponent', 'setFolderVisibility');
        }
    }

    public async getFoldersAsync(): Promise<void> {
        try {
            this.folders = this.folderService.getFolders();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get folders', 'AddFolderComponent', 'getFolders');

            const errorText: string = await this.translatorService.getAsync('get-folders-error');
            this.dialogService.showErrorDialog(errorText);
        }
    }

    public setSelectedFolder(folder: FolderModel): void {
        this.selectedFolder = folder;
    }

    public async addFolderAsync(): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('select-folder');

        const selectedFolderPath: string = await this.desktop.showSelectFolderDialogAsync(dialogTitle);

        if (!Strings.isNullOrWhiteSpace(selectedFolderPath)) {
            try {
                await this.folderService.addFolderAsync(selectedFolderPath);
                await this.getFoldersAsync();
            } catch (e: unknown) {
                this.logger.error(e, `Could not add folder with path='${selectedFolderPath}'`, 'AddFolderComponent', 'addFolderAsync');

                const errorText: string = await this.translatorService.getAsync('add-folder-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async deleteFolderAsync(folder: FolderModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('confirm-delete-folder');
        const dialogText: string = await this.translatorService.getAsync('confirm-delete-folder-long', { folderPath: folder.path });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                this.folderService.deleteFolder(folder);
                await this.getFoldersAsync();
            } catch (e: unknown) {
                this.logger.error(e, 'Could not delete folder', 'AddFolderComponent', 'deleteFolderAsync');

                const errorText: string = await this.translatorService.getAsync('delete-folder-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }
}
