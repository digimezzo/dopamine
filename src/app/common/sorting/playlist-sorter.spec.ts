import { PlaylistModel } from '../../services/playlist/playlist-model';
import { PlaylistSorter } from './playlist-sorter';

describe('PlaylistSorter', () => {
    let playlistModel1: PlaylistModel;
    let playlistModel2: PlaylistModel;
    let playlistModel3: PlaylistModel;
    let playlistModel4: PlaylistModel;
    let playlistModel5: PlaylistModel;
    let playlistModel6: PlaylistModel;
    let playlistModel7: PlaylistModel;
    let playlistModel8: PlaylistModel;
    let playlistModel9: PlaylistModel;
    let playlistModel10: PlaylistModel;

    let playlistSorter: PlaylistSorter;
    let playlists: PlaylistModel[];

    beforeEach(() => {
        playlistModel1 = new PlaylistModel('Playlist 1', 'Folder', 'Path 1', 'Image path 1');
        playlistModel2 = new PlaylistModel('Playlist 2', 'Folder', 'Path 2', 'Image path 2');
        playlistModel3 = new PlaylistModel('Playlist 3', 'Folder', 'Path 3', 'Image path 3');
        playlistModel4 = new PlaylistModel('Playlist 4', 'Folder', 'Path 4', 'Image path 4');
        playlistModel5 = new PlaylistModel('Playlist 5', 'Folder', 'Path 5', 'Image path 5');
        playlistModel6 = new PlaylistModel('Playlist 6', 'Folder', 'Path 6', 'Image path 6');
        playlistModel7 = new PlaylistModel('Playlist 7', 'Folder', 'Path 7', 'Image path 7');
        playlistModel8 = new PlaylistModel('Playlist 8', 'Folder', 'Path 8', 'Image path 8');
        playlistModel9 = new PlaylistModel('Playlist 9', 'Folder', 'Path 9', 'Image path 9');
        playlistModel10 = new PlaylistModel('Playlist 10', 'Folder', 'Path 10', 'Image path 10');

        playlists = [
            playlistModel2,
            playlistModel10,
            playlistModel6,
            playlistModel4,
            playlistModel9,
            playlistModel8,
            playlistModel1,
            playlistModel7,
            playlistModel5,
            playlistModel3,
        ];

        playlistSorter = new PlaylistSorter();
    });

    describe('sortAscending', () => {
        it('should return an empty collection if undefined is provided', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortAscending(undefined);

            // Assert
            expect(sortedPlaylists.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortAscending([]);

            // Assert
            expect(sortedPlaylists.length).toEqual(0);
        });

        it('should sort ascending', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortAscending(playlists);

            // Assert
            expect(sortedPlaylists[0]).toBe(playlistModel1);
            expect(sortedPlaylists[1]).toBe(playlistModel2);
            expect(sortedPlaylists[2]).toBe(playlistModel3);
            expect(sortedPlaylists[3]).toBe(playlistModel4);
            expect(sortedPlaylists[4]).toBe(playlistModel5);
            expect(sortedPlaylists[5]).toBe(playlistModel6);
            expect(sortedPlaylists[6]).toBe(playlistModel7);
            expect(sortedPlaylists[7]).toBe(playlistModel8);
            expect(sortedPlaylists[8]).toBe(playlistModel9);
            expect(sortedPlaylists[9]).toBe(playlistModel10);
        });
    });

    describe('sortDescending', () => {
        it('should return an empty collection if undefined is provided', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortDescending(undefined);

            // Assert
            expect(sortedPlaylists.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortDescending([]);

            // Assert
            expect(sortedPlaylists.length).toEqual(0);
        });

        it('should sort descending', () => {
            // Arrange

            // Act
            const sortedPlaylists: PlaylistModel[] = playlistSorter.sortDescending(playlists);

            // Assert
            expect(sortedPlaylists[0]).toBe(playlistModel10);
            expect(sortedPlaylists[1]).toBe(playlistModel9);
            expect(sortedPlaylists[2]).toBe(playlistModel8);
            expect(sortedPlaylists[3]).toBe(playlistModel7);
            expect(sortedPlaylists[4]).toBe(playlistModel6);
            expect(sortedPlaylists[5]).toBe(playlistModel5);
            expect(sortedPlaylists[6]).toBe(playlistModel4);
            expect(sortedPlaylists[7]).toBe(playlistModel3);
            expect(sortedPlaylists[8]).toBe(playlistModel2);
            expect(sortedPlaylists[9]).toBe(playlistModel1);
        });
    });
});
