import { IMock, Mock } from 'typemoq';
import { Desktop } from '../../core/io/desktop';
import { AlbumSpaceCalculator } from './album-space-calculator';

describe('AlbumSpaceCalculator', () => {
    let desktopMock: IMock<Desktop>;
    let albumSpaceCalculator: AlbumSpaceCalculator;

    beforeEach(() => {
        desktopMock = Mock.ofType<Desktop>();
        desktopMock.setup((x) => x.getWindowWidth()).returns(() => 655);

        albumSpaceCalculator = new AlbumSpaceCalculator(desktopMock.object);
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
        it('should return 0 when albumWidthInPixels is undefined', () => {
            // Arrange
            const albumWidthInPixels: number = undefined;
            const horizontalSpaceInPercent: number = 800;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidthInPixels is 0', () => {
            // Arrange
            const albumWidthInPixels: number = 0;
            const horizontalSpaceInPercent: number = 800;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when horizontalSpaceInPercent is undefined', () => {
            // Arrange
            const albumWidthInPixels: number = 120;
            const horizontalSpaceInPercent: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when horizontalSpaceInPercent is 0', () => {
            // Arrange
            const albumWidthInPixels: number = 120;
            const horizontalSpaceInPercent: number = 0;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidthInPixels is undefined and horizontalSpaceInPercent is 0', () => {
            // Arrange
            const albumWidthInPixels: number = undefined;
            const horizontalSpaceInPercent: number = 0;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidthInPixels is 0 and horizontalSpaceInPercent is undefined', () => {
            // Arrange
            const albumWidthInPixels: number = 0;
            const horizontalSpaceInPercent: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidthInPixels and horizontalSpaceInPercent are both undefined', () => {
            // Arrange
            const albumWidthInPixels: number = undefined;
            const horizontalSpaceInPercent: number = undefined;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return 0 when albumWidthInPixels and horizontalSpaceInPercent are both 0', () => {
            // Arrange
            const albumWidthInPixels: number = 0;
            const horizontalSpaceInPercent: number = 0;

            // Act458
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(0);
        });

        it('should return the number of albums that can fit in a row', () => {
            // Arrange
            const albumWidthInPixels: number = 120;
            const horizontalSpaceInPercent: number = 70;

            // Act
            const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(
                albumWidthInPixels,
                horizontalSpaceInPercent
            );

            // Assert
            expect(numberOfAlbumsPerRow).toEqual(3);
        });
    });
});
