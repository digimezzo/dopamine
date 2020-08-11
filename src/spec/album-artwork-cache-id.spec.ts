import * as assert from 'assert';
import { AlbumArtworkCacheId } from '../app/services/artwork-cache/album-artwork-cache-id';


describe('AlbumArtworkCacheId', () => {
    describe('createNew', () => {
        it('Should create an identifiers which have an identifier', () => {
            // Arrange
            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = AlbumArtworkCacheId.createNew();

            // Assert
            assert.ok(albumArtworkCacheId.id);
        });

        it('Should create an identifiers which starts with album-', () => {
            // Arrange
            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = AlbumArtworkCacheId.createNew();

            // Assert
            assert.ok(albumArtworkCacheId.id.startsWith('album-'));
        });

        it('Should create an identifiers which has a length of 42 characters', () => {
            // Arrange
            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = AlbumArtworkCacheId.createNew();

            // Assert
            assert.strictEqual(albumArtworkCacheId.id.length, 42);
        });

        it('Should create unique identifiers', () => {
            // Arrange
            // Act
            const albumArtworkCacheId1: AlbumArtworkCacheId = AlbumArtworkCacheId.createNew();
            const albumArtworkCacheId2: AlbumArtworkCacheId = AlbumArtworkCacheId.createNew();

            // Assert
            assert.notStrictEqual(albumArtworkCacheId1.id, albumArtworkCacheId2.id);
        });
    });
});
