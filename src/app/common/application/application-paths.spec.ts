import { ApplicationPaths } from './application-paths';

describe('ApplicationPaths', () => {
    describe('generateAlbumKey', () => {
        it('should return the cache folder', () => {
            // Arrange

            // Act
            const cacheFolder: string = ApplicationPaths.cacheFolder;

            // Assert
            expect(cacheFolder).toEqual('Cache');
        });

        it('should return the cover art cache folder', () => {
            // Arrange

            // Act
            const coverArtCacheFolder: string = ApplicationPaths.coverArtCacheFolder;

            // Assert
            expect(coverArtCacheFolder).toEqual('CoverArt');
        });

        it('should return the themes folder', () => {
            // Arrange

            // Act
            const themesFolder: string = ApplicationPaths.themesFolder;

            // Assert
            expect(themesFolder).toEqual('Themes');
        });
    });
});
