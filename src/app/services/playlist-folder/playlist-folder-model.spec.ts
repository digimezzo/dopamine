import { PlaylistFolderModel } from './playlist-folder-model';

describe('PlaylistFolderModel', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(
                'Folder 1',
                '/home/user/Music/Dopamine/Playlists/Folder 1',
                true
            );

            // Assert
            expect(playlistFolder).toBeDefined();
        });

        it('should set name', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(
                'Folder 1',
                '/home/user/Music/Dopamine/Playlists/Folder 1',
                true
            );

            // Assert
            expect(playlistFolder.name).toEqual('Folder 1');
        });

        it('should set path', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(
                'Folder 1',
                '/home/user/Music/Dopamine/Playlists/Folder 1',
                true
            );

            // Assert
            expect(playlistFolder.path).toEqual('/home/user/Music/Dopamine/Playlists/Folder 1');
        });

        it('should set isModifiable', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(
                'Folder 1',
                '/home/user/Music/Dopamine/Playlists/Folder 1',
                true
            );

            // Assert
            expect(playlistFolder.isModifiable).toBeTruthy();
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(
                'Folder 1',
                '/home/user/Music/Dopamine/Playlists/Folder 1',
                true
            );

            // Assert
            expect(playlistFolder.isSelected).toBeFalsy();
        });
    });
});
