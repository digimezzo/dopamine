import { IMock, It, Mock, Times } from 'typemoq';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../data/repositories/base-album-artwork-repository';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { AlbumArtworkRemover } from './album-artwork-remover';

describe('AlbumArtworkRemover', () => {
    let albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository>;
    let fileSystemMock: IMock<FileSystem>;
    let loggerMock: IMock<Logger>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let albumArtworkRemover: AlbumArtworkRemover;

    beforeEach(() => {
        albumArtworkRepositoryMock = Mock.ofType<BaseAlbumArtworkRepository>();
        fileSystemMock = Mock.ofType<FileSystem>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        albumArtworkRemover = new AlbumArtworkRemover(
            albumArtworkRepositoryMock.object,
            fileSystemMock.object,
            snackBarServiceMock.object,
            loggerMock.object
        );
    });

    describe('removeAlbumArtworkThatHasNoTrack', () => {
        it('should get the number of album artwork that has no track from the database', () => {
            // Arrange

            // Act
            albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.getNumberOfAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should notify that album artwork is being updated, if there is album artwork that has no track.', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that album artwork is being updated, if there is no album artwork that has no track.', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should delete album artwork that has no track from the database', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should not delete album artwork that has no track from the database if there is none', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkThatHasNoTrack(), Times.never());
        });
    });

    describe('removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing', () => {
        it('should get the number of album artwork for tracks that need album artwork indexing from the database', () => {
            // Arrange

            // Act
            albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('should notify that album artwork is being updated, if there are tracks that need album artwork indexing.', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that album artwork is being updated, if there are no tracks that need album artwork indexing.', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should delete album artwork for tracks that need album artwork indexing from the database', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('should not delete album artwork if there are no tracks that need album artwork indexing from the database', () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

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
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileSystemMock.verify((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt'), Times.exactly(1));
        });

        it('should not notify that artwork is being updated if there are no artwork files on disk', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'artworkId2');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock.setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt')).returns(async () => []);

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
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt'))
                .returns(async () => [
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg',
                ]);
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should notify exactly once that artwork is being updated if there are artwork files on disk which are not found in the database', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => []);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt'))
                .returns(async () => [
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg',
                ]);
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not delete any artwork files if none are found on disk', async () => {
            // Arrange
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => []);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock.setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt')).returns(async () => []);

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileSystemMock.verify((x) => x.deleteFileIfExistsAsync(It.isAny()), Times.never());
        });

        it('should delete artwork files if artwork is not found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt'))
                .returns(async () => [
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg',
                ]);
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileSystemMock.verify(
                (x) => x.deleteFileIfExistsAsync('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg'),
                Times.exactly(1)
            );
        });

        it('should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            fileSystemMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/dopameme/Cache/CoverArt');
            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/dopameme/Cache/CoverArt'))
                .returns(async () => [
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg',
                ]);
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg'))
                .returns(() => 'album-artworkId1');
            fileSystemMock
                .setup((x) => x.getFileNameWithoutExtension('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId2.jpg'))
                .returns(() => 'album-artworkId2');

            // Act
            await albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileSystemMock.verify(
                (x) => x.deleteFileIfExistsAsync('/home/user/.config/dopameme/Cache/CoverArt/album-artworkId1.jpg'),
                Times.never()
            );
        });
    });
});
