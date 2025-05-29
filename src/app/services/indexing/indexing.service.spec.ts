import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { IndexingService } from './indexing.service';
import { Observable, Subject } from 'rxjs';
import { DesktopBase } from '../../common/io/desktop.base';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { IIndexingMessage } from './messages/i-indexing-message';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { PlaybackService } from '../playback/playback.service';
import { FolderService } from '../folder/folder.service';
import { TrackFiller } from './track-filler';

describe('IndexingService', () => {
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let albumArtworkIndexerMock: IMock<AlbumArtworkIndexer>;
    let trackFillerMock: IMock<TrackFiller>;
    let desktopMock: IMock<DesktopBase>;
    let settingsMock: IMock<SettingsBase>;
    let ipcProxyMock: IMock<IpcProxyBase>;
    let loggerMock: IMock<Logger>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;

    let folderService_foldersChanged: Subject<void>;

    let onIndexingWorkerMessage: Subject<IIndexingMessage>;
    let onIndexingWorkerExit: Subject<void>;

    beforeEach(() => {
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        trackFillerMock = Mock.ofType<TrackFiller>();
        desktopMock = Mock.ofType<DesktopBase>();
        albumArtworkIndexerMock = Mock.ofType<AlbumArtworkIndexer>();
        settingsMock = Mock.ofType<SettingsBase>();
        ipcProxyMock = Mock.ofType<IpcProxyBase>();
        loggerMock = Mock.ofType<Logger>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();

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

    function createSut(): IndexingService {
        return new IndexingService(
            notificationServiceMock.object,
            folderServiceMock.object,
            playbackServiceMock.object,
            albumArtworkIndexerMock.object,
            trackRepositoryMock.object,
            trackFillerMock.object,
            desktopMock.object,
            settingsMock.object,
            ipcProxyMock.object,
            loggerMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: IndexingService = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    test.todo('should write tests');
});
