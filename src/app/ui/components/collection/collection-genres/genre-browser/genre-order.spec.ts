import { GenreOrder, genreOrderKey } from './genre-order';

describe('GenreOrder', () => {
    describe('genreOrderKey', () => {
        [
            [GenreOrder.byGenreAscending, 'by-genre-ascending'],
            [GenreOrder.byGenreDescending, 'by-genre-descending'],
        ].forEach((pair) => {
            const artistType = pair[0] as GenreOrder;

            it(`should return genre order key for ${artistType}`, () => {
                // Arrange
                const expectedGenreOrderKey = pair[1] as string;

                // Act
                const result = genreOrderKey(artistType);

                // Assert
                expect(result).toEqual(expectedGenreOrderKey);
            });
        });
    });
});
