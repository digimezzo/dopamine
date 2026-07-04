import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { ArtistArtworkRemover } from './artist-artwork-remover';
import { ArtistArtworkRepositoryBase } from '../../data/repositories/artist-artwork-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ArtistArtwork } from '../../data/entities/artist-artwork';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { ApplicationPaths } from '../../common/application/application-paths';


const artistKey1 = 'artistKey1';
const artistKey2 = 'artistKey2';
const artworkId1 = 'artworkId1';
const artworkId2 = 'artworkId2';
const artwork1FileNameWithoutExtension = `artist-${artworkId1}`;
const artwork2FileNameWithoutExtension = `artist-${artworkId2}`;
const artistArtCachePath = '/home/user/.config/Dopamine/Cache/ArtistArt';
const artwork1Path = `${artistArtCachePath}/${artwork1FileNameWithoutExtension}.jpg`;
const artwork2Path = `${artistArtCachePath}/${artwork2FileNameWithoutExtension}.jpg`;

describe('ArtistArtworkRemover', () => {
    let artistArtworkRepositoryMock: IMock<ArtistArtworkRepositoryBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let loggerMock: IMock<Logger>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let artistArtworkRemover: ArtistArtworkRemover;

    beforeEach(() => {
        artistArtworkRepositoryMock = Mock.ofType<ArtistArtworkRepositoryBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        loggerMock = Mock.ofType<Logger>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();

        artistArtworkRemover = new ArtistArtworkRemover(
            artistArtworkRepositoryMock.object,
            fileAccessMock.object,
            applicationPathsMock.object,
            notificationServiceMock.object,
            loggerMock.object,
        );

        applicationPathsMock
            .setup((x) => x.artistArtCacheFullPath())
            .returns(() => artistArtCachePath);
        fileAccessMock
            .setup((x) => x.getFileNameWithoutExtension(artwork1Path))
            .returns(() => artwork1FileNameWithoutExtension);
        fileAccessMock
            .setup((x) => x.getFileNameWithoutExtension(artwork2Path))
            .returns(() => artwork2FileNameWithoutExtension);
    });

    describe('removeArtistArtworkThatHasNoTrackAsync', () => {
        it('should get the number of artist artwork that has no track from the database', async () => {
            // Arrange

            // Act
            await artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.getNumberOfArtistArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should notify that artist artwork is being updated, if there is artist artwork that has no track.', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getNumberOfArtistArtworkThatHasNoTrack())
                .returns(() => 2);

            // Act
            await artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that artist artwork is being updated, if there is no artist artwork that has no track.', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getNumberOfArtistArtworkThatHasNoTrack())
                .returns(() => 0);

            // Act
            await artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.never());
        });

        it('should delete artist artwork that has no track from the database', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getNumberOfArtistArtworkThatHasNoTrack())
                .returns(() => 2);

            // Act
            await artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.deleteArtistArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should not delete artist artwork that has no track from the database if there is none', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getNumberOfArtistArtworkThatHasNoTrack())
                .returns(() => 0);

            // Act
            await artistArtworkRemover.removeArtistArtworkThatHasNoTrackAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.deleteArtistArtworkThatHasNoTrack(), Times.never());
        });
    });

    describe('removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync', () => {
        it('should get all artist artwork in the database', async () => {
            // Arrange

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.getAllArtistArtwork(), Times.exactly(1));
        });

        it('should get all artwork files which are in the artist art cache path', async () => {
            // Arrange

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.getFilesInDirectoryAsync(artistArtCachePath), Times.exactly(1));
        });

        it('should not notify that artwork is being updated if there are no artwork files on disk', async () => {
            // Arrange
            const artistArtwork1: ArtistArtwork = new ArtistArtwork(artistKey1, artworkId1);
            const artistArtwork2: ArtistArtwork = new ArtistArtwork(artistKey2, artworkId2);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [artistArtwork1, artistArtwork2]);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(() => Promise.resolve([]));

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.never());
        });

        it('should not notify that artwork is being updated if there are artwork files on disk but they are all found in the database', async () => {
            // Arrange
            const artistArtwork1: ArtistArtwork = new ArtistArtwork(artistKey1, artwork1FileNameWithoutExtension);
            const artistArtwork2: ArtistArtwork = new ArtistArtwork(artistKey2, artwork2FileNameWithoutExtension);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [artistArtwork1, artistArtwork2]);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(() =>
                    Promise.resolve([
                        artwork1Path,
                        artwork2Path,
                    ]),
                );

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.never());
        });

        it('should notify exactly once that artwork is being updated if there are artwork files on disk which are not found in the database', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(() => Promise.resolve([artwork1Path, artwork2Path]));

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.exactly(1));
        });

        it('should not delete any artwork files if none are found on disk', async () => {
            // Arrange
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(() => Promise.resolve([]));

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify((x) => x.deleteFileIfExistsAsync(It.isAny()), Times.never());
        });

        it('should delete artwork files if artwork is not found in the database', async () => {
            // Arrange
            const artistArtwork1: ArtistArtwork = new ArtistArtwork(artistKey1, artwork1FileNameWithoutExtension);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [artistArtwork1]);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(() => Promise.resolve([artwork1Path, artwork2Path]));

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify(
                (x) => x.deleteFileIfExistsAsync(artwork2Path),
                Times.exactly(1),
            );
        });

        it('should not delete artwork files if artwork is found in the database', async () => {
            // Arrange
            const artistArtwork1: ArtistArtwork = new ArtistArtwork(artistKey1, artwork1FileNameWithoutExtension);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [artistArtwork1]);
            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync(artistArtCachePath))
                .returns(async () => Promise.resolve([artwork1Path, artwork2Path]),);

            // Act
            await artistArtworkRemover.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync();

            // Assert
            fileAccessMock.verify(
                (x) => x.deleteFileIfExistsAsync(artwork1Path),
                Times.never(),
            );
        });
    });

    describe('removeArtistArtworkWithDefaultIdAsync', () => {
        it('should delete artist artwork from database that has default cache id', () => {
            // Arrange, Act
            artistArtworkRemover.removeArtistArtworkWithDefaultIdAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.deleteArtistArtworkWithDefaultId(), Times.once());
        });
    });

    describe('removeAllArtistArtworkAsync', () => {
        it('should delete all artist artwork from database', () => {
            // Arrange, Act
            artistArtworkRemover.removeAllArtistArtworkAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.deleteAllArtistArtwork(), Times.once());
        });
    });
});
