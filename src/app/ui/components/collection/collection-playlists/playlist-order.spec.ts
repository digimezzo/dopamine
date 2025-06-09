import { PlaylistOrder, playlistOrderKey } from './playlist-order';

describe('PlaylistOrder', () => {
    describe('playlistOrderKey', () => {
        [
            [PlaylistOrder.byPlaylistNameAscending, 'by-playlist-name-ascending'],
            [PlaylistOrder.byPlaylistNameDescending, 'by-playlist-name-descending'],
        ].forEach((pair) => {
            const playlistOrder = pair[0] as PlaylistOrder;

            it(`should return playlist order key for ${playlistOrder}`, () => {
                // Arrange
                const expectedPlaylistOrderKey = pair[1] as string;

                // Act
                const result = playlistOrderKey(playlistOrder);

                // Assert
                expect(result).toEqual(expectedPlaylistOrderKey);
            });
        });
    });
});
