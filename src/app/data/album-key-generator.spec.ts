import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { AlbumKeyGenerator } from './album-key-generator';
import { DataDelimiter } from './data-delimiter';

describe('AlbumKeyGenerator', () => {
    describe('generateAlbumKey', () => {
        it('should generate an empty album key if album title is undefined', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey(undefined, ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('should generate an empty album key if album title is empty', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('should generate an empty album key if album title is a space', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey(' ', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('should generate an empty album key if album title is a multiple spaces', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('    ', ['Artist 1', 'Artist 2']);

            // Assert
            assert.strictEqual(albumKey, '');
        });

        it('should generate an album key using only the album title if album artists is undefined', () => {
            // Arrange
            const dataDelimiter: DataDelimiter = new DataDelimiter();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiter);

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', undefined);

            // Assert
            assert.strictEqual(albumKey, ';The album title;');
        });

        it('should generate an album key using only the album title if album artists is empty', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            dataDelimiterMock.setup((x) => x.convertToDelimitedString(['The album title'])).returns(() => ';The album title;');

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', []);

            // Assert
            dataDelimiterMock.verify((x) => x.convertToDelimitedString(['The album title']), Times.exactly(1));
            assert.strictEqual(albumKey, ';The album title;');
        });

        it('should generate an album key using album title and album artist given an album title and 1 album artist', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            dataDelimiterMock
                .setup((x) => x.convertToDelimitedString(['The album title', 'Album artist 1']))
                .returns(() => ';The album title;;Album artist 1;');

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1']);

            // Assert
            dataDelimiterMock.verify((x) => x.convertToDelimitedString(['The album title', 'Album artist 1']), Times.exactly(1));
            assert.strictEqual(albumKey, ';The album title;;Album artist 1;');
        });

        it('should generate an album key using album title and album artists given an album title and multiple album artists', () => {
            // Arrange
            const dataDelimiterMock: IMock<DataDelimiter> = Mock.ofType<DataDelimiter>();
            const albumkeyGenerator: AlbumKeyGenerator = new AlbumKeyGenerator(dataDelimiterMock.object);

            dataDelimiterMock
                .setup((x) => x.convertToDelimitedString(['The album title', 'Album artist 1', 'Album artist 2']))
                .returns(() => ';The album title;;Album artist 1;;Album artist 2;');

            // Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1', 'Album artist 2']);

            // Assert
            dataDelimiterMock.verify(
                (x) => x.convertToDelimitedString(['The album title', 'Album artist 1', 'Album artist 2']),
                Times.exactly(1)
            );
            assert.strictEqual(albumKey, ';The album title;;Album artist 1;;Album artist 2;');
        });
    });
});
