import { Track } from '../../data/entities/track';
import { TrackModel } from '../track/track-model';

describe('TrackModel', () => {
    let track: Track;
    let trackModel: TrackModel;

    beforeEach(() => {
        track = new Track('/home/user/Music/Track1.mp3');
        trackModel = new TrackModel(track);
    });

    describe('constructor', () => {
        it('should create', async () => {
            // Arrange

            // Act

            // Assert
            expect(trackModel).toBeDefined();
        });
    });

    describe('path', () => {
        it('should return track path', async () => {
            // Arrange

            // Act
            const trackPath: string = trackModel.path;

            // Assert
            expect(trackPath).toEqual(track.path);
        });
    });
});
