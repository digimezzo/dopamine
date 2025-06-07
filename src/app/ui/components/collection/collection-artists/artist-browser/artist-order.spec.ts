import { ArtistOrder, artistOrderKey } from './artist-order';

describe('ArtistOrder', () => {
    describe('artistOrderKey', () => {
        [
            [ArtistOrder.byArtistAscending, 'by-artist-ascending'],
            [ArtistOrder.byArtistDescending, 'by-artist-descending'],
        ].forEach((pair) => {
            const artistOrder = pair[0] as ArtistOrder;

            it(`should return artist order key for ${artistOrder}`, () => {
                // Arrange
                const expectedArtistOrderKey = pair[1] as string;

                // Act
                const result = artistOrderKey(artistOrder);

                // Assert
                expect(result).toEqual(expectedArtistOrderKey);
            });
        });
    });
});
