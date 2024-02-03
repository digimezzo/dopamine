const { FileAccessMock } = require('../mocks/file-access-mock');
const { TrackVerifier } = require('./track-verifier');
const { Track } = require('../data/entities/track');

describe('TrackVerifier', () => {
    let fileAccessMock;
    let trackVerifier;

    beforeEach(() => {
        fileAccessMock = new FileAccessMock();
    });

    function createSut() {
        return new TrackVerifier(fileAccessMock);
    }

    describe('isTrackOutOfDateAsync', () => {
        it('should report a track as out of date if its file size is 0', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            const sut = createSut();

            // Act
            const trackIsOutOfDate = sut.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its file size is different than the file size on disk', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.getFileSizeInBytesReturnValues = { '/home/user/Music/Track.mp3': 12 };
            fileAccessMock.getDateModifiedInTicksReturnValues = { '/home/user/Music/Track.mp3': 100 };

            const sut = createSut();

            // Act
            const trackIsOutOfDate = sut.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should report a track as out of date if its date modified is different than the date modified on disk', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.getFileSizeInBytesReturnValues = { '/home/user/Music/Track.mp3': 10 };
            fileAccessMock.getDateModifiedInTicksReturnValues = { '/home/user/Music/Track.mp3': 110 };

            const sut = createSut();

            // Act
            const trackIsOutOfDate = sut.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeTruthy();
        });

        it('should not report a track as out of date if its file size is not 0 and it is equal to the file size on disk, and its date modified is equal to the date modified on disk.', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 10;
            track.needsIndexing = 0;

            fileAccessMock.getFileSizeInBytesReturnValues = { '/home/user/Music/Track.mp3': 10 };
            fileAccessMock.getDateModifiedInTicksReturnValues = { '/home/user/Music/Track.mp3': 100 };

            const sut = createSut();

            // Act
            const trackIsOutOfDate = sut.isTrackOutOfDate(track);

            // Assert
            expect(trackIsOutOfDate).toBeFalsy();
        });
    });

    describe('doesTrackNeedIndexing', () => {
        it('should report that a track needs indexing if needsIndexing is undefined', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = undefined;

            const sut = createSut();

            // Act
            const trackNeedsIndexing = sut.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing is not a number', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = NaN;

            const sut = createSut();

            // Act
            const trackNeedsIndexing = sut.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track needs indexing if needsIndexing equals one', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 1;

            const sut = createSut();

            // Act
            const trackNeedsIndexing = sut.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeTruthy();
        });

        it('should report that a track does not need indexing if needsIndexing is zero', () => {
            // Arrange
            const track = new Track('/home/user/Music/Track.mp3');
            track.trackId = 1;
            track.dateFileModified = 100;
            track.fileSize = 0;
            track.needsIndexing = 0;

            const sut = createSut();

            // Act
            const trackNeedsIndexing = sut.doesTrackNeedIndexing(track);

            // Assert
            expect(trackNeedsIndexing).toBeFalsy();
        });
    });
});
