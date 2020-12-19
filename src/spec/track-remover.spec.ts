import { It, Times } from 'typemoq';
import { Track } from '../app/data/entities/track';
import { TrackRemoverMocker } from './mocking/track-remover-mocker';

describe('Trackremover', () => {
    describe('removeTracksThatDoNoNotBelongToFolders', () => {
        it('Should get the number of tracks that do not belong to folders', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.getNumberOfTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

        it('Should notify that track are being removed, if there are tracks that do not belong to folders.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 2);

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.exactly(1));
        });

        it('Should not notify that track are being removed, if there are no tracks that do not belong to folders.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 0);

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.never());
        });

        it('Should delete tracks that do not belong to folders from the database, if there are tracks that do not belong to folders.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 2);

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

        it('Should not delete tracks that do not belong to folders from the database, if there are no tracks that do not belong to folders.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.trackRepositoryMock.setup(x => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 0);

            // Act
            mocker.trackRemover.removeTracksThatDoNoNotBelongToFolders();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTracksThatDoNotBelongFolders(), Times.never());
        });
    });

    describe('removeTracksThatAreNotFoundOnDiskAsync', () => {
        it('Should get all tracks from the database', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            // Act
            mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.getTracks(), Times.exactly(1));
        });

        it('Should check if a path exists for each track in the database', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(x => x.pathExists(track1.path), Times.exactly(1));
            mocker.fileSystemMock.verify(x => x.pathExists(track2.path), Times.exactly(1));
        });

        it('Should not check if a path exists if there are no tracks in the in the database', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => []);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(x => x.pathExists(It.isAny()), Times.never());
        });

        it('Should delete a track from the database if its file is not found on disk', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => false);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTrack(track1.trackId), Times.exactly(1));
        });

        it('Should delete a track from the database if its file is found on disk', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.deleteTrack(track1.trackId), Times.never());
        });

        it('Should notify only once that tracks that are not found on disk are being removed', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => false);
            mocker.fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => false);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.exactly(1));
        });

        it('Should not notify that tracks are being removed as long as they are found on disk', async () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.pathExists(track1.path)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.pathExists(track2.path)).returns(() => true);

            // Act
            await mocker.trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.never());
        });
    });

    describe('removeFolderTracksForInexistingTracks', () => {
        it('Should get the number of folder tracks for inexisting tracks', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();

            // Act
            mocker.trackRemover.removeFolderTracksForInexistingTracks();

            // Assert
            mocker.folderTrackRepositoryMock.verify(x => x.getNumberOfFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('Should notify that track are being removed, if there are folder tracks for indexisting tracks.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.folderTrackRepositoryMock.setup(x => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 2);

            // Act
            mocker.trackRemover.removeFolderTracksForInexistingTracks();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.exactly(1));
        });

        it('Should not notify that track are being removed, if there are no folder tracks for inexisting tracks.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.folderTrackRepositoryMock.setup(x => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 0);

            // Act
            mocker.trackRemover.removeFolderTracksForInexistingTracks();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.removingTracksAsync(), Times.never());
        });

        it('Should delete folder tracks from the database, if there are folder tracks for indexisting tracks.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.folderTrackRepositoryMock.setup(x => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 2);

            // Act
            mocker.trackRemover.removeFolderTracksForInexistingTracks();


            // Assert
            mocker.folderTrackRepositoryMock.verify(x => x.deleteFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('Should not delete folder tracks from the database, if there are no folder tracks for indexisting tracks.', () => {
            // Arrange
            const mocker: TrackRemoverMocker = new TrackRemoverMocker();
            mocker.folderTrackRepositoryMock.setup(x => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 0);

            // Act
            mocker.trackRemover.removeFolderTracksForInexistingTracks();

            // Assert
            mocker.folderTrackRepositoryMock.verify(x => x.deleteFolderTracksForInexistingTracks(), Times.never());
        });
    });
});
