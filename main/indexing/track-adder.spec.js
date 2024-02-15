const { TrackRepositoryMock } = require('../mocks/track-repository-mock');
const { FolderTrackRepositoryMock } = require('../mocks/folder-track-repository-mock');
const { IndexablePathFetcherMock } = require('../mocks/indexable-path-fetcher-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { Track } = require('../data/entities/track');
const { IndexablePath } = require('./indexable-path');
const { RemovedTrackRepositoryMock } = require('../mocks/removed-track-repository-mock');
const { TrackFillerMock } = require('../mocks/track-filler-mock');
const { TrackAdder } = require('./track-adder');
const { RemovedTrack } = require('../../src/app/data/entities/removed-track');

describe('TrackAdder', () => {
    let removedTrackRepositoryMock;
    let folderTrackRepositoryMock;
    let trackRepositoryMock;
    let indexablePathFetcherMock;
    let trackFillerMock;
    let workerProxyMock;
    let loggerMock;

    beforeEach(() => {
        removedTrackRepositoryMock = new RemovedTrackRepositoryMock();
        folderTrackRepositoryMock = new FolderTrackRepositoryMock();
        trackRepositoryMock = new TrackRepositoryMock();
        indexablePathFetcherMock = new IndexablePathFetcherMock();
        trackFillerMock = new TrackFillerMock();
        workerProxyMock = new WorkerProxyMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new TrackAdder(
            removedTrackRepositoryMock,
            folderTrackRepositoryMock,
            trackRepositoryMock,
            indexablePathFetcherMock,
            trackFillerMock,
            workerProxyMock,
            loggerMock,
        );
    }

    describe('addTracksThatAreNotInTheDatabase', () => {
        it('should add tracks that are not in the database', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];
            removedTrackRepositoryMock.getRemovedTracksReturnValue = [];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2 = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3 = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1, indexablePath2, indexablePath3];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(trackRepositoryMock.addTrackCalls.filter((x) => x.path === '/home/user/Music/Track 3.mp3').length).toBe(1);
        });

        it('should not add tracks that are already in the database', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.getAllTracksReturnValue = [track1];
            removedTrackRepositoryMock.getRemovedTracksReturnValue = [];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2 = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3 = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1, indexablePath2, indexablePath3];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(trackRepositoryMock.addTrackCalls.filter((x) => x.path === '/home/user/Music/Track 1.mp3').length).toBe(0);
        });

        it('should add a folderTrack when adding a track to the database', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            trackRepositoryMock.getAllTracksReturnValue = [];
            trackRepositoryMock.getTrackByPathReturnValues = { '/home/user/Music/Track 1.mp3': track1 };
            removedTrackRepositoryMock.getRemovedTracksReturnValue = [];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(folderTrackRepositoryMock.addFolderTrackCalls.filter((x) => x === '1;1').length).toBe(1);
        });

        it('should add a file metadata when adding a track to the database', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            trackRepositoryMock.getAllTracksReturnValue = [];
            trackRepositoryMock.getTrackByPathReturnValues = { '/home/user/Music/Track 1.mp3': track1 };
            removedTrackRepositoryMock.getRemovedTracksReturnValue = [];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(trackFillerMock.addFileMetadataToTrackCalls.filter((x) => x === '/home/user/Music/Track 1.mp3;false').length).toBe(1);
        });

        it('should add tracks that were previously removed, when removed tracks should not be ignored.', async () => {
            // Arrange
            workerProxyMock.skipRemovedFilesDuringRefreshReturnValue = false;

            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            const removedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.getRemovedTracksReturnValue = [removedTrack];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2 = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3 = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1, indexablePath2, indexablePath3];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(trackRepositoryMock.addTrackCalls.filter((x) => x.path === '/home/user/Music/Track 3.mp3').length).toBe(1);
        });

        it('should not add tracks that were previously removed, when removed tracks should be ignored.', async () => {
            // Arrange
            workerProxyMock.skipRemovedFilesDuringRefreshReturnValue = true;

            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;

            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            const removedTrack = new RemovedTrack('/home/user/Music/Track 3.mp3');

            removedTrackRepositoryMock.getRemovedTracksReturnValue = [removedTrack];

            const indexablePath1 = new IndexablePath('/home/user/Music/Track 1.mp3', 123, 1);
            const indexablePath2 = new IndexablePath('/home/user/Music/Track 2.mp3', 456, 1);
            const indexablePath3 = new IndexablePath('/home/user/Music/Track 3.mp3', 789, 1);

            indexablePathFetcherMock.getIndexablePathsForAllFoldersAsyncReturnValue = [indexablePath1, indexablePath2, indexablePath3];

            const sut = createSut();

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            expect(trackRepositoryMock.addTrackCalls.filter((x) => x.path === '/home/user/Music/Track 3.mp3').length).toBe(0);
        });
    });
});
