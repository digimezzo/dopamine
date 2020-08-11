import * as assert from 'assert';
import { AlbumArtworkCacheId } from '../app/services/artwork-cache/album-artwork-cache-id';
import { AlbumArtworkCacheService } from '../app/services/artwork-cache/album-artwork-cache.service';

describe('AlbumArtworkCacheService', () => {
    describe('addArtworkDataToCacheAsync', () => {
        it('Should returns null when Buffer is null', async () => {
            // Arrange
            const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(null);

            // Assert
            assert.strictEqual(albumArtworkCacheId, null);
        });

        it('Should return empty string when Buffer is undefined', async () => {
             // Arrange
             const albumArtworkCacheService: AlbumArtworkCacheService = new AlbumArtworkCacheService();

             // Act
             const albumArtworkCacheId: AlbumArtworkCacheId = await albumArtworkCacheService.addArtworkDataToCacheAsync(undefined);
 
             // Assert
             assert.strictEqual(albumArtworkCacheId, null);
        });
    });
});
