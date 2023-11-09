import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { AlbumArtworkRemover } from './album-artwork-remover';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { AlbumArtwork } from '../../data/entities/album-artwork';

describe('AlbumArtworkRemover', () => {
    let albumArtworkRepositoryMock: IMock<AlbumArtworkRepositoryBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let loggerMock: IMock<Logger>;
    let snackBarServiceMock: IMock<SnackBarServiceBase>;
    let albumArtworkRemover: AlbumArtworkRemover;

    beforeEach(() => {
        albumArtworkRepositoryMock = Mock.ofType<AlbumArtworkRepositoryBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<SnackBarServiceBase>();
        albumArtworkRemover = new AlbumArtworkRemover(
            albumArtworkRepositoryMock.object,
            fileAccessMock.object,
            snackBarServiceMock.object,
            loggerMock.object,
        );
    });

    describe('removeAlbumArtworkThatHasNoTrackAsync', () => {
        it('should get the number of album artwork that has no track from the database', async () => {
            // Arrange

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.getNumberOfAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should notify that album artwork is being updated, if there is album artwork that has no track.', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that album artwork is being updated, if there is no album artwork that has no track.', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should delete album artwork that has no track from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should not delete album artwork that has no track from the database if there is none', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatHasNoTrackAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkThatHasNoTrack(), Times.never());
        });
    });

    describe('removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync', () => {
        it('should get the number of album artwork for tracks that need album artwork indexing from the database', async () => {
            // Arrange

            // Act
            await albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('should notify that album artwork is being updated, if there are tracks that need album artwork indexing.', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            await albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that album artwork is being updated, if there are no tracks that need album artwork indexing.', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            await albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should delete album artwork for tracks that need album artwork indexing from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            await albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('should not delete album artwork if there are no tracks that need album artwork indexing from the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            await albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.never());
        });
    });

    describe('removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync', () => {
        it('should get all album artwork in the database', async () => {
            // Arrange

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.getAllAlbumArtwork(), Times.exactly(1));
        });

        it('should get all artwork files which are in the cover art cache path', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'artworkId2');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'), Times.exactly(1));
        });

        it('should not notify that artwork is being updated if there are no artwork files on disk', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'artworkId2');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(() => Promise.resolve([]));

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should not notify that artwork is being updated if there are artwork files on disk but they are all found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'album-artworkId2');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(() =>
                    Promise.resolve([
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                    ]),
                );
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should notify exactly once that artwork is being updated if there are artwork files on disk which are not found in the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => []);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(() =>
                    Promise.resolve([
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                    ]),
                );
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not delete any artwork files if none are found on disk', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => []);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(() => Promise.resolve([]));

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.deleteFileIfExistsAsync(It.isAny()), Times.never());
        });

        it('should delete artwork files if artwork is not found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(() =>
                    Promise.resolve([
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                    ]),
                );
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify(
                (x) => x.deleteFileIfExistsAsync('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'),
                Times.exactly(1),
            );
        });

        it('should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(async () =>
                    Promise.resolve([
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                        '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                    ]),
                );
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileAccessMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify(
                (x) => x.deleteFileIfExistsAsync('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'),
                Times.never(),
            );
        });
    });
});
