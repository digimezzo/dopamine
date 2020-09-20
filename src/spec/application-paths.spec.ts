import * as assert from 'assert';
import { ApplicationPaths } from '../app/core/base/application-paths';

describe('ApplicationPaths', () => {
    describe('generateAlbumKey', () => {
        it('Should return the cache folder', () => {
            // Arrange

            // Act
            const cacheFolder: string = ApplicationPaths.cacheFolder;

            // Assert
            assert.strictEqual(cacheFolder, 'Cache');
        });

        it('Should return the cover art cache folder', () => {
            // Arrange

            // Act
            const coverArtCacheFolder: string = ApplicationPaths.CoverArtCacheFolder;

            // Assert
            assert.strictEqual(coverArtCacheFolder, 'CoverArt');
        });
    });
});
