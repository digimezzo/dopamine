import { Times } from 'typemoq';
import { TrackIndexerMocker } from './mocking/track-indexer-mocker';

describe('TrackIndexer', () => {
    describe('indexTracksAsync', () => {
        it('Should remove tracks that do not belong to folders', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify(x => x.removeTracksThatDoNoNotBelongToFolders(), Times.exactly(1));
        });

        it('Should remove tracks that are not found on disk', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify(x => x.removeTracksThatAreNotFoundOnDisk(), Times.exactly(1));
        });

        it('Should remove folder tracks for non-existing tracks', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify(x => x.removeFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('Should update tracks that are out of date', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackUpdaterMock.verify(x => x.updateTracksThatAreOutOfDateAsync(), Times.exactly(1));
        });

        it('Should add tracks that are not in the database', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackAdderMock.verify(x => x.addTracksThatAreNotInTheDatabaseAsync(), Times.exactly(1));
        });
    });
});
