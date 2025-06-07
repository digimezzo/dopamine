import { ArtistType, artistTypeKey } from './artist-type';

describe('ArtistType', () => {
    describe('artistTypeKey', () => {
        [
            [ArtistType.trackArtists, 'track-artists'],
            [ArtistType.albumArtists, 'album-artists'],
            [ArtistType.allArtists, 'all-artists'],
        ].forEach((pair) => {
            const artistType = pair[0] as ArtistType;

            it(`should return artist type key for ${artistType}`, () => {
                // Arrange
                const expectedArtistTypeKey = pair[1] as string;

                // Act
                const result = artistTypeKey(artistType);

                // Assert
                expect(result).toEqual(expectedArtistTypeKey);
            });
        });
    });
});
