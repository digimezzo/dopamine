import { IMock, Mock } from 'typemoq';
import { AddFolderComponent } from '../../app/components/add-folder/add-folder.component';
import { Desktop } from '../../app/core/io/desktop';
import { Logger } from '../../app/core/logger';
import { BaseDialogService } from '../../app/services/dialog/base-dialog.service';
import { BaseFolderService } from '../../app/services/folder/base-folder.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

export class AddFolderComponentMock {
    constructor() {
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
