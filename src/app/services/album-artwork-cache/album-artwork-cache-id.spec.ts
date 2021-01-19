import * as assert from 'assert';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

describe('AlbumArtworkCacheId', () => {
    let albumArtworkCacheId: AlbumArtworkCacheId;

    beforeEach(() => {
        albumArtworkCacheId = new AlbumArtworkCacheId();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(albumArtworkCacheId);
        });

        it('should create an identifier which is not null or undefined', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(albumArtworkCacheId.id);
        });

        it('should create an identifier which starts with album-', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(albumArtworkCacheId.id.startsWith('album-'));
        });

        it('should create an identifier which has a length of 42 characters', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(albumArtworkCacheId.id.length, 42);
        });

        it('should create unique identifiers', () => {
            // Arrange

            // Act
            const albumArtworkCacheId2: AlbumArtworkCacheId = new AlbumArtworkCacheId();

            // Assert
            assert.notStrictEqual(albumArtworkCacheId.id, albumArtworkCacheId2.id);
        });
    });
});
