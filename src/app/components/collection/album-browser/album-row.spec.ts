import { AlbumRow } from './album-row';

describe('AlbumRow', () => {
    let albumRow: AlbumRow;

    beforeEach(() => {
        albumRow = new AlbumRow();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumRow).toBeDefined();
        });

        it('should define an empty list of albums', () => {
            // Arrange

            // Act

            // Assert
            expect(albumRow.albums).toBeDefined();
            expect(albumRow.albums.length).toEqual(0);
        });
    });
});
