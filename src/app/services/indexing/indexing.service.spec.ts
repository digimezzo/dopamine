import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { IndexingService } from './indexing.service';
import { IndexingServiceBase } from './indexing.service.base';
import { Observable, Subject } from 'rxjs';
import { NotificationData } from '../notification/notification-data';

describe('IndexingService', () => {
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;

    let folderService_foldersChanged: Subject<void>;

    beforeEach(() => {
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();

        folderService_foldersChanged = new Subject();
        const folderService_foldersChanged$: Observable<void> = folderService_foldersChanged.asObservable();
        folderServiceMock.setup((x) => x.foldersChanged$).returns(() => folderService_foldersChanged);
    });

    function createSut(): IndexingServiceBase {
        return new IndexingService(
            notificationServiceMock.object,
            folderServiceMock.object,
            fileAccessMock.object,
            settingsMock.object,
            loggerMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: IndexingServiceBase = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    test.todo('should write tests');
});
