import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { Logger } from '../app/core/logger';
import { Track } from '../app/data/entities/track';
import { TrackRepository } from '../app/data/repositories/track-repository';
import { TrackFiller } from '../app/services/indexing/track-filler';
import { TrackUpdater } from '../app/services/indexing/track-updater';

describe('TrackUpdater', () => {
    describe('updateTracksThatAreOutOfDate', () => {
        it('Should update metadata for tracks that have a file size of 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 0;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a file size of 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 0;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should not update metadata for tracks that have a file size larger than 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 0;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a file size larger than 0', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 0;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should update metadata for tracks that have a file size that is different than the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 12);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a file size that is different than the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should not update metadata for tracks that have a file size that is equal to the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 12);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a file size that is equal to the file size on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should update metadata for tracks that have a date modified that is different than the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a date modified that is different than the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should not update metadata for tracks that have a date modified that is equal to the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a date modified that is equal to the date modified on disk', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 0;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should update metadata for tracks that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that needs indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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

        it('Should not update metadata for tracks that do not need indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

            trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track1.path)).returns(() => 10);
            fileSystemMock.setup(x => x.getFilesizeInBytes(track2.path)).returns(() => 20);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that do not need indexing', async () => {
            // Arrange
            const trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
            const trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const trackUpdater: TrackUpdater = new TrackUpdater(
                trackRepositoryMock.object,
                trackFillerMock.object,
                fileSystemMock.object,
                loggerMock.object
            );

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 200;
            track2.fileSize = 20;
            track2.needsIndexing = 0;

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
    });
});
