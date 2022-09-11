import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { Metadata } from '../../common/metadata/metadata';
import { EmbeddedAlbumArtworkGetter } from './embedded-album-artwork-getter';

describe('EmbeddedAlbumArtworkGetter', () => {
    describe('getEmbeddedArtwork', () => {
        it('should return null if fileMetaData is undefined', () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock.object);

            // Act
            const actualArtwork: Buffer = embeddedAlbumArtworkGetter.getEmbeddedArtwork(undefined);

            // Assert
            expect(actualArtwork).toBeUndefined();
        });

        it('should return embedded artwork if fileMetaData is not undefined', () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const metaDataMock: IMock<Metadata> = Mock.ofType<Metadata>();
            const embeddedAlbumArtworkGetter: EmbeddedAlbumArtworkGetter = new EmbeddedAlbumArtworkGetter(loggerMock.object);

            const expectedArtwork = Buffer.from([1, 2, 3]);
            metaDataMock.setup((x) => x.picture).returns(() => expectedArtwork);

            // Act
            const actualArtwork: Buffer = embeddedAlbumArtworkGetter.getEmbeddedArtwork(metaDataMock.object);

            // Assert
            expect(actualArtwork).toEqual(expectedArtwork);
        });
    });
});
