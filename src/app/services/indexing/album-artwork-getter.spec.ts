import { IMock, It, Mock } from 'typemoq';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { AlbumArtworkGetter } from './album-artwork-getter';
import { EmbeddedAlbumArtworkGetter } from './embedded-album-artwork-getter';
import { ExternalAlbumArtworkGetter } from './external-album-artwork-getter';
import { OnlineAlbumArtworkGetter } from './online-album-artwork-getter';

describe('AlbumArtworkGetter', () => {
    let embeddedAlbumArtworkGetterMock: IMock<EmbeddedAlbumArtworkGetter>;
    let externalAlbumArtworkGetterMock: IMock<ExternalAlbumArtworkGetter>;
    let onlineAlbumArtworkGetterMock: IMock<OnlineAlbumArtworkGetter>;
    let settingsStub: any;
    let albumArtworkGetter: AlbumArtworkGetter;

    beforeEach(() => {
        embeddedAlbumArtworkGetterMock = Mock.ofType<EmbeddedAlbumArtworkGetter>();
        externalAlbumArtworkGetterMock = Mock.ofType<ExternalAlbumArtworkGetter>();
        onlineAlbumArtworkGetterMock = Mock.ofType<OnlineAlbumArtworkGetter>();
        settingsStub = { downloadMissingAlbumCovers: true };
        albumArtworkGetter = new AlbumArtworkGetter(
            embeddedAlbumArtworkGetterMock.object,
            externalAlbumArtworkGetterMock.object,
            onlineAlbumArtworkGetterMock.object,
            settingsStub
        );
    });

    describe('getAlbumArtwork', () => {
        it('should return undefined when fileMetaData is undefined', async () => {
            // Arrange

            // Act
            const albumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(undefined, true);

            // Assert
            expect(albumArtwork).toBeUndefined();
        });

        it('should return embedded artwork when there is embedded artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return external artwork when there is no embedded artwork but there is external artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return online artwork when settings require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is true', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, true);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return online artwork when settings require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is false', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, false);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when settings do not require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is true', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = false;

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, true);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when settings do not require downloading missing covers when there is no embedded and no external artwork but there is online artwork and getOnlineArtwork is false', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, false);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined when there is no embedded and no external and no online artwork', async () => {
            // Arrange
            const metaDataMock: IMock<IFileMetadata> = Mock.ofType<IFileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => undefined);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(metaDataMock.object, true);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });
    });
});
