import { IMock, It, Mock } from 'typemoq';
import { LastfmAlbum } from '../../core/api/lastfm/lastfm-album';
import { LastfmApi } from '../../core/api/lastfm/lastfm-api';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { FileMetadata } from '../../metadata/file-metadata';
import { OnlineAlbumArtworkGetter } from './online-album-artwork-getter';

describe('OnlineAlbumArtworkGetter', () => {
    let imageProcessorMock: IMock<ImageProcessor>;
    let lastfmApiMock: IMock<LastfmApi>;
    let loggerMock: IMock<Logger>;

    let onlineAlbumArtworkGetter: OnlineAlbumArtworkGetter;

    let lastfmAlbum: LastfmAlbum;

    beforeEach(() => {
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        loggerMock = Mock.ofType<Logger>();

        onlineAlbumArtworkGetter = new OnlineAlbumArtworkGetter(imageProcessorMock.object, lastfmApiMock.object, loggerMock.object);

        lastfmAlbum = new LastfmAlbum();
        lastfmAlbum.imageMega = 'http://images.com/image.png';
    });

    describe('getOnlineArtworkAsync', () => {
        it('should return undefined if fileMetaData is undefined', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(undefined);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined if fileMetaData has artists but no titles', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.title).returns(() => '');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return artwork if fileMetaData has artists and titles', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has artists and only a track title', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has artists and only an album title', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has titles and only album artists', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return artwork if fileMetaData has titles and only track artists', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => undefined);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBe(expectedAlbumArtwork);
        });

        it('should return undefined if converting file to data throws error', async () => {
            // Arrange
            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .returns(async () => lastfmAlbum);

            imageProcessorMock.setup((x) => x.convertOnlineImageToBufferAsync(It.isAnyString())).throws(new Error('An error occurred'));

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });

        it('should return undefined if getting online album info throws error', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);

            lastfmApiMock
                .setup((x) => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN'))
                .throws(new Error('An error occurred'));

            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('http://images.com/image.png'))
                .returns(async () => expectedAlbumArtwork);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            expect(actualAlbumArtwork).toBeUndefined();
        });
    });
});
