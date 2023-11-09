import { IMock, Mock } from 'typemoq';
import { TrackVerifier } from './track-verifier';
import { FileAccessBase } from '../../common/io/file-access.base';
import { Track } from '../../data/entities/track';

describe('TrackVerifier', () => {
    let fileAccessMock: IMock<FileAccessBase>;
    let trackVerifier: TrackVerifier;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
        trackVerifier = new TrackVerifier(fileAccessMock.object);
    });

    describe('isTrackOutOfDateAsync', () => {
        it('should report a track as out of date if its file size is 0', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackIsOutOfDate: boolean = trackVerifier.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its file size is different than the file size on disk', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytes(track.path)).returns(() => 12);
            fileAccessMock.setup((x) => x.getDateModifiedInTicks(track.path)).returns(() => 100);

            // Act
            const trackIsOutOfDate: boolean = trackVerifier.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its date modified is different than the date modified on disk', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytes(track.path)).returns(() => 10);
            fileAccessMock.setup((x) => x.getDateModifiedInTicks(track.path)).returns(() => 110);

            // Act
            const trackIsOutOfDate: boolean = trackVerifier.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should not report a track as out of date if its file size is not 0 and it is equal to the file size on disk, and its date modified is equal to the date modified on disk.', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.setup((x) => x.getFileSizeInBytes(track.path)).returns(() => 10);
            fileAccessMock.setup((x) => x.getDateModifiedInTicks(track.path)).returns(() => 100);

            // Act
            const trackIsOutOfDate: boolean = trackVerifier.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeFalsy();
        });
    });

    describe('doesTrackNeedIndexing', () => {
        it('should report that a track needs indexing if needsIndexing is undefined', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = undefined;

            // Act
            const trackNeedsIndexing: boolean = trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing is not a number', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = NaN;

            // Act
            const trackNeedsIndexing: boolean = trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing equals one', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 1;

            // Act
            const trackNeedsIndexing: boolean = trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track does not need indexing if needsIndexing is zero', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            // Act
            const trackNeedsIndexing: boolean = trackVerifier.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeFalsy();
        });
    });
});
