const { FileAccessMock } = require('../mocks/file-access-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { WorkerProxyMock } = require('../mocks/worker-proxy-mock');
const { AlbumArtworkRepositoryMock } = require('../mocks/album-artwork-repository-mock');
const { ApplicationPathsMock } = require('../mocks/application-paths-mock');
const { AlbumArtworkRemover } = require('./album-artwork-remover');
const { AlbumArtwork } = require('../data/entities/album-artwork');

describe('AlbumArtworkRemover', () => {
    let albumArtworkRepositoryMock;
    let applicationPathsMock;
    let workerProxyMock;
    let fileAccessMock;
    let loggerMock;

    beforeEach(() => {
        albumArtworkRepositoryMock = new AlbumArtworkRepositoryMock();
        applicationPathsMock = new ApplicationPathsMock();
        workerProxyMock = new WorkerProxyMock();
        fileAccessMock = new FileAccessMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new AlbumArtworkRemover(albumArtworkRepositoryMock, applicationPathsMock, workerProxyMock, fileAccessMock, loggerMock);
    }

    describe('removeAlbumArtworkThatHasNoTrackAsync', () => {
        it('should get the number of album artwork that has no track from the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            expect(albumArtworkRepositoryMock.getNumberOfAlbumArtworkThatHasNoTrackCalls).toBe(1);
        });

        it('should notify that album artwork is being updated, if there is album artwork that has no track.', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkThatHasNoTrackReturnValue = 2;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(1);
        });

        it('should not notify that album artwork is being updated, if there is no album artwork that has no track.', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkThatHasNoTrackReturnValue = 0;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(0);
        });

        it('should delete album artwork that has no track from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkThatHasNoTrackReturnValue = 2;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            expect(albumArtworkRepositoryMock.deleteAlbumArtworkThatHasNoTrackCalls).toBe(1);
        });

        it('should not delete album artwork that has no track from the database if there is none', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkThatHasNoTrackReturnValue = 0;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            expect(albumArtworkRepositoryMock.deleteAlbumArtworkThatHasNoTrackCalls).toBe(0);
        });
    });

    describe('removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync', () => {
        it('should get the number of album artwork for tracks that need album artwork indexing from the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkRepositoryMock.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls).toBe(1);
        });

        it('should notify that album artwork is being updated, if there are tracks that need album artwork indexing.', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 2;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(1);
        });

        it('should not notify that album artwork is being updated, if there are no tracks that need album artwork indexing.', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 0;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(0);
        });

        it('should delete album artwork for tracks that need album artwork indexing from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 2;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkRepositoryMock.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls).toBe(1);
        });

        it('should not delete album artwork if there are no tracks that need album artwork indexing from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingReturnValue = 0;

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            expect(albumArtworkRepositoryMock.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingCalls).toBe(0);
        });
    });

    describe('removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync', () => {
        it('should get all album artwork in the database', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(albumArtworkRepositoryMock.getAllAlbumArtworkCalls).toBe(1);
        });

        it('should get all artwork files which are in the cover art cache path', async () => {
            // Arrange
            const albumArtwork1 = new AlbumArtwork('albumKey1', 'album-artworkId1');
            const albumArtwork2 = new AlbumArtwork('albumKey2', 'album-artworkId2');
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [albumArtwork1, albumArtwork2];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(
                fileAccessMock.getFilesInDirectoryAsyncCalls.filter((x) => x === '/home/user/.config/Dopamine/Cache/CoverArt').length,
            ).toBe(1);
        });

        it('should not notify that artwork is being updated if there are no artwork files on disk', async () => {
            // Arrange
            const albumArtwork1 = new AlbumArtwork('albumKey1', 'album-artworkId1');
            const albumArtwork2 = new AlbumArtwork('albumKey2', 'album-artworkId2');
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [albumArtwork1, albumArtwork2];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = { '/home/user/.config/Dopamine/Cache/CoverArt': [] };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(0);
        });

        it('should not notify that artwork is being updated if there are artwork files on disk but they are all found in the database', async () => {
            // Arrange
            const albumArtwork1 = new AlbumArtwork('albumKey1', 'album-artworkId1');
            const albumArtwork2 = new AlbumArtwork('albumKey2', 'album-artworkId2');
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [albumArtwork1, albumArtwork2];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt': [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ],
            };

            fileAccessMock.getFileNameWithoutExtensionReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg': 'album-artworkId1',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg': 'album-artworkId2',
            };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(0);
        });

        it('should notify exactly once that artwork is being updated if there are artwork files on disk which are not found in the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt': [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ],
            };

            fileAccessMock.getFileNameWithoutExtensionReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg': 'album-artworkId1',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg': 'album-artworkId2',
            };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(workerProxyMock.postMessageCalls.length).toBe(1);
        });

        it('should not delete any artwork files if none are found on disk', async () => {
            // Arrange
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt': [],
            };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(fileAccessMock.deleteFileIfExistsAsyncCalls.length).toBe(0);
        });

        it('should delete artwork files if artwork is not found in the database', async () => {
            // Arrange
            const albumArtwork1 = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [albumArtwork1];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt': [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ],
            };

            fileAccessMock.getFileNameWithoutExtensionReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg': 'album-artworkId1',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg': 'album-artworkId2',
            };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(
                fileAccessMock.deleteFileIfExistsAsyncCalls.filter(
                    (x) => x === '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ).length,
            ).toBe(1);
        });

        it('should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const albumArtwork1 = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.getAllAlbumArtworkReturnValue = [albumArtwork1];
            applicationPathsMock.getCoverArtCacheFullPathReturnValue = '/home/user/.config/Dopamine/Cache/CoverArt';
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt': [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ],
            };

            fileAccessMock.getFileNameWithoutExtensionReturnValues = {
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg': 'album-artworkId1',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg': 'album-artworkId2',
            };

            const sut = createSut();

            // Act
            await sut.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            expect(
                fileAccessMock.deleteFileIfExistsAsyncCalls.filter(
                    (x) => x === '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                ).length,
            ).toBe(0);
        });
    });
});
