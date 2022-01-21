import { PlaylistModel } from './playlist-model';

describe('PlaylistModel', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist).toBeDefined();
        });

        it('should set name', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist.name).toEqual('Playlist 1');
        });

        it('should set folderName', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist.folderName).toEqual('Playlist 1 folder');
        });

        it('should set path', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist.path).toEqual('/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u');
        });

        it('should set imagePath', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist.imagePath).toEqual('/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png');
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist 1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Assert
            expect(playlist.isSelected).toBeFalsy();
        });
    });

    describe('isDefault', () => {
        it('should return true if name is undefined', () => {
            // Arrange
            const playlist: PlaylistModel = new PlaylistModel(
                undefined,
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Act

            // Assert
            expect(playlist.isDefault).toBeTruthy();
        });

        it('should return true if name is empty', () => {
            // Arrange
            const playlist: PlaylistModel = new PlaylistModel(
                '',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Act

            // Assert
            expect(playlist.isDefault).toBeTruthy();
        });

        it('should return true if name is space', () => {
            // Arrange
            const playlist: PlaylistModel = new PlaylistModel(
                ' ',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Act

            // Assert
            expect(playlist.isDefault).toBeTruthy();
        });

        it('should return false if name is not undefined or empty or space', () => {
            // Arrange
            const playlist: PlaylistModel = new PlaylistModel(
                'Playlist1',
                'Playlist 1 folder',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.m3u',
                '/home/user/Music/Dopamine/Playlists/Folder 1/Playlist1.png'
            );

            // Act

            // Assert
            expect(playlist.isDefault).toBeFalsy();
        });
    });
});
