import * as assert from 'assert';
import { ApplicationPaths } from './application-paths';

describe('ApplicationPaths', () => {
    describe('generateAlbumKey', () => {
        it('should return the cache folder', () => {
            // Arrange

            // Act
            const cacheFolder: string = ApplicationPaths.cacheFolder;

            // Assert
            assert.strictEqual(cacheFolder, 'Cache');
        });

        it('should return the cover art cache folder', () => {
            // Arrange

            // Act
            const coverArtCacheFolder: string = ApplicationPaths.CoverArtCacheFolder;

            // Assert
            assert.strictEqual(coverArtCacheFolder, 'CoverArt');
        });
    });
});
