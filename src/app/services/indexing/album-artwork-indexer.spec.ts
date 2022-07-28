import { IMock, Mock, Times } from 'typemoq';
import { BaseAlbumArtworkRepository } from '../../common/data/repositories/base-album-artwork-repository';
import { TrackRepository } from '../../common/data/repositories/track-repository';
import { Logger } from '../../common/logger';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { AlbumArtworkRemover } from './album-artwork-remover';

describe('AlbumArtworkIndexer', () => {
    let trackRepositoryMock: IMock<TrackRepository>;
    let albumArtworkRepository: IMock<BaseAlbumArtworkRepository>;
    let albumArtworkRemoverMock: IMock<AlbumArtworkRemover>;
    let albumArtworkAdderMock: IMock<AlbumArtworkAdder>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let loggerMock: IMock<Logger>;
    let albumArtworkIndexer: AlbumArtworkIndexer;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepository>();
        albumArtworkRepository = Mock.ofType<BaseAlbumArtworkRepository>();
        albumArtworkRemoverMock = Mock.ofType<AlbumArtworkRemover>();
        albumArtworkAdderMock = Mock.ofType<AlbumArtworkAdder>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        loggerMock = Mock.ofType<Logger>();
        albumArtworkIndexer = new AlbumArtworkIndexer(
            albumArtworkRemoverMock.object,
            albumArtworkAdderMock.object,
            snackBarServiceMock.object,
            loggerMock.object
        );
    });

    describe('indexAlbumArtworkAsync', () => {
        it('should remove artwork that has no track', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatHasNoTrack(), Times.exactly(1));
        });

        it('should remove artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(), Times.exactly(1));
        });

        it('should add artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkAdderMock.verify((x) => x.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(), Times.exactly(1));
        });

        it('should remove artwork that is not in the database from disk', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.exactly(1));
        });

        it('should dismiss the indexing notification with a short delay', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });
    });
});
