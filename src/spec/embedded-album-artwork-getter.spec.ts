import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { Logger } from '../app/core/logger';
import { FileMetadata } from '../app/metadata/file-metadata';
import { EmbeddedAlbumArtworkGetter } from '../app/services/indexing/embedded-album-artwork-getter';

describe('EmbeddedAlbumArtworkGetter', () => {
    describe('getEmbeddedArtwork', () => {
        it('Should return null if fileMetaData is null', () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock.object);

            // Act
            const actualArtwork: Buffer = embeddedAlbumArtworkGetter.getEmbeddedArtwork(null);

            // Assert
            assert.strictEqual(actualArtwork, null);
        });

        it('Should return null if fileMetaData is undefined', () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock.object);

            // Act
            const actualArtwork: Buffer = embeddedAlbumArtworkGetter.getEmbeddedArtwork(undefined);

            // Assert
            assert.strictEqual(actualArtwork, null);
        });

        it('Should return embedded artwork if fileMetaData is not null or undefined', () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock.object);

            const expectedArtwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.setup(x => x.picture).returns(() => expectedArtwork);

            // Act
            const actualArtwork: Buffer = embeddedAlbumArtworkGetter.getEmbeddedArtwork(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualArtwork, expectedArtwork);
        });
    });
});
