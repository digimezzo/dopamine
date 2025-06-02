import { AlbumOrder, albumOrderKey } from './album-order';

describe('AlbumOrder', () => {
    describe('albumOrderKey', () => {
        [
            [AlbumOrder.byAlbumTitleAscending, 'by-album-title-ascending'],
            [AlbumOrder.byAlbumTitleDescending, 'by-album-title-descending'],
            [AlbumOrder.byDateAdded, 'by-date-added'],
            [AlbumOrder.byDateCreated, 'by-date-created'],
            [AlbumOrder.byAlbumArtist, 'by-album-artist'],
            [AlbumOrder.byYearAscending, 'by-year-ascending'],
            [AlbumOrder.byYearDescending, 'by-year-descending'],
            [AlbumOrder.byLastPlayed, 'by-last-played'],
            [AlbumOrder.random, 'random'],
        ].forEach((pair) => {
            const albumOrder = pair[0] as AlbumOrder;

            it(`should return album order key for ${albumOrder}`, () => {
                // Arrange
                const expectedAlbumOrderKey = pair[1] as string;

                // Act
                const result = albumOrderKey(albumOrder);

                // Assert
                expect(result).toEqual(expectedAlbumOrderKey);
            });
        });
    });
});
