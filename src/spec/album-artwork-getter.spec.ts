import * as assert from 'assert';
import { IMock, It, Mock } from 'typemoq';
import { FileMetadata } from '../app/metadata/file-metadata';
import { AlbumArtworkGetterMocker } from './mocking/album-artwork-getter-mocker';

describe('AlbumArtworkGetter', () => {
    describe('getAlbumArtwork', () => {
        it('Should return null when fileMetaData is null', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(null);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should return null when fileMetaData is undefined', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(undefined);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should return embedded artwork when there is embedded artwork', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            mocker.embeddedAlbumArtworkGetterMock.setup(x => x.getEmbeddedArtwork(It.isAny())).returns(() => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return external artwork when there is no embedded artwork but there is external artwork', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            mocker.embeddedAlbumArtworkGetterMock.setup(x => x.getEmbeddedArtwork(It.isAny())).returns(() => null);
            mocker.externalAlbumArtworkGetterMock.setup(
                x => x.getExternalArtworkAsync(It.isAny())
            ).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return external artwork when there is no embedded artwork but there is external artwork', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            mocker.embeddedAlbumArtworkGetterMock.setup(x => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            mocker.externalAlbumArtworkGetterMock.setup(
                x => x.getExternalArtworkAsync(It.isAny())
            ).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return null when embedded artwork is null', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            mocker.embeddedAlbumArtworkGetterMock.setup(x => x.getEmbeddedArtwork(It.isAny())).returns(() => null);
            mocker.externalAlbumArtworkGetterMock.setup(x => x.getExternalArtworkAsync(It.isAny())).returns(async () => null);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });

        it('Should return null when embedded artwork is undefined', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            mocker.embeddedAlbumArtworkGetterMock.setup(x => x.getEmbeddedArtwork(It.isAny())).returns(() => null);
            mocker.externalAlbumArtworkGetterMock.setup(x => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });
    });
});
