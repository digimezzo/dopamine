// import { IMock, Mock, Times } from 'typemoq';
// import { Logger } from '../app/core/logger';
// import { BaseAlbumArtworkRepository } from '../app/data/repositories/base-album-artwork-repository';
// import { AlbumArtworkRemover } from '../app/services/indexing/album-artwork-remover';

import { It, Times } from 'typemoq';
import { AlbumArtwork } from '../app/data/entities/album-artwork';
import { AlbumArtworkRemoverMocker } from './mocking/album-artwork-remover-mocker';

describe('AlbumArtworkRemover', () => {
    describe('removeAlbumArtworkThatHasNoTrack', () => {
        it('Should get the number of album artwork that has no track from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.getNumberOfAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('Should notify that album artwork is being updated, if there is album artwork that has no track.', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should not notify that album artwork is being updated, if there is no album artwork that has no track.', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('Should delete album artwork that has no track from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 2);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('Should not delete album artwork that has no track from the database if there is none', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkThatHasNoTrack()).returns(() => 0);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkThatHasNoTrack();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkThatHasNoTrack(), Times.never());
        });
    });

    describe('removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing', () => {
        it('Should get the number of album artwork for tracks that need album artwork indexing from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(
                x => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(),
                Times.exactly(1));
        });

        it('Should notify that album artwork is being updated, if there are tracks that need album artwork indexing.', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should not notify that album artwork is being updated, if there are no tracks that need album artwork indexing.', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('Should delete album artwork for tracks that need album artwork indexing from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 2);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('Should not delete album artwork if there are no tracks that need album artwork indexing from the database', () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing()).returns(() => 0);

            // Act
            mocker.albumArtworkRemover.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.never());
        });
    });

    describe('removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync', () => {
        it('Should get all album artwork in the database', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.albumArtworkRepositoryMock.verify(x => x.getAllAlbumArtwork(), Times.exactly(1));
        });

        it('Should get all artwork files which are in the cover art cache path', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'artworkId2');
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt'), Times.exactly(1));
        });

        it('Should not notify that artwork is being updated if there are no artwork files on disk', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'artworkId2');
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => []);

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('Should not notify that artwork is being updated if there are artwork files on disk but they are all found in the database', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            const albumArtwork2: AlbumArtwork = new AlbumArtwork('albumKey2', 'album-artworkId2');
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => [albumArtwork1, albumArtwork2]);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => [
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
            ]);
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg')
            ).returns(() => 'album-artworkId1');
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg')
            ).returns(() => 'album-artworkId2');

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('Should notify exactly once that artwork is being updated if there are artwork files on disk which are not found in the database', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => []);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => [
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
            ]);
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg')
            ).returns(() => 'album-artworkId1');
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg')
            ).returns(() => 'album-artworkId2');

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.snackBarServiceMock.verify(x => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('Should not delete any artwork files if none are found on disk', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => []);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => []);

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(x => x.deleteFileIfExistsAsync(It.isAny()), Times.never());
        });

        it('Should delete artwork files if artwork is not found in the database', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => [
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
            ]);
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg')
            ).returns(() => 'album-artworkId1');
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg')
            ).returns(() => 'album-artworkId2');

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(
                x => x.deleteFileIfExistsAsync('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg'
                ), Times.exactly(1));
        });

        it('Should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const mocker: AlbumArtworkRemoverMocker = new AlbumArtworkRemoverMocker();
            const albumArtwork1: AlbumArtwork = new AlbumArtwork('albumKey1', 'album-artworkId1');
            mocker.albumArtworkRepositoryMock.setup(x => x.getAllAlbumArtwork()).returns(() => [albumArtwork1]);
            mocker.fileSystemMock.setup(x => x.coverArtCacheFullPath()).returns(() => '/home/user/.config/Dopamine/Cache/CoverArt');
            mocker.fileSystemMock.setup(
                x => x.getFilesInDirectoryAsync('/home/user/.config/Dopamine/Cache/CoverArt')
            ).returns(async () => [
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg',
                '/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg',
            ]);
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg')
            ).returns(() => 'album-artworkId1');
            mocker.fileSystemMock.setup(
                x => x.getFileNameWithoutExtension('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId2.jpg')
            ).returns(() => 'album-artworkId2');

            // Act
            await mocker.albumArtworkRemover.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            mocker.fileSystemMock.verify(
                x => x.deleteFileIfExistsAsync('/home/user/.config/Dopamine/Cache/CoverArt/album-artworkId1.jpg'
                ), Times.never());
        });
    });
});
