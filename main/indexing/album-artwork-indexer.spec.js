const { AlbumArtworkIndexer } = require('./album-artwork-indexer');
const sinon = require('sinon');

describe('AlbumArtworkIndexer', () => {
    let albumArtworkRemoverMock;
    let albumArtworkAdderMock;
    let loggerMock;

    beforeEach(() => {
        albumArtworkRemoverMock = {
            removeAlbumArtworkThatHasNoTrackAsync: sinon.stub().resolves(),
            removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync: sinon.stub().resolves(),
            removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync: sinon.stub().resolves(),
        };

        albumArtworkAdderMock = {
            addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync: sinon.stub().resolves(),
        };

        loggerMock = {
            info: sinon.stub().resolves(),
            warn: sinon.stub().resolves(),
            error: sinon.stub().resolves(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    function createSut() {
        return new AlbumArtworkIndexer(albumArtworkRemoverMock, albumArtworkAdderMock, loggerMock);
    }

    describe('indexAlbumArtworkAsync', () => {
        it('should remove artwork that has no track', async () => {
            // Arrange
            const albumArtworkIndexer = createSut();

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkThatHasNoTrackAsync.calledOnce).toBeTruthy();
        });

        it('should remove artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const albumArtworkIndexer = createSut();

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync.calledOnce).toBeTruthy();
        });

        it('should add artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const albumArtworkIndexer = createSut();

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkAdderMock.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync.calledOnce).toBeTruthy();
        });

        it('should remove artwork that is not in the database from disk', async () => {
            // Arrange
            const albumArtworkIndexer = createSut();

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync.calledOnce).toBeTruthy();
        });
    });
});
