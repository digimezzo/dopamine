import assert from 'assert';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let service: TrackService;

    beforeEach(() => {
        service = new TrackService();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(service);
        });
    });
});
