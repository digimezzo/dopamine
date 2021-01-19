import * as assert from 'assert';
import { Track } from '../../data/entities/track';
import { TrackModel } from './track-model';

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
            assert.ok(trackModel);
        });
    });

    describe('path', () => {
        it('should return track path', async () => {
            // Arrange

            // Act
            const trackPath: string = trackModel.path;

            // Assert
            assert.strictEqual(trackPath, track.path);
        });
    });
});
