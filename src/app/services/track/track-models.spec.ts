import { Track } from '../../data/entities/track';
import { TrackModel } from './track-model';
import { TrackModels } from './track-models';

describe('TrackModel', () => {
    let trackModels: TrackModels;

    beforeEach(() => {
        trackModels = new TrackModels();
    });

    describe('constructor', () => {
        it('should define tracks', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.tracks).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.tracks.length).toEqual(0);
        });

        it('should define totalDurationInMilliseconds', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.totalDurationInMilliseconds).toBeDefined();
        });

        it('should define totalDurationInMilliseconds as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.totalDurationInMilliseconds).toEqual(0);
        });

        it('should define totalFileSizeInBytes', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.totalFileSizeInBytes).toBeDefined();
        });

        it('should define totalFileSizeInBytes as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(trackModels.totalFileSizeInBytes).toEqual(0);
        });
    });

    describe('addTrack', () => {
        it('should not add an undefined track', () => {
            // Arrange
            const trackToAdd: TrackModel = undefined;
            trackModels.tracks = [];

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.tracks.length).toEqual(0);
        });

        it('should not change totalDurationInMilliseconds for an undefined track', () => {
            // Arrange
            const trackToAdd: TrackModel = undefined;
            trackModels.totalDurationInMilliseconds = 0;

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.totalDurationInMilliseconds).toEqual(0);
        });

        it('should not change totalFileSizeInBytes for an undefined track', () => {
            // Arrange
            const trackToAdd: TrackModel = undefined;
            trackModels.totalFileSizeInBytes = 0;

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.totalFileSizeInBytes).toEqual(0);
        });

        it('should add a defined track', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/track1.mp3');
            const trackToAdd: TrackModel = new TrackModel(track);
            trackModels.tracks = [];

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.tracks.length).toEqual(1);
            expect(trackModels.tracks[0]).toBe(trackToAdd);
        });

        it('should ensure that tracks are stored in the order in which they are added', () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const trackToAdd1: TrackModel = new TrackModel(track1);
            const track2: Track = new Track('/home/user/Music/track1.mp3');
            const trackToAdd2: TrackModel = new TrackModel(track2);
            trackModels.tracks = [];

            // Act
            trackModels.addTrack(trackToAdd1);
            trackModels.addTrack(trackToAdd2);
            // Assert
            expect(trackModels.tracks.length).toEqual(2);
            expect(trackModels.tracks[0]).toBe(trackToAdd1);
            expect(trackModels.tracks[1]).toBe(trackToAdd2);
        });

        it('should increase totalDurationInMilliseconds with the durationInMilliseconds of the defined track', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/track1.mp3');
            track.duration = 10;
            const trackToAdd: TrackModel = new TrackModel(track);
            trackModels.totalDurationInMilliseconds = 0;

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.totalDurationInMilliseconds).toEqual(10);
        });

        it('should increase totalFileSizeInBytes with the fileSizeInBytes of the defined track', () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/track1.mp3');
            track.fileSize = 20;
            const trackToAdd: TrackModel = new TrackModel(track);
            trackModels.totalFileSizeInBytes = 0;

            // Act
            trackModels.addTrack(trackToAdd);

            // Assert
            expect(trackModels.totalFileSizeInBytes).toEqual(20);
        });
    });
});
