const { AlbumArtworkIndexer } = require('./album-artwork-indexer');
const { AlbumArtworkRemoverMock } = require('../mocks/album-artwork-remover-mock');
const { AlbumArtworkAdderMock } = require('../mocks/album-artwork-adder-mock');
const { LoggerMock } = require('../mocks/logger-mock');

describe('AlbumArtworkIndexer', () => {
    let albumArtworkRemoverMock;
    let albumArtworkAdderMock;
    let loggerMock;

    beforeEach(() => {
        albumArtworkRemoverMock = new AlbumArtworkRemoverMock();
        albumArtworkAdderMock = new AlbumArtworkAdderMock();
        loggerMock = new LoggerMock();
    });

    function createSut() {
        return new AlbumArtworkIndexer(albumArtworkRemoverMock, albumArtworkAdderMock, loggerMock);
    }

    describe('indexAlbumArtworkAsync', () => {
        it('should remove artwork that has no track', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkThatHasNoTrackAsyncCalls.length).toEqual(1);
        });

        it('should remove artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls.length).toEqual(1);
        });

        it('should add artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkAdderMock.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsyncCalls.length).toEqual(1);
        });

        it('should remove artwork that is not in the database from disk', async () => {
            // Arrange
            const sut = createSut();

            // Act
            await sut.indexAlbumArtworkAsync();

            // Assert
            expect(albumArtworkRemoverMock.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsyncCalls.length).toEqual(1);
        });
    });
});
