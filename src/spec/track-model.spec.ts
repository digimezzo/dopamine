import * as assert from 'assert';
import { Track } from '../app/data/entities/track';
import { TrackModel } from '../app/services/playback/track-model';

describe('TrackModel', () => {
    describe('path', () => {
        it('Should return track path', async () => {
            // Arrange
            const track: Track = new Track('/home/user/Music/Track1.mp3');

            const trackModel: TrackModel = new TrackModel(track);

            // Act
            const trackPath: string = trackModel.path;

            // Assert
            assert.strictEqual(trackPath, track.path);
        });
    });
});
