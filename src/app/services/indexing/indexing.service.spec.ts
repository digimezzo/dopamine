import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { IndexingService } from './indexing.service';
import { IndexingServiceBase } from './indexing.service.base';
import { Observable, Subject } from 'rxjs';
import { DesktopBase } from '../../common/io/desktop.base';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { IIndexingMessage } from './messages/i-indexing-message';

jest.mock('jimp', () => ({ exec: jest.fn() }));

describe('IndexingService', () => {
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let albumArtworkIndexerMock: IMock<AlbumArtworkIndexer>;
    let desktopMock: IMock<DesktopBase>;
    let settingsMock: IMock<SettingsBase>;
    let ipcProxyMock: IMock<IpcProxyBase>;
    let loggerMock: IMock<Logger>;

    let folderService_foldersChanged: Subject<void>;

    let onIndexingWorkerMessage: Subject<IIndexingMessage>;
    let onIndexingWorkerExit: Subject<void>;

    beforeEach(() => {
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        albumArtworkIndexerMock = Mock.ofType<AlbumArtworkIndexer>();
        settingsMock = Mock.ofType<SettingsBase>();
        ipcProxyMock = Mock.ofType<IpcProxyBase>();
        loggerMock = Mock.ofType<Logger>();

        folderService_foldersChanged = new Subject();
        const folderService_foldersChanged$: Observable<void> = folderService_foldersChanged.asObservable();
        folderServiceMock.setup((x) => x.foldersChanged$).returns(() => folderService_foldersChanged$);

        onIndexingWorkerMessage = new Subject();
        const onIndexingWorkerMessage$: Observable<IIndexingMessage> = onIndexingWorkerMessage.asObservable();
        ipcProxyMock.setup((x) => x.onIndexingWorkerMessage$).returns(() => onIndexingWorkerMessage$);

        onIndexingWorkerExit = new Subject();
        const onIndexingWorkerExit$: Observable<void> = onIndexingWorkerExit.asObservable();
        ipcProxyMock.setup((x) => x.onIndexingWorkerExit$).returns(() => onIndexingWorkerExit$);
    });

    function createSut(): IndexingServiceBase {
        return new IndexingService(
            notificationServiceMock.object,
            folderServiceMock.object,
            albumArtworkIndexerMock.object,
            desktopMock.object,
            settingsMock.object,
            ipcProxyMock.object,
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
