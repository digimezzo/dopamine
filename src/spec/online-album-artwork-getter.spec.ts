import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileMetadata } from '../app/metadata/file-metadata';
import { OnlineAlbumArtworkGetterMocker } from './mocking/online-album-artwork-getter-mocker';

describe('OnlineAlbumArtworkGetter', () => {
    describe('getOnlineArtworkAsync', () => {
        it('Should return undefined if fileMetaData is undefined', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(undefined);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });

        it('Should return undefined if fileMetaData has artists but no titles', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.title).returns(() => '');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });

        it('Should return artwork if fileMetaData has artists and titles', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork if fileMetaData has artists and only a track title', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork if fileMetaData has artists and only an album title', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork if fileMetaData has titles and only album artists', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => undefined);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork if fileMetaData has titles and only track artists', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => undefined);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return undefined if converting file to data throws error', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, true);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });

        it('Should return undefined if getting online album info throws error', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, true, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup((x) => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup((x) => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup((x) => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup((x) => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });
    });
});
