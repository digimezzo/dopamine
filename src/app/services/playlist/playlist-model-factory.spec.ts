import { IMock, Mock } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';

describe('PlaylistModelFactory', () => {
    let fileSystemMock: IMock<FileSystem>;

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        fileSystemMock
            .setup((x) => x.getFileName('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
            .returns(() => 'Playlist 1');
        fileSystemMock
            .setup((x) => x.getDirectoryOrFileName('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
            .returns(() => 'Folder 1');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistModelFactory: PlaylistModelFactory = new PlaylistModelFactory(fileSystemMock.object);

            // Assert
            expect(playlistModelFactory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create a PlaylistFolderModel', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = new PlaylistModelFactory(fileSystemMock.object);

            // Act
            const playlistModel: PlaylistModel = playlistModelFactory.create(
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'
            );

            // Assert
            expect(playlistModel.name).toEqual('Playlist 1');
            expect(playlistModel.folderName).toEqual('Folder 1');
            expect(playlistModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u');
        });
    });

    describe('createDefault', () => {
        it('should create a default PlaylistFolderModel', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = new PlaylistModelFactory(fileSystemMock.object);

            // Act
            const playlistModel: PlaylistModel = playlistModelFactory.createDefault();

            // Assert
            expect(playlistModel.name).toEqual('');
            expect(playlistModel.path).toEqual('');
            expect(playlistModel.imagePath).toEqual(Constants.emptyImage);
            expect(playlistModel.isDefault).toBeTruthy();
        });
    });
});
