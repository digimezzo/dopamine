import * as assert from 'assert';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheService } from '../app/services/album-artwork-cache/album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    describe('addArtworkDataToCacheAsync', () => {
        it('Should return null when the data is null', async () => {
            // Arrange
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(null);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is undefined', async () => {
            // Arrange
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return null when the data is empty', async () => {
            // Arrange
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();
            const data = Buffer.alloc(0);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return a valid AlbumArtworkCacheId when the data is not empty', async () => {
            // Arrange
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();
            const data = Buffer.from([1, 2, 3]);

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(data);

            // Assert
            assert.notStrictEqual(albumArtworkCacheId, null);
        });
    });
});
