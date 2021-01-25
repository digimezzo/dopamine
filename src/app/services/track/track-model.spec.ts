import { Track } from '../../data/entities/track';
import { TrackModel } from './track-model';

describe('TrackModel', () => {
    let track: Track;
    let trackModel: TrackModel;

    beforeEach(() => {
        track = new Track('/home/user/Music/track1.mp3');
        track.trackNumber = 5;
        track.trackTitle = 'Track title';
        track.artists = ';Artist 1;;Artist 2;';
        track.duration = 45648713213;

        trackModel = new TrackModel(track);
    });

    describe('path', () => {
        it('should return the track path', () => {
            // Arrange

            // Act
            const path: string = trackModel.path;

            // Assert
            expect(path).toEqual('/home/user/Music/track1.mp3');
        });
    });

    describe('number', () => {
        it('should return the track number', () => {
            // Arrange

            // Act
            const number: number = trackModel.number;

            // Assert
            expect(number).toEqual(5);
        });
    });
    describe('title', () => {
        it('should return the track title', () => {
            // Arrange

            // Act
            const title: string = trackModel.title;

            // Assert
            expect(title).toEqual('Track title');
        });
    });

    describe('artists', () => {
        it('should return the track artists', () => {
            // Arrange
            const expectedArtists: string[] = ['Artist 1', 'Artist 2'];

            // Act
            const artists: string[] = trackModel.artists;

            // Assert
            expect(artists).toEqual(expectedArtists);
        });
    });

    describe('durationInMilliseconds', () => {
        it('should return the track duration in milliseconds', () => {
            // Arrange

            // Act
            const durationInMilliseconds: number = trackModel.durationInMilliseconds;

            // Assert
            expect(durationInMilliseconds).toEqual(45648713213);
        });
    });
});
