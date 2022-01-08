import { IMock, Mock } from 'typemoq';
import { BasePlaylistFolderService } from '../../services/playlist-folder/base-playlist-folder.service';
import { BasePlaylistService } from '../../services/playlist/base-playlist.service';
import { PlaylistsContextMenu } from './playlists-context-menu';

describe('PlaylistsContextMenu', () => {
    let playlistFolderServiceMock: IMock<BasePlaylistFolderService>;
    let playlistServiceMock: IMock<BasePlaylistService>;
    let playlistsContextMenu: PlaylistsContextMenu;

    beforeEach(() => {
        playlistFolderServiceMock = Mock.ofType<BasePlaylistFolderService>();
        playlistServiceMock = Mock.ofType<BasePlaylistService>();
        playlistsContextMenu = new PlaylistsContextMenu(playlistFolderServiceMock.object, playlistServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(playlistsContextMenu).toBeDefined();
        });

        it('should initialize empty playlistFolders', () => {
            // Arrange

            // Act

            // Assert
            expect(playlistsContextMenu.playlistFolders.length).toEqual(0);
        });

        it('should initialize empty playlists', () => {
            // Arrange

            // Act

            // Assert
            expect(playlistsContextMenu.playlists.length).toEqual(0);
        });
    });

    // describe('calculateNumberOfItemsPerRow', () => {
    //     it('should return 0 when itemWidth is undefined', () => {
    //         // Arrange
    //         const itemWidth: number = undefined;
    //         const availableWidth: number = 800;

    //         // Act
    //         const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

    //         // Assert
    //         expect(numberOfItemsPerRow).toEqual(0);
    //     });
    // });
});
