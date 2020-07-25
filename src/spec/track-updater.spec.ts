import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { Track } from '../app/data/entities/track';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { TrackUpdater } from '../app/services/indexing/track-updater';

describe('TrackUpdater', () => {
    describe('updateTracksThatAreOutOfDate', () => {
        it('Should update tracks which have a file size of 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 0;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update tracks which have a file size larger than 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 0;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });

        it('Should update tracks which have a file size that is different than the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 10;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 12);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update tracks which have a file size that is equal to the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 10;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 12);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });

        it('Should update tracks which have a date modified that is different than the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 10;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update tracks which have a date modified that is equal to the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                fileSystemMock.object
            );

            const track1: Track = new Track();
            track1.trackId = 1;
            track1.path = '/home/user/Music/Track 1.mp3';
            track1.dateFileModified = 100;
            track1.fileSize = 10;

            const track2: Track = new Track();
            track2.trackId = 1;
            track2.path = '/home/user/Music/Track 2.mp3';
            track2.dateFileModified = 200;
            track2.fileSize = 20;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });
    });
});
