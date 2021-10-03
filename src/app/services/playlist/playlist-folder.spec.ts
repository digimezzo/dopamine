import { PlaylistFolder } from './playlist-folder';

describe('PlaylistFolder', () => {
    function createPlaylistFolder(): PlaylistFolder {
        return new PlaylistFolder();
    }

    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolder = createPlaylistFolder();

            // Assert
            expect(playlistFolder).toBeDefined();
        });
    });
});
