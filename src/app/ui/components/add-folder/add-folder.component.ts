import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../common/logger';
import { StringUtils } from '../../../common/utils/string-utils';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { FolderModel } from '../../../services/folder/folder-model';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { FolderServiceBase } from '../../../services/folder/folder.service.base';
import { IndexingService } from '../../../services/indexing/indexing.service';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { DesktopBase } from '../../../common/io/desktop.base';
import { SettingsBase } from '../../../common/settings/settings.base';

@Component({
    selector: 'app-add-folder',
    host: { style: 'display: block' },
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddFolderComponent implements OnInit {
    public constructor(
        private desktop: DesktopBase,
        private translatorService: TranslatorServiceBase,
        private folderService: FolderServiceBase,
        private dialogService: DialogServiceBase,
        public indexingService: IndexingService,
        private settings: SettingsBase,
        private logger: Logger,
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

        if (!StringUtils.isNullOrWhiteSpace(selectedFolderPath)) {
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
