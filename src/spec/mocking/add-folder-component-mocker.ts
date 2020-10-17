import { IMock, Mock } from 'typemoq';
import { AddFolderComponent } from '../../app/components/add-folder/add-folder.component';
import { Desktop } from '../../app/core/io/desktop';
import { Logger } from '../../app/core/logger';
import { Folder } from '../../app/data/entities/folder';
import { BaseDialogService } from '../../app/services/dialog/base-dialog.service';
import { BaseFolderService } from '../../app/services/folder/base-folder.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

export class AddFolderComponentMocker {
    constructor(private folderToDelete?: Folder) {
        this.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
        this.translatorServiceMock.setup(x => x.getAsync(
            'ErrorTexts.DeleteFolderError')).returns(async () => 'Error while deleting folder');

        if (folderToDelete != undefined) {
            this.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            this.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');
        }

        this.addFolderComponent = new AddFolderComponent(
            this.desktopMock.object,
            this.translatorServiceMock.object,
            this.folderServiceMock.object,
            this.dialogServiceMock.object,
            this.loggerMock.object);
    }

    public desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
    public translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    public folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
    public dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public addFolderComponent: AddFolderComponent;
}
