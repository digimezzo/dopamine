import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../common/io/file-system';
import { PlaylistFolderModel } from '../services/playlist/playlist-folder-model';
import { PlaylistFolderNamePipe } from './playlist-folder-name.pipe';

describe('PlaylistFolderNamePipe', () => {
    let filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    let playlistFolderNamePipe: PlaylistFolderNamePipe;

    beforeEach(() => {
        filesystemMock = Mock.ofType<FileSystem>();
        filesystemMock.setup((x) => x.getDirectoryName('/home/User/Music/Dopamine/Playlists/Folder 1')).returns(() => 'Folder 1');

        playlistFolderNamePipe = new PlaylistFolderNamePipe(filesystemMock.object);
    });

    describe('transform', () => {
        it('should return empty string if playlistFolder is undefined', () => {
            // Arrange

            // Act
            const playlistFolderName: string = playlistFolderNamePipe.transform(undefined);

            // Assert
            expect(playlistFolderName).toEqual('');
        });

        it('should return empty string if playlistFolder path is undefined', () => {
            // Arrange
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel(undefined);

            // Act
            const playlistFolderName: string = playlistFolderNamePipe.transform(playlistFolder);

            // Assert
            expect(playlistFolderName).toEqual('');
        });

        it('should return empty string if playlistFolder path is empty', () => {
            // Arrange
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel('');

            // Act
            const playlistFolderName: string = playlistFolderNamePipe.transform(playlistFolder);

            // Assert
            expect(playlistFolderName).toEqual('');
        });

        it('should return the playlistFolder name of a playlistFolder path', () => {
            // Arrange
            const playlistFolder: PlaylistFolderModel = new PlaylistFolderModel('/home/User/Music/Dopamine/Playlists/Folder 1');

            // Act
            const playlistFolderName: string = playlistFolderNamePipe.transform(playlistFolder);

            // Assert
            expect(playlistFolderName).toEqual('Folder 1');
        });
    });
});
