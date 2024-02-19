const { TrackRepositoryMock } = require('../mocks/track-repository-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { FileAccessMock } = require('../mocks/file-access-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { FolderTrackRepositoryMock } = require('../mocks/folder-track-repository-mock');
const { TrackRemover } = require('./track-remover');
const { Track } = require('../data/entities/track');

describe('TrackRemover', () => {
    let folderTrackRepositoryMock;
    let trackRepositoryMock;
    let fileAccessMock;
    let workerProxyMock;
    let loggerMock;

    beforeEach(() => {
        folderTrackRepositoryMock = new FolderTrackRepositoryMock();
        trackRepositoryMock = new TrackRepositoryMock();
        fileAccessMock = new FileAccessMock();
        workerProxyMock = new WorkerProxyMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new TrackRemover(folderTrackRepositoryMock, trackRepositoryMock, fileAccessMock, workerProxyMock, loggerMock);
    }

    describe('removeTracksThatDoNoNotBelongToFolders', () => {
        it('should get the number of tracks that do not belong to folders', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            expect(trackRepositoryMock.getNumberOfTracksThatDoNotBelongFoldersCalls).toBe(1);
        });

        it('should notify that track are being removed, if there are tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatDoNotBelongFoldersReturnValue = 2;
            const sut = createSut();

            // Act
            await sut.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(1);
        });

        it('should not notify that track are being removed, if there are no tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatDoNotBelongFoldersReturnValue = 0;
            const sut = createSut();

            // Act
            await sut.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(0);
        });

        it('should delete tracks that do not belong to folders from the database, if there are tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatDoNotBelongFoldersReturnValue = 2;
            const sut = createSut();

            // Act
            await sut.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            expect(trackRepositoryMock.deleteTracksThatDoNotBelongFoldersCalls).toBe(1);
        });

        it('should not delete tracks that do not belong to folders from the database, if there are no tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.getNumberOfTracksThatDoNotBelongFoldersReturnValue = 0;
            const sut = createSut();

            // Act
            await sut.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            expect(trackRepositoryMock.deleteTracksThatDoNotBelongFoldersCalls).toBe(0);
        });
    });

    describe('removeTracksThatAreNotFoundOnDiskAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(trackRepositoryMock.getAllTracksCalls).toBe(1);
        });

        it('should check if a path exists for each track in the database', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            const track2 = new Track('/home/user/Music/Track 2.mp3');
            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];
            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(fileAccessMock.pathExistsCalls.filter((x) => x === track1.path).length).toBe(1);
            expect(fileAccessMock.pathExistsCalls.filter((x) => x === track2.path).length).toBe(1);
        });

        it('should not check if a path exists if there are no tracks in the in the database', async () => {
            // Arrange
            trackRepositoryMock.getAllTracksReturnValue = [];
            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(fileAccessMock.pathExistsCalls.length).toBe(0);
        });

        it('should delete a track from the database if its file is not found on disk', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            trackRepositoryMock.getAllTracksReturnValue = [track1];
            fileAccessMock.pathExistsReturnValues = { '/home/user/Music/Track 1.mp3': false };
            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(trackRepositoryMock.deleteTrackCalls.filter((x) => x === track1.trackId).length).toBe(1);
        });

        it('should delete a track from the database if its file is found on disk', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            trackRepositoryMock.getAllTracksReturnValue = [track1];
            fileAccessMock.pathExistsReturnValues = { '/home/user/Music/Track 1.mp3': true };
            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(trackRepositoryMock.deleteTrackCalls.length).toBe(0);
        });

        it('should notify only once that tracks that are not found on disk are being removed', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];
            fileAccessMock.pathExistsReturnValues = {
                '/home/user/Music/Track 1.mp3': false,
                '/home/user/Music/Track 2.mp3': false,
            };

            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(1);
        });

        it('should not notify that tracks are being removed as long as they are found on disk', async () => {
            // Arrange
            const track1 = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2 = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            trackRepositoryMock.getAllTracksReturnValue = [track1, track2];
            fileAccessMock.pathExistsReturnValues = {
                '/home/user/Music/Track 1.mp3': true,
                '/home/user/Music/Track 2.mp3': true,
            };

            const sut = createSut();

            // Act
            await sut.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(0);
        });
    });

    describe('removeFolderTracksForInexistingTracks', () => {
        it('should get the number of folder tracks for inexisting tracks', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeFolderTracksForInexistingTracksAsync();

            // Assert
            expect(folderTrackRepositoryMock.getNumberOfFolderTracksForInexistingTracksCalls).toBe(1);
        });

        it('should notify that track are being removed, if there are folder tracks for inexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.getNumberOfFolderTracksForInexistingTracksReturnValue = 2;
            const sut = createSut();

            // Act
            await sut.removeFolderTracksForInexistingTracksAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(1);
        });

        it('should not notify that track are being removed, if there are no folder tracks for inexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.getNumberOfFolderTracksForInexistingTracksReturnValue = 0;
            const sut = createSut();

            // Act
            await sut.removeFolderTracksForInexistingTracksAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.filter((x) => x.type === 'removingTracks').length).toBe(0);
        });

        it('should delete folder tracks from the database, if there are folder tracks for indexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.getNumberOfFolderTracksForInexistingTracksReturnValue = 2;
            const sut = createSut();

            // Act
            await sut.removeFolderTracksForInexistingTracksAsync();

            // Assert
            expect(folderTrackRepositoryMock.deleteFolderTracksForInexistingTracksCalls).toBe(1);
        });

        it('should not delete folder tracks from the database, if there are no folder tracks for indexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.getNumberOfFolderTracksForInexistingTracksReturnValue = 0;
            const sut = createSut();

            // Act
            await sut.removeFolderTracksForInexistingTracksAsync();

            // Assert
            expect(folderTrackRepositoryMock.deleteFolderTracksForInexistingTracksCalls).toBe(0);
        });
    });
});
