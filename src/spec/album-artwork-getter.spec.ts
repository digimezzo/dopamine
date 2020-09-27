import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileMetadata } from '../app/metadata/file-metadata';
import { AlbumArtworkGetterMocker } from './mocking/album-artwork-getter-mocker';

describe('AlbumArtworkGetter', () => {
    describe('getAlbumArtwork', () => {
        it('Should return null if fileMetaData is null', async () => {
            // Arrange
            const mock: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            // Act
            const albumArtwork: Buffer = await mock.albumArtworkGetter.getAlbumArtworkAsync(null);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should return null if fileMetaData is undefined', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(undefined);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });

        it('Should return embedded artwork if fileMetaData is not null', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            const embeddedAlbumArtwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.setup(x => x.picture).returns(() => embeddedAlbumArtwork);

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(albumArtwork, embeddedAlbumArtwork);
        });

        it('Should return external artwork, if found, when no embedded artwork was found', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            const embeddedAlbumArtwork = Buffer.from([1, 2, 3]);
            fileMetaDataMock.setup(x => x.picture).returns(() => null);
            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/song.mp3');

            mocker.externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/song.mp3')
            ).returns(() => '/home/MyUser/Music/front.png');

            mocker.imageProcessorMock.setup(
                x => x.convertFileToDataAsync('/home/MyUser/Music/front.png')
                ).returns(async () => embeddedAlbumArtwork);

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(albumArtwork, embeddedAlbumArtwork);
        });

        it('Should not return external artwork, if none was found, when no embedded artwork was found', async () => {
            // Arrange
            const mocker: AlbumArtworkGetterMocker = new AlbumArtworkGetterMocker();
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            fileMetaDataMock.setup(x => x.picture).returns(() => null);
            fileMetaDataMock.setup(x => x.path).returns(() => '/home/MyUser/Music/song.mp3');

            mocker.externalArtworkPathGetterMock.setup(
                x => x.getExternalArtworkPath('/home/MyUser/Music/song.mp3')
            ).returns(() => '/home/MyUser/Music/front.png');

            mocker.imageProcessorMock.setup(
                x => x.convertFileToDataAsync('/home/MyUser/Music/front.png')
                ).returns(async () => null);

            // Act
            const albumArtwork: Buffer = await mocker.albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(albumArtwork, null);
        });
    });
});
