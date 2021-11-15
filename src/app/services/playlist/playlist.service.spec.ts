import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let playlistFolderModelFactoryMock: IMock<PlaylistFolderModelFactory>;
    let fileSystemMock: IMock<FileSystem>;
    let textSanitizerMock: IMock<TextSanitizer>;
    let loggerMock: IMock<Logger>;

    function createService(): BasePlaylistService {
        return new PlaylistService(
            playlistFolderModelFactoryMock.object,
            fileSystemMock.object,
            textSanitizerMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playlistFolderModelFactoryMock = Mock.ofType<PlaylistFolderModelFactory>();
        fileSystemMock = Mock.ofType<FileSystem>();
        textSanitizerMock = Mock.ofType<TextSanitizer>();
        loggerMock = Mock.ofType<Logger>();

        playlistFolderModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder1'))
            .returns(() => new PlaylistFolderModel('Folder1', '/home/User/Music/Dopamine/Playlists/Folder1'));

        playlistFolderModelFactoryMock
            .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder2'))
            .returns(() => new PlaylistFolderModel('Folder2', '/home/User/Music/Dopamine/Playlists/Folder2'));

        fileSystemMock.setup((x) => x.musicDirectory()).returns(() => '/home/User/Music');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music', 'Dopamine', 'Playlists']))
            .returns(() => '/home/User/Music/Dopamine/Playlists');

        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music/Dopamine/Playlists', 'My playlist folder']))
            .returns(() => '/home/User/Music/Dopamine/Playlists/My playlist folder');

        fileSystemMock
            .setup((x) => x.getDirectoriesInDirectoryAsync('/home/User/Music/Dopamine/Playlists'))
            .returns(async () => ['/home/User/Music/Dopamine/Playlists/Folder1', '/home/User/Music/Dopamine/Playlists/Folder2']);

        textSanitizerMock.setup((x) => x.sanitize('My playlist folder')).returns(() => 'My playlist folder');
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
            service.createPlaylistFolder('My playlist folder');

            // Assert
            textSanitizerMock.verify((x) => x.sanitize('My playlist folder'), Times.once());
        });

        it('should create the playlist folder directory if it does not exist', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act
            service.createPlaylistFolder('My playlist folder');

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
            expect(playlistFolders[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder1');
            expect(playlistFolders[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder2');
        });
    });
});
