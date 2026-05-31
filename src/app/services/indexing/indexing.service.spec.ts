import { IMock, It, Mock, Times } from 'typemoq';
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
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { PlaybackService } from '../playback/playback.service';
import { TrackFiller } from './track-filler';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';
import { Track } from '../../data/entities/track';

describe('IndexingService', () => {
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let albumArtworkIndexerMock: IMock<AlbumArtworkIndexer>;
    let trackFillerMock: IMock<TrackFiller>;
    let desktopMock: IMock<DesktopBase>;
    let schedulerMock: IMock<SchedulerBase>;
    let settingsMock: IMock<SettingsBase>;
    let ipcProxyMock: IMock<IpcProxyBase>;
    let loggerMock: IMock<Logger>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let albumArtworkRepositoryMock: IMock<AlbumArtworkRepositoryBase>;

    let folderService_foldersChanged: Subject<void>;

    let onIndexingWorkerMessage: Subject<IIndexingMessage>;
    let onIndexingWorkerExit: Subject<void>;

    beforeEach(() => {
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        trackFillerMock = Mock.ofType<TrackFiller>();
        desktopMock = Mock.ofType<DesktopBase>();
        schedulerMock = Mock.ofType<SchedulerBase>();
        albumArtworkIndexerMock = Mock.ofType<AlbumArtworkIndexer>();
        settingsMock = Mock.ofType<SettingsBase>();
        ipcProxyMock = Mock.ofType<IpcProxyBase>();
        loggerMock = Mock.ofType<Logger>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        albumArtworkRepositoryMock = Mock.ofType<AlbumArtworkRepositoryBase>();

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
            albumArtworkRepositoryMock.object,
            trackRepositoryMock.object,
            trackFillerMock.object,
            desktopMock.object,
            schedulerMock.object,
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

    describe('reindexReplayGainForExistingTracks', () => {
        it('should return early when indexing is already running', () => {
            // Arrange
            const sut: IndexingService = createSut();
            sut.isIndexingCollection = true;

            // Act
            sut.reindexReplayGainForExistingTracks();

            // Assert
            ipcProxyMock.verify((x) => x.sendToMainProcess('indexing-worker', It.isAny()), Times.never());
        });

        it('should route ReplayGain reindexing through the indexing worker', () => {
            // Arrange
            const sut: IndexingService = createSut();
            settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => true);
            desktopMock.setup((x) => x.getApplicationDataDirectory()).returns(() => '/appData');

            // Act
            sut.reindexReplayGainForExistingTracks();

            // Assert
            ipcProxyMock.verify(
                (x) =>
                    x.sendToMainProcess('indexing-worker', {
                        task: 'replaygain',
                        skipRemovedFilesDuringRefresh: true,
                        applicationDataDirectory: '/appData',
                    }),
                Times.once(),
            );
        });

        it('should refresh playback queue when replaygain indexing worker exits', async () => {
            // Arrange
            const sut: IndexingService = createSut();
            const track1: Track = new Track('Path 1');
            const track2: Track = new Track('Path 2');
            const tracks: Track[] = [track1, track2];

            settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => true);
            desktopMock.setup((x) => x.getApplicationDataDirectory()).returns(() => '/appData');
            trackRepositoryMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);

            // Act
            sut.reindexReplayGainForExistingTracks();
            onIndexingWorkerExit.next();
            await Promise.resolve();

            // Assert
            playbackServiceMock.verify((x) => x.updateQueueTracks(tracks), Times.once());
            albumArtworkIndexerMock.verify((x) => x.indexAlbumArtworkAsync(), Times.never());
            expect(sut.isIndexingCollection).toBeFalsy();
        });
    });
});
