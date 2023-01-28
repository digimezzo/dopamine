import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { TrackVerifier } from './track-verifier';

describe('TrackVerifier', () => {
    let fileAccessMock: IMock<BaseFileAccess>;
    let trackVerifier: TrackVerifier;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        trackVerifier = new TrackVerifier(fileAccessMock.object);
    });

    describe('isTrackOutOfDateAsync', () => {
        it('should report a track as out of date if its file size is 0', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its file size is different than the file size on disk', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytesAsync(track.path)).returns(async () => 12);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 100);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its date modified is different than the date modified on disk', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytesAsync(track.path)).returns(async () => 10);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 110);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should not report a track as out of date if its file size is not 0 and it is equal to the file size on disk, and its date modified is equal to the date modified on disk.', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytesAsync(track.path)).returns(async () => 10);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync(track.path)).returns(async () => 100);

            // Act
            const trackIsOutOfDate: boolean = await trackVerifier.isTrackOutOfDateAsync(track);

            // Assert
            expect(trackIsOutOfDate).toBeFalsy();
        });
    });

    describe('doesTrackNeedIndexing', () => {
        it('should report that a track needs indexing if needsIndexing is undefined', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = undefined;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing is not a number', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = NaN;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing equals one', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 1;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track does not need indexing if needsIndexing is zero', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackNeedsIndexing: boolean = await trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeFalsy();
        });
    });
});
