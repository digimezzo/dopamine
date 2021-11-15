import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';

describe('PlaylistFolderModelFactory', () => {
    let fileSystemMock: IMock<FileSystem>;

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        fileSystemMock.setup((x) => x.getDirectoryName('/home/username/Music/Dopamine/Playlists/Folder 1')).returns(() => 'Folder 1');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(fileSystemMock.object);

            // Assert
            expect(playlistFolderModelFactory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create a PlaylistFolderModel', () => {
            // Arrange
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(fileSystemMock.object);

            // Act
            const playlistFolderModel: PlaylistFolderModel = playlistFolderModelFactory.create(
                '/home/username/Music/Dopamine/Playlists/Folder 1'
            );

            // Assert
            expect(playlistFolderModel.name).toEqual('Folder 1');
            expect(playlistFolderModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Folder 1');
        });
    });
});
