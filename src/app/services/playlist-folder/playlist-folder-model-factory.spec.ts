import { IMock, Mock } from 'typemoq';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';

describe('PlaylistFolderModelFactory', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<BaseFileAccess>;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('unsorted')).returns(() => 'Unsorted');
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/username/Music/Dopamine/Playlists/Folder 1')).returns(() => 'Folder 1');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(
                translatorServiceMock.object,
                fileAccessMock.object
            );

            // Assert
            expect(playlistFolderModelFactory).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create a modifiable PlaylistFolderModel', () => {
            // Arrange
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(
                translatorServiceMock.object,
                fileAccessMock.object
            );

            // Act
            const playlistFolderModel: PlaylistFolderModel = playlistFolderModelFactory.create(
                '/home/username/Music/Dopamine/Playlists/Folder 1'
            );

            // Assert
            expect(playlistFolderModel.name).toEqual('Folder 1');
            expect(playlistFolderModel.path).toEqual('/home/username/Music/Dopamine/Playlists/Folder 1');
            expect(playlistFolderModel.isModifiable).toBeTruthy();
        });
    });

    describe('createUnsorted', () => {
        it('should create an unmodifiable unsorted PlaylistFolderModel', () => {
            // Arrange
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(
                translatorServiceMock.object,
                fileAccessMock.object
            );

            // Act
            const playlistFolderModel: PlaylistFolderModel = playlistFolderModelFactory.createUnsorted(
                '/home/username/Music/Dopamine/Playlists'
            );

            // Assert
            expect(playlistFolderModel.name).toEqual('Unsorted');
            expect(playlistFolderModel.path).toEqual('/home/username/Music/Dopamine/Playlists');
            expect(playlistFolderModel.isModifiable).toBeFalsy();
        });
    });

    describe('createDefault', () => {
        it('should create a default PlaylistFolderModel', () => {
            // Arrange
            const playlistFolderModelFactory: PlaylistFolderModelFactory = new PlaylistFolderModelFactory(
                translatorServiceMock.object,
                fileAccessMock.object
            );

            // Act
            const playlistFolderModel: PlaylistFolderModel = playlistFolderModelFactory.createDefault();

            // Assert
            expect(playlistFolderModel.name).toEqual('');
            expect(playlistFolderModel.path).toEqual('');
            expect(playlistFolderModel.isModifiable).toBeFalsy();
            expect(playlistFolderModel.isDefault).toBeTruthy();
        });
    });
});
