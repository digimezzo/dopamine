import * as assert from 'assert';
import { AlbumArtworkCacheId } from '../app/services/album-artwork-cache/album-artwork-cache-id';

describe('AlbumArtworkCacheId', () => {
    describe('constructor', () => {
        it('Should create an identifier which is not null or undefined', () => {
            // Arrange

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            // Assert
            assert.ok(albumArtworkCacheId.id);
        });

        it('Should create an identifier which starts with album-', () => {
            // Arrange

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            // Assert
            assert.ok(albumArtworkCacheId.id.startsWith('album-'));
        });

        it('Should create an identifier which has a length of 42 characters', () => {
            // Arrange

            // Act
            const albumArtworkCacheId: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            // Assert
            assert.strictEqual(albumArtworkCacheId.id.length, 42);
        });

        it('Should create unique identifiers', () => {
            // Arrange

            // Act
            const albumArtworkCacheId1: AlbumArtworkCacheId = new AlbumArtworkCacheId();
            const albumArtworkCacheId2: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            // Assert
            assert.notStrictEqual(albumArtworkCacheId1.id, albumArtworkCacheId2.id);
        });
    });
});
