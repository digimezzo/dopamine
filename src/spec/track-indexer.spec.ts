import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../app/core/logger';
import { TrackAdder } from '../app/services/indexing/track-adder';
import { TrackIndexer } from '../app/services/indexing/track-indexer';
import { TrackRemover } from '../app/services/indexing/track-remover';
import { TrackUpdater } from '../app/services/indexing/track-updater';

describe('TrackIndexer', () => {
    describe('indexTracksAsync', () => {
        it('Should remove tracks that are not part of a collection folder', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: TrackIndexer = new TrackIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object,
                loggerMock.object
            );

            // Act
            await collectionIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('Should remove tracks that are not found on disk', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: TrackIndexer = new TrackIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object,
                loggerMock.object
            );

            // Act
            await collectionIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeTracksThatAreNotFoundOnDisk(), Times.exactly(1));
        });

        it('Should remove orphaned folderTracks', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: TrackIndexer = new TrackIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object,
                loggerMock.object
            );

            // Act
            await collectionIndexer.indexTracksAsync();

            // Assert
            trackRemoverMock.verify(x => x.removeOrphanedFolderTracks(), Times.exactly(1));
        });

        it('Should update tracks that are out of date', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: TrackIndexer = new TrackIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object,
                loggerMock.object
            );

            // Act
            await collectionIndexer.indexTracksAsync();

            // Assert
            trackUpdaterMock.verify(x => x.updateTracksThatAreOutOfDateAsync(), Times.exactly(1));
        });

        it('Should add tracks that are not in the database', async() => {
            // Arrange
            const trackRemoverMock: IMock<TrackRemover> = Mock.ofType<TrackRemover>();
            const trackUpdaterMock: IMock<TrackUpdater> = Mock.ofType<TrackUpdater>();
            const trackAdderMock: IMock<TrackAdder> = Mock.ofType<TrackAdder>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const collectionIndexer: TrackIndexer = new TrackIndexer(
                trackRemoverMock.object,
                trackUpdaterMock.object,
                trackAdderMock.object,
                loggerMock.object
            );

            // Act
            await collectionIndexer.indexTracksAsync();

            // Assert
            trackAdderMock.verify(x => x.addTracksThatAreNotInTheDatabaseAsync(), Times.exactly(1));
        });
    });
});
