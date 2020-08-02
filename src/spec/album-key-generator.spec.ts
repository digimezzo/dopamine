import * as assert from 'assert';
import { AlbumkeyGenerator } from '../app/data/album-key-generator';

describe('AlbumKeyGenerator', () => {
    describe('generateAlbumKey', () => {
        it('Should generate an empty album key if album title is null', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey(null, ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('Should generate an empty album key if album title is undefined', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey(undefined, ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('Should generate an empty album key if album title is empty', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('Should generate an empty album key if album title is a space', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey(' ', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('Should generate an empty album key if album title is a multiple spaces', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('    ', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('Should generate an album key using only the album title if album artists is null', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('The album title', null);

            // Assert
            assert.strictEqual(albumKey, ';The album title;');
        });

        it('Should generate an album key using only the album title if album artists is undefined', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('The album title', undefined);

            // Assert
            assert.strictEqual(albumKey, ';The album title;');
        });

        it('Should generate an album key using only the album title if album artists is empty', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('The album title', []);

            // Assert
            assert.strictEqual(albumKey, ';The album title;');
        });

        it('Should generate an album key using album title and album artist given an album title and 1 album artist', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1']);

            // Assert
            assert.strictEqual(albumKey, ';The album title;;Album artist 1;');
        });

        it('Should generate an album key using album title and album artists given an album title and multiple album artists', () => {
            // Arrange
            // Act
            const albumKey: string = AlbumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1', 'Album artist 2']);

            // Assert
            assert.strictEqual(albumKey, ';The album title;;Album artist 1;;Album artist 2;');
        });
    });
});
