import { Times } from 'typemoq';
import { TrackIndexerMocker } from './mocking/track-indexer-mocker';

describe('TrackIndexer', () => {
    describe('indexTracksAsync', () => {
        it('should notify that indexing has started', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.refreshing(), Times.exactly(1));
        });

        it('should dismiss the indexing notification with a short delay', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.snackBarServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });

        it('should remove tracks that do not belong to folders', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify((x) => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('should remove tracks that are not found on disk', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify((x) => x.removeTracksThatAreNotFoundOnDiskAsync(), Times.exactly(1));
        });

        it('should remove folder tracks for non-existing tracks', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify((x) => x.removeFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('should update tracks that are out of date', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackUpdaterMock.verify((x) => x.updateTracksThatAreOutOfDateAsync(), Times.exactly(1));
        });

        it('should add tracks that are not in the database', async () => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackAdderMock.verify((x) => x.addTracksThatAreNotInTheDatabaseAsync(), Times.exactly(1));
        });
    });
});
