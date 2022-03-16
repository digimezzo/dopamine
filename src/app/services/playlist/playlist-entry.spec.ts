import { PlaylistEntry } from './playlist-entry';

describe('PlaylistEntry', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistEntry: PlaylistEntry = new PlaylistEntry('Path 1', 'Path 2');

            // Assert
            expect(playlistEntry).toBeDefined();
        });

        it('should set referencePath', () => {
            // Arrange

            // Act
            const playlistEntry: PlaylistEntry = new PlaylistEntry('Path 1', 'Path 2');

            // Assert
            expect(playlistEntry.referencePath).toEqual('Path 1');
        });

        it('should set decodedPath', () => {
            // Arrange

            // Act
            const playlistEntry: PlaylistEntry = new PlaylistEntry('Path 1', 'Path 2');

            // Assert
            expect(playlistEntry.decodedPath).toEqual('Path 2');
        });
    });
});
