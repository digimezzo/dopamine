import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let playlistFolderModelFactoryMock: IMock<PlaylistFolderModelFactory>;
    let playlistModelFactoryMock: IMock<PlaylistModelFactory>;
    let fileSystemMock: IMock<FileSystem>;
    let textSanitizerMock: IMock<TextSanitizer>;
    let loggerMock: IMock<Logger>;

    function createService(): BasePlaylistService {
        return new PlaylistService(
            playlistFolderModelFactoryMock.object,
            playlistModelFactoryMock.object,
            fileSystemMock.object,
            textSanitizerMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playlistFolderModelFactoryMock = Mock.ofType<PlaylistFolderModelFactory>();
        playlistModelFactoryMock = Mock.ofType<PlaylistModelFactory>();
        fileSystemMock = Mock.ofType<FileSystem>();
        textSanitizerMock = Mock.ofType<TextSanitizer>();
        loggerMock = Mock.ofType<Logger>();

        playlistFolderModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 1'))
            .returns(() => new PlaylistFolderModel('Folder 1', '/home/User/Music/Dopamine/Playlists/Folder 1'));

        playlistFolderModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 2'))
            .returns(() => new PlaylistFolderModel('Folder 2', '/home/User/Music/Dopamine/Playlists/Folder 2'));

        playlistModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
            .returns(() => new PlaylistFolderModel('Playlist 1', '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'));
        playlistModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 2.m3u'))
            .returns(() => new PlaylistFolderModel('Playlist 1', '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 2.m3u'));

        fileSystemMock.setup((x) => x.musicDirectory()).returns(() => '/home/User/Music');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music', 'Dopamine', 'Playlists']))
            .returns(() => '/home/User/Music/Dopamine/Playlists');

        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music/Dopamine/Playlists', 'My playlist folder']))
            .returns(() => '/home/User/Music/Dopamine/Playlists/My playlist folder');

        fileSystemMock
            .setup((x) => x.getDirectoriesInDirectoryAsync('/home/User/Music/Dopamine/Playlists'))
            .returns(async () => ['/home/User/Music/Dopamine/Playlists/Folder 1', '/home/User/Music/Dopamine/Playlists/Folder 2']);

        fileSystemMock
            .setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists/Folder 1'))
            .returns(async () => [
                '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u',
                '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 2.m3u',
            ]);

        textSanitizerMock.setup((x) => x.sanitize('My dirty playlist folder')).returns(() => 'My playlist folder');
        textSanitizerMock.setup((x) => x.sanitize('My new dirty playlist folder')).returns(() => 'My new playlist folder');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BasePlaylistService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should ensure that the playlists folder exists', () => {
            // Arrange

            // Act
            const service: BasePlaylistService = createService();

            // Assert
            fileSystemMock.verify((x) => x.createFullDirectoryPathIfDoesNotExist('/home/User/Music/Dopamine/Playlists'), Times.once());
        });
    });

    describe('createPlaylistFolder', () => {
        it('should throw an error if playlistFolderName is undefined', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act

            // Assert
            expect(() => service.createPlaylistFolder(undefined)).toThrow(Error);
        });

        it('should throw an error if playlistFolderName is empty', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act

            // Assert
            expect(() => service.createPlaylistFolder('')).toThrow(Error);
        });

        it('should throw an error if playlistFolderName is space', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act

            // Assert
            expect(() => service.createPlaylistFolder(' ')).toThrow(Error);
        });

        it('should sanitize playlistFolderName', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act
            service.createPlaylistFolder('My dirty playlist folder');

            // Assert
            textSanitizerMock.verify((x) => x.sanitize('My dirty playlist folder'), Times.once());
        });

        it('should create the playlist folder directory if it does not exist', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act
            service.createPlaylistFolder('My dirty playlist folder');

            // Assert
            fileSystemMock.verify(
                (x) => x.createFullDirectoryPathIfDoesNotExist('/home/User/Music/Dopamine/Playlists/My playlist folder'),
                Times.once()
            );
        });
    });

    describe('getPlaylistFoldersAsync', () => {
        it('should get the playlist folders', async () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act
            const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

            // Assert
            expect(playlistFolders.length).toEqual(2);
            expect(playlistFolders[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1');
            expect(playlistFolders[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 2');
        });
    });

    describe('deletePlaylistFolder', () => {
        it('should delete the playlist folder', async () => {
            // Arrange
            const service: BasePlaylistService = createService();
            const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

            // Act
            service.deletePlaylistFolder(playlistFolders[0]);

            // Assert
            fileSystemMock.verify((x) => x.deleteDirectoryRecursively(playlistFolders[0].path), Times.once());
        });
    });

    describe('renamePlaylistFolder', () => {
        it('should sanitize the playlist folder name', async () => {
            // Arrange
            const service: BasePlaylistService = createService();
            const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

            // Act
            service.renamePlaylistFolder(playlistFolders[0], 'My new dirty playlist folder');

            // Assert
            textSanitizerMock.verify((x) => x.sanitize('My new dirty playlist folder'), Times.once());
        });

        it('should rename the playlist folder using the sanitized playlist folder name', async () => {
            // Arrange
            const service: BasePlaylistService = createService();
            const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

            // Act
            service.renamePlaylistFolder(playlistFolders[0], 'My new dirty playlist folder');

            // Assert
            fileSystemMock.verify((x) => x.renameDirectory(playlistFolders[0].path, 'My new playlist folder'), Times.once());
        });
    });

    describe('getPlaylistFoldersAsync', () => {
        it('should get the playlists', async () => {
            // Arrange
            const service: BasePlaylistService = createService();
            const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

            // Act
            const playlists: PlaylistModel[] = await service.getPlaylistsAsync(playlistFolders[0]);

            // Assert
            expect(playlists.length).toEqual(2);
            expect(playlists[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u');
            expect(playlists[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 2.m3u');
        });
    });
});
