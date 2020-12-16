import { Times } from 'typemoq';
import { Track } from '../app/data/entities/track';
import { TrackUpdaterMocker } from './mocking/track-updater-mocker';

describe('TrackUpdater', () => {
    describe('updateTracksThatAreOutOfDate', () => {
        it('Should update metadata for tracks that have a file size of 0', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a file size of 0', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update metadata for tracks that have a file size larger than 0', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a file size larger than 0', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });

        it('Should update metadata for tracks that have a file size that is different than the file size on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 12);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a file size that is different than the file size on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 12);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update metadata for tracks that have a file size that is equal to the file size on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 12);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a file size that is equal to the file size on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 12);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });

        it('Should update metadata for tracks that have a date modified that is different than the date modified on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that have a date modified that is different than the date modified on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
        });

        it('Should not update metadata for tracks that have a date modified that is equal to the date modified on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that have a date modified that is equal to the date modified on disk', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 110);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track2), Times.never());
        });

        it('Should update metadata for tracks that needs indexing', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track1), Times.exactly(1));
        });

        it('Should update tracks that needs indexing', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 100;
            track2.fileSize = 10;
            track2.needsIndexing = undefined;

            const track3: Track = new Track('/home/user/Music/Track 3.mp3');
            track3.trackId = 1;
            track3.dateFileModified = 100;
            track3.fileSize = 10;
            track3.needsIndexing = undefined;

            const track4: Track = new Track('/home/user/Music/Track 4.mp3');
            track4.trackId = 1;
            track4.dateFileModified = 100;
            track4.fileSize = 10;
            track4.needsIndexing = NaN;

            const track5: Track = new Track('/home/user/Music/Track 5.mp3');
            track5.trackId = 1;
            track5.dateFileModified = 200;
            track5.fileSize = 20;
            track5.needsIndexing = 0;

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2, track3, track4, track5]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track3.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track4.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track5.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track3.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track4.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track5.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track1), Times.exactly(1));
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track2), Times.exactly(1));
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track3), Times.exactly(1));
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track4), Times.exactly(1));
        });

        it('Should not update metadata for tracks that do not need indexing', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

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

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 200);

            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackFillerMock.verify(x => x.addFileMetadataToTrackAsync(track2), Times.never());
        });

        it('Should not update tracks that do not need indexing', async () => {
            // Arrange
            const mocker: TrackUpdaterMocker = new TrackUpdaterMocker();

            const track1: Track = new Track('/home/user/Music/Track 1.mp3');
            track1.trackId = 1;
            track1.dateFileModified = 100;
            track1.fileSize = 10;
            track1.needsIndexing = 1;

            const track2: Track = new Track('/home/user/Music/Track 2.mp3');
            track2.trackId = 1;
            track2.dateFileModified = 100;
            track2.fileSize = 10;
            track2.needsIndexing = undefined;

            const track3: Track = new Track('/home/user/Music/Track 3.mp3');
            track3.trackId = 1;
            track3.dateFileModified = 100;
            track3.fileSize = 10;
            track3.needsIndexing = undefined;

            const track4: Track = new Track('/home/user/Music/Track 4.mp3');
            track4.trackId = 1;
            track4.dateFileModified = 100;
            track4.fileSize = 10;
            track4.needsIndexing = NaN;

            const track5: Track = new Track('/home/user/Music/Track 5.mp3');
            track5.trackId = 1;
            track5.dateFileModified = 200;
            track5.fileSize = 20;
            track5.needsIndexing = 0;

            mocker.trackRepositoryMock.setup(x => x.getTracks()).returns(() => [track1, track2, track3, track4, track5]);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track1.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track2.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track3.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track4.path)).returns(async () => 10);
            mocker.fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track5.path)).returns(async () => 20);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track1.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track2.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track3.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track4.path)).returns(async () => 100);
            mocker.fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track5.path)).returns(async () => 200);


            // Act
            await mocker.trackUpdater.updateTracksThatAreOutOfDateAsync();

            // Assert
            mocker.trackRepositoryMock.verify(x => x.updateTrack(track5), Times.never());
        });
    });
});
