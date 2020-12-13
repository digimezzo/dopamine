import { Times } from 'typemoq';
import { TrackIndexerMocker } from './mocking/track-indexer-mocker';

describe('TrackIndexer', () => {
    describe('indexTracksAsync', () => {
        it('Should remove tracks', async() => {
            // Arrange
            const mocker: TrackIndexerMocker = new TrackIndexerMocker();

            // Act
            await mocker.trackIndexer.indexTracksAsync();

            // Assert
            mocker.trackRemoverMock.verify(x => x.removeTracks(), Times.exactly(1));
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
