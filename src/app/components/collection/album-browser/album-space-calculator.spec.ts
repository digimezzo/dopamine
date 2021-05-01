import { AlbumSpaceCalculator } from './album-space-calculator';

describe('AlbumSpaceCalculator', () => {
    let albumSpaceCalculator: AlbumSpaceCalculator;

    beforeEach(() => {
        albumSpaceCalculator = new AlbumSpaceCalculator();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumSpaceCalculator).toBeDefined();
        });
    });

    describe('calculateNumberOfAlbumsPerRow', () => {
        it('should return 0 when albumWidth is undefined', () => {
            // Arrange
            const albumWidth: number = undefined;
            const availableWidth: number = 800;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidth is 0', () => {
            // Arrange
            const albumWidth: number = 0;
            const availableWidth: number = 800;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is undefined', () => {
            // Arrange
            const albumWidth: number = 120;
            const availableWidth: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is 0', () => {
            // Arrange
            const albumWidth: number = 120;
            const availableWidth: number = 0;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidth is undefined and availableWidth is 0', () => {
            // Arrange
            const albumWidth: number = undefined;
            const availableWidth: number = 0;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidth is 0 and availableWidth is undefined', () => {
            // Arrange
            const albumWidth: number = 0;
            const availableWidth: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidth and availableWidth are both undefined', () => {
            // Arrange
            const albumWidth: number = undefined;
            const availableWidth: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidth and availableWidth are both 0', () => {
            // Arrange
            const albumWidth: number = 0;
            const availableWidth: number = 0;

            // Act458
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth equals albumWidth', () => {
            // Arrange
            const albumWidth: number = 120;
            const availableWidth: number = 120;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is smaller than albumWidth', () => {
            // Arrange
            const albumWidth: number = 120;
            const availableWidth: number = 80;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return the number of albums that can fit in a row if availableWidth is larger than albumWidth plus additional margins', () => {
            // Arrange
            const albumWidth: number = 120;
            const availableWidth: number = 430;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(3);
        });
    });
});
