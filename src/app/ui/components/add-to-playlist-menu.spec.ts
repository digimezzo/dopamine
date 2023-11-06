import { IMock, Mock } from 'typemoq';
import { AddToPlaylistMenu } from './add-to-playlist-menu';
import { PlaylistFolderServiceBase } from '../../services/playlist-folder/playlist-folder.service.base';
import { PlaylistServiceBase } from '../../services/playlist/playlist.service.base';
import { Logger } from '../../common/logger';

describe('PlaylistsContextMenu', () => {
    let playlistFolderServiceMock: IMock<PlaylistFolderServiceBase>;
    let playlistServiceMock: IMock<PlaylistServiceBase>;
    let loggerMock: IMock<Logger>;
    let playlistsContextMenu: AddToPlaylistMenu;

    beforeEach(() => {
        playlistFolderServiceMock = Mock.ofType<PlaylistFolderServiceBase>();
        playlistServiceMock = Mock.ofType<PlaylistServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        playlistsContextMenu = new AddToPlaylistMenu(playlistFolderServiceMock.object, playlistServiceMock.object, loggerMock.object);
    });

    describe('initializeAsync', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(playlistsContextMenu).toBeDefined();
        });

        it('should initialize playlists as undefined', () => {
            // Arrange

            // Act

            // Assert
            expect(playlistsContextMenu.playlists).toBeUndefined();
        });
    });

    test.todo('should write tests');
});
