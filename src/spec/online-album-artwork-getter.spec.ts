import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileMetadata } from '../app/metadata/file-metadata';
import { OnlineAlbumArtworkGetterMocker } from './mocking/online-album-artwork-getter-mocker';

describe('OnlineAlbumArtworkGetter', () => {
    describe('getOnlineArtworkAsync', () => {
        it('Should return artwork data if fileMetaData has titles and artists', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return null if converting file to data throws error', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, true);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });

        it('Should return null if getting online album info throws error', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, true, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });

        it('Should return artwork data if fileMetaData has artists, has no track title but has an album title.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => undefined);
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork data if fileMetaData has artists, has a track title but has no album title.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => null);
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return null if fileMetaData has artists, has no track title and no album title.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => null);
            fileMetaDataMock.setup(x => x.title).returns(() => undefined);
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });

        it('Should return artwork data if fileMetaData has titles, has track artists and has album artists.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork data if fileMetaData has titles, has track artists but has no album artists.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => ['Artist 1', 'Artist 2']);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => null);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return artwork data if fileMetaData has titles, has no track artists but has album artists.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => []);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('Should return null if fileMetaData has titles, but has no artists.', async () => {
            // Arrange
            const expectedAlbumArtwork: Buffer = Buffer.from([1, 2, 3]);
            const mocker: OnlineAlbumArtworkGetterMocker = new OnlineAlbumArtworkGetterMocker(expectedAlbumArtwork, false, false);

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetaDataMock.setup(x => x.album).returns(() => 'My album title');
            fileMetaDataMock.setup(x => x.title).returns(() => 'My track title');
            fileMetaDataMock.setup(x => x.artists).returns(() => []);
            fileMetaDataMock.setup(x => x.albumArtists).returns(() => null);

            // Act
            const actualAlbumArtwork: Buffer = await mocker.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, null);
        });
    });
});
