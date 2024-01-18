import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { TrackAdder } from './track-adder';
import { TrackIndexer } from './track-indexer';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';
import { NotificationServiceBase } from '../notification/notification.service.base';

describe('TrackIndexer', () => {
    let trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
    let trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
    let trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
    let loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    let notificationServiceMock: IMock<NotificationServiceBase> = Mock.ofType<NotificationServiceBase>();
    let trackIndexer: TrackIndexer;

    beforeEach(() => {
        trackRemoverMock = Mock.ofType<TrackRemover>();
        trackUpdaterMock = Mock.ofType<TrackUpdater>();
        trackAdderMock = Mock.ofType<TrackAdder>();
        loggerMock = Mock.ofType<Logger>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        trackIndexer = new TrackIndexer(
            trackRemoverMock.object,
            trackUpdaterMock.object,
            trackAdderMock.object,
            loggerMock.object,
            notificationServiceMock.object,
        );
    });

    describe('indexTracksAsync', () => {
        it('should notify that indexing has started', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            notificationServiceMock.verify((x) => x.refreshing(), Times.exactly(1));
        });

        it('should dismiss the indexing notification with a short delay', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            notificationServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });

        it('should remove tracks that do not belong to folders', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify((x) => x.removeTracksThatDoNoNotBelongToFoldersAsync(), Times.exactly(1));
        });

        it('should remove tracks that are not found on disk', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify((x) => x.removeTracksThatAreNotFoundOnDiskAsync(), Times.exactly(1));
        });

        it('should remove folder tracks for non-existing tracks', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify((x) => x.removeFolderTracksForInexistingTracksAsync(), Times.exactly(1));
        });

        it('should update tracks that are out of date', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackUpdaterMock.verify((x) => x.updateTracksThatAreOutOfDateAsync(), Times.exactly(1));
        });

        it('should add tracks that are not in the database', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackAdderMock.verify((x) => x.addTracksThatAreNotInTheDatabaseAsync(), Times.exactly(1));
        });
    });
});
