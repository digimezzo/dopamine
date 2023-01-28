import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumArtwork } from '../../common/data/entities/album-artwork';
import { BaseAlbumArtworkRepository } from '../../common/data/repositories/base-album-artwork-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { AlbumArtworkRemover } from './album-artwork-remover';

describe('AlbumArtworkRemover', () => {
    let albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository>;
    let fileAccessMock: IMock<BaseFileAccess>;
    let loggerMock: IMock<Logger>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let albumArtworkRemover: AlbumArtworkRemover;

    beforeEach(() => {
        albumArtworkRepositoryMock = Mock.ofType<BaseAlbumArtworkRepository>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        albumArtworkRemover = new AlbumArtworkRemover(
            albumArtworkRepositoryMock.object,
            fileAccessMock.object,
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
            fileAccessMock.setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')).returns(async () => []);

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
                .returns(async () => [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ]);
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
                .returns(async () => [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ]);
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
            fileAccessMock.setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')).returns(async () => []);

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
                .returns(async () => [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ]);
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
                Times.exactly(1)
            );
        });

        it('should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            albumArtworkRepositoryMock.setup((x) => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            fileAccessMock.setup((x) => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'))
                .returns(async () => [
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                    '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
                ]);
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
                Times.never()
            );
        });
    });
});
