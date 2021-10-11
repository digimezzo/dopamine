import { IMock, Mock, Times } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    let fileSystemMock: IMock<FileSystem>;
    let loggerMock: IMock<Logger>;

    function createService(): BasePlaylistService {
        return new PlaylistService(fileSystemMock.object, loggerMock.object);
    }

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        loggerMock = Mock.ofType<Logger>();

        fileSystemMock.setup((x) => x.musicDirectory()).returns(() => '/home/User/Music');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/User/Music', 'Dopamine', 'Playlists']))
            .returns(() => '/home/User/Music/Dopamine/Playlists');
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
        throw new Error();
    });
});
