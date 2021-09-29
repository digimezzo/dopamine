import { BasePlaylistService } from './base-playlist.service';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let service: BasePlaylistService;

    beforeEach(() => {
        service = new PlaylistService();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
