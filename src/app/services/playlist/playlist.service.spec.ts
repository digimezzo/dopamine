import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistFolder } from './playlist-folder';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let fileSystemMock: IMock<FileSystem>;
    let textSanitizerMock: IMock<TextSanitizer>;
    let loggerMock: IMock<Logger>;

    function createService(): BasePlaylistService {
        return new PlaylistService(fileSystemMock.object, textSanitizerMock.object, loggerMock.object);
    }

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        textSanitizerMock = Mock.ofType<TextSanitizer>();
        loggerMock = Mock.ofType<Logger>();

        fileSystemMock.setup((x) => x.musicDirectory()).returns(() => '/home/User/Music');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music', 'Dopamine', 'Playlists']))
            .returns(() => '/home/User/Music/Dopamine/Playlists');

        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music/Dopamine/Playlists', 'My playlist folder']))
            .returns(() => '/home/User/Music/Dopamine/Playlists/My playlist folder');

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

    describe('getPlaylistFolders', () => {
        it('should get the playlist folders', () => {
            // Arrange
            const service: BasePlaylistService = createService();

            // Act
            const playlistFolders: PlaylistFolder[] = service.getPlaylistFolders();

            // Assert
            expect(playlistFolders.length).toEqual(2);
        });
    });
});
