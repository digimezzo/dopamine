import { IMock, Mock } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { FileAccessBase } from '../../common/io/file-access.base';

describe('PlaylistModelFactory', () => {
    let baseTranslatorServiceMock: IMock<TranslatorServiceBase>;
    let fileAccessMock: IMock<FileAccessBase>;

    function createFactory(): PlaylistModelFactory {
        return new PlaylistModelFactory(baseTranslatorServiceMock.object, fileAccessMock.object);
    }

    beforeEach(() => {
        baseTranslatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        baseTranslatorServiceMock.setup((x) => x.get('unsorted')).returns(() => 'Unsorted');

        fileAccessMock = Mock.ofType<FileAccessBase>();
        fileAccessMock
            .setup((x) => x.getDirectoryPath('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
            .returns(() => '/home/username/Music/Dopamine/Playlists/Folder 1');
        fileAccessMock
            .setup((x) => x.getDirectoryPath('/home/username/Music/Dopamine/Playlists/Playlist 1.m3u'))
            .returns(() => '/home/username/Music/Dopamine/Playlists');
        fileAccessMock
            .setup((x) => x.getFileNameWithoutExtension('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
            .returns(() => 'Playlist 1');
        fileAccessMock
            .setup((x) => x.getFileNameWithoutExtension('/home/username/Music/Dopamine/Playlists/Playlist 1.m3u'))
            .returns(() => 'Playlist 1');
        fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/username/Music/Dopamine/Playlists/Folder 1')).returns(() => 'Folder 1');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistModelFactory: PlaylistModelFactory = createFactory();

            // Assert
            expect(playlistModelFactory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create a PlaylistFolderModel with an image if the image is not undefined or empty', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = createFactory();
            fileAccessMock
                .setup((x) => x.pathExists('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.png'))
                .returns(() => false);

            // Act
            const playlistModel: PlaylistModel = playlistModelFactory.create(
                '/home/username/Music/Dopamine/Playlists',
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u',
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1-d79a5db9-daaf-4c3c-8f94-ea5e56b7245d.png',
            );

            // Assert
            expect(playlistModel.name).toEqual('Playlist 1');
            expect(playlistModel.folderName).toEqual('Folder 1');
            expect(playlistModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u');
            expect(playlistModel.imagePath).toEqual(
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1-d79a5db9-daaf-4c3c-8f94-ea5e56b7245d.png',
            );
        });

        it('should create a PlaylistFolderModel without an image if the image is empty', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = createFactory();
            fileAccessMock
                .setup((x) => x.pathExists('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.png'))
                .returns(() => true);

            // Act
            const playlistModel: PlaylistModel = playlistModelFactory.create(
                '/home/username/Music/Dopamine/Playlists',
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u',
                '',
            );

            // Assert
            expect(playlistModel.name).toEqual('Playlist 1');
            expect(playlistModel.folderName).toEqual('Folder 1');
            expect(playlistModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u');
            expect(playlistModel.imagePath).toEqual(Constants.emptyImage);
        });

        it('should create a PlaylistFolderModel with Unsorted folderName if playlistPath equals playlistsParentFolderPath', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = createFactory();
            fileAccessMock.setup((x) => x.pathExists('/home/username/Music/Dopamine/Playlists/Playlist 1.png')).returns(() => true);

            // Act
            const playlistModel: PlaylistModel = playlistModelFactory.create(
                '/home/username/Music/Dopamine/Playlists',
                '/home/username/Music/Dopamine/Playlists/Playlist 1.m3u',
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1-d79a5db9-daaf-4c3c-8f94-ea5e56b7245d.png',
            );

            // Assert
            expect(playlistModel.name).toEqual('Playlist 1');
            expect(playlistModel.folderName).toEqual('Unsorted');
            expect(playlistModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Playlist 1.m3u');
            expect(playlistModel.imagePath).toEqual(
                '/home/username/Music/Dopamine/Playlists/Folder 1/Playlist 1-d79a5db9-daaf-4c3c-8f94-ea5e56b7245d.png',
            );
        });
    });

    describe('createDefault', () => {
        it('should create a default PlaylistFolderModel', () => {
            // Arrange
            const playlistModelFactory: PlaylistModelFactory = createFactory();

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
