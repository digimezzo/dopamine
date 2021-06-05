import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { TrackAdder } from './track-adder';
import { TrackIndexer } from './track-indexer';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';

describe('TrackIndexer', () => {
    let trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
    let trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
    let trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
    let loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    let snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    let trackIndexer: TrackIndexer;

    beforeEach(() => {
        trackRemoverMock = Mock.ofType<TrackRemover>();
        trackUpdaterMock = Mock.ofType<TrackUpdater>();
        trackAdderMock = Mock.ofType<TrackAdder>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        trackIndexer = new TrackIndexer(
            trackRemoverMock.object,
            trackUpdaterMock.object,
            trackAdderMock.object,
            loggerMock.object,
            snackBarServiceMock.object
        );
    });

    describe('indexTracksAsync', () => {
        it('should notify that indexing has started', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.refreshing(), Times.exactly(1));
        });

        it('should dismiss the indexing notification with a short delay', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });

        it('should remove tracks that do not belong to folders', async () => {
            // Arrange

            // Act
            await trackIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify((x) => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
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
            trackRemoverMock.verify((x) => x.removeFolderTracksForInexistingTracks(), Times.exactly(1));
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
