const { LoggerMock } = require('../mocks/logger-mock');
const { TrackAdderMock } = require('../mocks/track-adder-mock');
const { TrackUpdaterMock } = require('../mocks/track-updater-mock');
const { TrackRemoverMock } = require('../mocks/track-remover-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { TrackIndexer } = require('./track-indexer');
const { Times } = require('typemoq');
const { RefreshingMessage } = require('./messages/refreshing-message');

describe('TrackIndexer', () => {
    let trackAdderMock;
    let trackUpdaterMock;
    let trackRemoverMock;
    let workerProxyMock;
    let loggerMock;

    beforeEach(() => {
        trackAdderMock = new TrackAdderMock();
        trackUpdaterMock = new TrackUpdaterMock();
        trackRemoverMock = new TrackRemoverMock();
        workerProxyMock = new WorkerProxyMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new TrackIndexer(trackAdderMock, trackUpdaterMock, trackRemoverMock, workerProxyMock, loggerMock);
    }

    describe('indexTracksAsync', () => {
        it('should notify that indexing has started', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toEqual(1);
            expect(workerProxyMock.postMessageCalls[0]).toEqual(new RefreshingMessage());
        });

        it('should remove tracks that do not belong to folders', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(trackRemoverMock.removeTracksThatDoNoNotBelongToFoldersAsyncCalls.length).toEqual(1);
        });

        it('should remove tracks that are not found on disk', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(trackRemoverMock.removeTracksThatAreNotFoundOnDiskAsyncCalls.length).toEqual(1);
        });

        it('should remove folder tracks for non-existing tracks', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(trackRemoverMock.removeFolderTracksForInexistingTracksAsyncCalls.length).toEqual(1);
        });

        it('should update tracks that are out of date', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(trackUpdaterMock.updateTracksThatAreOutOfDateAsyncCalls.length).toEqual(1);
        });

        it('should add tracks that are not in the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexTracksAsync();

            // Assert
            expect(trackAdderMock.addTracksThatAreNotInTheDatabaseAsyncCalls.length).toEqual(1);
        });
    });
});
