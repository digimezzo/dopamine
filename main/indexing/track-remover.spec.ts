import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { TrackRemover } from './track-remover';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { TrackRepository } from '../../data/repositories/track-repository';
import { FolderTrackRepository } from '../../data/repositories/folder-track-repository';
import { Track } from '../../data/entities/track';
import { NotificationServiceBase } from '../notification/notification.service.base';

describe('Trackremover', () => {
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let folderTrackRepositoryMock: IMock<FolderTrackRepositoryBase>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let loggerMock: IMock<Logger>;
    let trackRemover: TrackRemover;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepository>();
        folderTrackRepositoryMock = Mock.ofType<FolderTrackRepository>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        loggerMock = Mock.ofType<Logger>();
        trackRemover = new TrackRemover(
            trackRepositoryMock.object,
            folderTrackRepositoryMock.object,
            notificationServiceMock.object,
            fileAccessMock.object,
            loggerMock.object,
        );
    });

    describe('removeTracksThatDoNoNotBelongToFolders', () => {
        it('should get the number of tracks that do not belong to folders', async () => {
            // Arrange

            // Act
            await trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getNumberOfTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

        it('should notify that track are being removed, if there are tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 2);

            // Act
            await trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.exactly(1));
        });

        it('should not notify that track are being removed, if there are no tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 0);

            // Act
            await trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.never());
        });

        it('should delete tracks that do not belong to folders from the database, if there are tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 2);

            // Act
            await trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.deleteTracksThatDoNotBelongFolders(), Times.exactly(1));
        });

        it('should not delete tracks that do not belong to folders from the database, if there are no tracks that do not belong to folders.', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getNumberOfTracksThatDoNotBelongFolders()).returns(() => 0);

            // Act
            await trackRemover.removeTracksThatDoNoNotBelongToFoldersAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.deleteTracksThatDoNotBelongFolders(), Times.never());
        });
    });

    describe('removeTracksThatAreNotFoundOnDiskAsync', () => {
        it('should get all tracks from the database', async () => {
            // Arrange

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getAllTracks(), Times.exactly(1));
        });

        it('should check if a path exists for each track in the database', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.pathExists(track1.path), Times.exactly(1));
            fileAccessMock.verify((x) => x.pathExists(track2.path), Times.exactly(1));
        });

        it('should not check if a path exists if there are no tracks in the in the database', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => []);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should delete a track from the database if its file is not found on disk', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1]);
            fileAccessMock.setup((x) => x.pathExists(track1.path)).returns(() => false);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.deleteTrack(track1.trackId), Times.exactly(1));
        });

        it('should delete a track from the database if its file is found on disk', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1]);
            fileAccessMock.setup((x) => x.pathExists(track1.path)).returns(() => true);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.deleteTrack(track1.trackId), Times.never());
        });

        it('should notify only once that tracks that are not found on disk are being removed', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);
            fileAccessMock.setup((x) => x.pathExists(track1.path)).returns(() => false);
            fileAccessMock.setup((x) => x.pathExists(track2.path)).returns(() => false);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.exactly(1));
        });

        it('should not notify that tracks are being removed as long as they are found on disk', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 2;
            trackRepositoryMock.setup((x) => x.getAllTracks()).returns(() => [track1, track2]);
            fileAccessMock.setup((x) => x.pathExists(track1.path)).returns(() => true);
            fileAccessMock.setup((x) => x.pathExists(track2.path)).returns(() => true);

            // Act
            await trackRemover.removeTracksThatAreNotFoundOnDiskAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.never());
        });
    });

    describe('removeFolderTracksForInexistingTracks', () => {
        it('should get the number of folder tracks for inexisting tracks', async () => {
            // Arrange

            // Act
            await trackRemover.removeFolderTracksForInexistingTracksAsync();

            // Assert
            folderTrackRepositoryMock.verify((x) => x.getNumberOfFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('should notify that track are being removed, if there are folder tracks for indexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.setup((x) => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 2);

            // Act
            await trackRemover.removeFolderTracksForInexistingTracksAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.exactly(1));
        });

        it('should not notify that track are being removed, if there are no folder tracks for inexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.setup((x) => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 0);

            // Act
            await trackRemover.removeFolderTracksForInexistingTracksAsync();

            // Assert
            notificationServiceMock.verify((x) => x.removingTracksAsync(), Times.never());
        });

        it('should delete folder tracks from the database, if there are folder tracks for indexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.setup((x) => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 2);

            // Act
            await trackRemover.removeFolderTracksForInexistingTracksAsync();

            // Assert
            folderTrackRepositoryMock.verify((x) => x.deleteFolderTracksForInexistingTracks(), Times.exactly(1));
        });

        it('should not delete folder tracks from the database, if there are no folder tracks for indexisting tracks.', async () => {
            // Arrange
            folderTrackRepositoryMock.setup((x) => x.getNumberOfFolderTracksForInexistingTracks()).returns(() => 0);

            // Act
            await trackRemover.removeFolderTracksForInexistingTracksAsync();

            // Assert
            folderTrackRepositoryMock.verify((x) => x.deleteFolderTracksForInexistingTracks(), Times.never());
        });
    });
});
