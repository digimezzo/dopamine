import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { Track } from '../app/data/entities/track';
import { TrackVerifier } from '../app/services/indexing/track-verifier';

describe('TrackVerifier', () => {
    describe('isTrackOutOfDateAsync', () => {
        it('Should report a track as out of date if its file size is 0', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            assert.strictEqual(trackIsOutOfDate, true);
        });

        it('Should report a track as out of date if its file size is different than the file size on disk', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track.path)).returns(async () => 12);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 100);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            assert.strictEqual(trackIsOutOfDate, true);
        });

        it('Should report a track as out of date if its date modified is different than the date modified on disk', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track.path)).returns(async () => 10);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 110);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            assert.strictEqual(trackIsOutOfDate, true);
        });

        it('Should not report a track as out of date if its file size is not 0 and it is equal to the file size on disk, and its date modified is equal to the date modified on disk.', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileSystemMock.setup(x => x.getFilesizeInBytesAsync(track.path)).returns(async () => 10);
            fileSystemMock.setup(x => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 100);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            assert.strictEqual(trackIsOutOfDate, false);
        });
    });

    describe('doesTrackNeedIndexing', () => {
        it('Should report that a track needs indexing if needsIndexing is undefined', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = undefined;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            assert.strictEqual(trackNeedsIndexing, true);
        });

        it('Should report that a track needs indexing if needsIndexing is not a number', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = NaN;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            assert.strictEqual(trackNeedsIndexing, true);
        });

        it('Should report that a track needs indexing if needsIndexing equals one', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 1;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            assert.strictEqual(trackNeedsIndexing, true);
        });

        it('Should report that a track does not need indexing if needsIndexing is zero', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const trackVerifier: TrackVerifier = new TrackVerifier(fileSystemMock.object);

            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            assert.strictEqual(trackNeedsIndexing, false);
        });
    });
});
