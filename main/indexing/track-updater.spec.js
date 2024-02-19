const { TrackRepositoryMock } = require('../mocks/track-repository-mock');
const { TrackFillerMock } = require('../mocks/track-filler-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { TrackVerifierMock } = require('../mocks/track-verifier-mock');
const { TrackUpdater } = require('./track-updater');
const { Track } = require('../data/entities/track');

describe('TrackUpdater', () => {
    let trackRepositoryMock;
    let trackFillerMock;
    let trackVerifierMock;
    let workerProxyMock;
    let loggerMock;

    beforeEach(() => {
        trackRepositoryMock = new TrackRepositoryMock();
        trackVerifierMock = new TrackVerifierMock();
        trackFillerMock = new TrackFillerMock();
        workerProxyMock = new WorkerProxyMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new TrackUpdater(trackRepositoryMock, trackVerifierMock, trackFillerMock, workerProxyMock, loggerMock);
    }

    describe('updateTracksThatAreOutOfDateAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackRepositoryMock.getAllTracksCalls).toBe(1);
        });

        it('should not check if tracks are out of date if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.getAllTracksReturnValue = [];
            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackVerifierMock.isTrackOutOfDateCalls).toHaveLength(0);
        });

        it('should not check if tracks need indexing if there are no tracks in the database', async () => {
            // Arrange
            trackRepositoryMock.getAllTracksReturnValue = [];
            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackVerifierMock.doesTrackNeedIndexingCalls.length).toBe(0);
        });

        it('should check all tracks in the database if they need indexing', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackVerifierMock.doesTrackNeedIndexingCalls.filter((x) => x === track1.path)).toHaveLength(1);
            expect(trackVerifierMock.doesTrackNeedIndexingCalls.filter((x) => x === track2.path)).toHaveLength(1);
        });

        it('should not check any tracks in the database if they are out of date, when they need indexing.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackVerifierMock.isTrackOutOfDateCalls.filter((x) => x === track1.path)).toHaveLength(0);
            expect(trackVerifierMock.isTrackOutOfDateCalls.filter((x) => x === track2.path)).toHaveLength(0);
        });

        it('should check all tracks in the database if they are out of date, when they no not need indexing.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackVerifierMock.isTrackOutOfDateCalls.filter((x) => x === track1.path)).toHaveLength(1);
            expect(trackVerifierMock.isTrackOutOfDateCalls.filter((x) => x === track2.path)).toHaveLength(1);
        });

        it('should add metadata to a track if it needs indexing or is out of date', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': true,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': false,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackFillerMock.addFileMetadataToTrackCalls.filter((x) => x === '/home/user/Music/Track 1.mp3;false')).toHaveLength(1);
            expect(trackFillerMock.addFileMetadataToTrackCalls.filter((x) => x === '/home/user/Music/Track 2.mp3;false')).toHaveLength(1);
        });

        it('should not add metadata to a track if it does not needs indexing and is not out of date', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackFillerMock.addFileMetadataToTrackCalls.filter((x) => x === '/home/user/Music/Track 1.mp3;false')).toHaveLength(0);
            expect(trackFillerMock.addFileMetadataToTrackCalls.filter((x) => x === '/home/user/Music/Track 2.mp3;false')).toHaveLength(0);
        });

        it('should update a track in the database using a track that has metadata filled in, if it needs indexing or is out of date.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': true,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': false,
            };

            const filledTrack1 = new Track('/home/user/Music/Track 1 filled.mp3');
            const filledTrack2 = new Track('/home/user/Music/Track 2 filled.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.addFileMetadataToTrackReturnValues = {
                '/home/user/Music/Track 1.mp3;false': filledTrack1,
                '/home/user/Music/Track 2.mp3;false': filledTrack2,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackRepositoryMock.updateTrackCalls.filter((x) => x === filledTrack1.path)).toHaveLength(1);
            expect(trackRepositoryMock.updateTrackCalls.filter((x) => x === filledTrack2.path)).toHaveLength(1);
            expect(trackRepositoryMock.updateTrackCalls.filter((x) => x === track1.path)).toHaveLength(0);
            expect(trackRepositoryMock.updateTrackCalls.filter((x) => x === track2.path)).toHaveLength(0);
        });

        it('should not update a track in the database if it does not need indexing and is not out of date.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(trackRepositoryMock.updateTrackCalls).toHaveLength(0);
        });

        it('should notify only once that tracks are being updated, if tracks need indexing or out of date.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': true,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': false,
            };

            const filledTrack1 = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2 = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.addFileMetadataToTrackReturnValues = {
                '/home/user/Music/Track 1.mp3;false': filledTrack1,
                '/home/user/Music/Track 2.mp3;false': filledTrack2,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'updatingTracks')).toHaveLength(1);
        });

        it('should not notify that tracks are being updated, if tracks do not need indexing and are not out of date.', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');

            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];

            trackVerifierMock.doesTrackNeedIndexingReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };
            trackVerifierMock.isTrackOutOfDateReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };

            const filledTrack1 = new Track('/home/user/Music/Track 1.mp3');
            const filledTrack2 = new Track('/home/user/Music/Track 2.mp3');
            filledTrack1.trackTitle = 'Title 1';
            filledTrack2.trackTitle = 'Title 2';

            trackFillerMock.addFileMetadataToTrackReturnValues = {
                '/home/user/Music/Track 1.mp3;false': filledTrack1,
                '/home/user/Music/Track 2.mp3;false': filledTrack2,
            };

            const sut = createSut();

            // Act
            await sut.updateTracksThatAreOutOfDateAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'updatingTracks')).toHaveLength(0);
        });
    });
});
