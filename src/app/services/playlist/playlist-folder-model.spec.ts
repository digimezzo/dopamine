import { PlaylistFolderModel } from './playlist-folder-model';

describe('PlaylistFolder', () => {
    function createPlaylistFolder(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(path);
    }

    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = createPlaylistFolder('/home/user/Music/Dopamine/Playlists/Folder 1');

            // Assert
            expect(playlistFolder).toBeDefined();
        });

        it('should set path', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = createPlaylistFolder('/home/user/Music/Dopamine/Playlists/Folder 1');

            // Assert
            expect(playlistFolder.path).toEqual('/home/user/Music/Dopamine/Playlists/Folder 1');
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = createPlaylistFolder('/home/user/Music/Dopamine/Playlists/Folder 1');

            // Assert
            expect(playlistFolder.isSelected).toBeFalsy();
        });
    });
});
