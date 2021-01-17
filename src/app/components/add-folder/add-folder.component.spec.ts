import { IMock, Mock } from 'typemoq';
import { Desktop } from '../../core/io/desktop';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { AddFolderComponent } from './add-folder.component';

describe('AddFolderComponent', () => {
    let desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
    let translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    let folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
    let dialogServiceMock: IMock<BaseDialogService> = Mock.ofType<BaseDialogService>();
    let indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
    let settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
    let loggerMock: IMock<Logger> = Mock.ofType<Logger>();

    let component: AddFolderComponent;

    beforeEach(() => {
        desktopMock = Mock.ofType<Desktop>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();

        component = new AddFolderComponent(
            desktopMock.object,
            translatorServiceMock.object,
            folderServiceMock.object,
            dialogServiceMock.object,
            indexingServiceMock.object,
            settingsMock.object,
            loggerMock.object
        );
    });
});
