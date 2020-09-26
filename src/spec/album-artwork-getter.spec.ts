import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { FileMetadata } from '../app/metadata/file-metadata';
import { AlbumArtworkGetter } from '../app/services/indexing/album-artwork-getter';

describe('AlbumArtworkGetter', () => {
    describe('getAlbumArtwork', () => {
        it('Should return null if fileMetaData is null', async () => {
            // Arrange
            const albumArtworkGetter: AlbumArtworkGetter = new AlbumArtworkGetter();

            // Act
            const albumArtwork: Buffer = albumArtworkGetter.getAlbumArtwork(null);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should return null if fileMetaData is undefined', async () => {
            // Arrange
            const albumArtworkGetter: AlbumArtworkGetter = new AlbumArtworkGetter();

            // Act
            const albumArtwork: Buffer = albumArtworkGetter.getAlbumArtwork(undefined);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should try to get embedded artwork if fileMetaData is not null', async () => {
            // Arrange
            const albumArtworkGetter: AlbumArtworkGetter = new AlbumArtworkGetter();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            // Act
            const albumArtwork: Buffer = albumArtworkGetter.getAlbumArtwork(fileMetaDataMock.object);

            // Assert
            fileMetaDataMock.verify(x => x.picture, Times.exactly(1));
        });

        it('Should return embedded artwork if embedded artwork is not null', async () => {
            // Arrange
            const albumArtworkGetter: AlbumArtworkGetter = new AlbumArtworkGetter();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            const embeddedAlbumArtwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.setup(x => x.picture).returns(() => embeddedAlbumArtwork);

            // Act
            const albumArtwork: Buffer = albumArtworkGetter.getAlbumArtwork(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(albumArtwork, embeddedAlbumArtwork);
        });

        it('Should return null if embedded artwork is null', async () => {
            // Arrange
            const albumArtworkGetter: AlbumArtworkGetter = new AlbumArtworkGetter();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            fileMetaDataMock.setup(x => x.picture).returns(() => null);

            // Act
            const albumArtwork: Buffer = albumArtworkGetter.getAlbumArtwork(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });
    });
});
