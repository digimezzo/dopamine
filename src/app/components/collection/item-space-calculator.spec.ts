import { ItemSpaceCalculator } from './item-space-calculator';

describe('ItemSpaceCalculator', () => {
    let itemSpaceCalculator: ItemSpaceCalculator;

    beforeEach(() => {
        itemSpaceCalculator = new ItemSpaceCalculator();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(itemSpaceCalculator).toBeDefined();
        });
    });

    describe('calculateNumberOfItemsPerRow', () => {
        it('should return 0 when itemWidth is undefined', () => {
            // Arrange
            const itemWidth: number = undefined;
            const availableWidth: number = 800;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when itemWidth is 0', () => {
            // Arrange
            const itemWidth: number = 0;
            const availableWidth: number = 800;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is undefined', () => {
            // Arrange
            const itemWidth: number = 120;
            const availableWidth: number = undefined;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is 0', () => {
            // Arrange
            const itemWidth: number = 120;
            const availableWidth: number = 0;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when itemWidth is undefined and availableWidth is 0', () => {
            // Arrange
            const itemWidth: number = undefined;
            const availableWidth: number = 0;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when itemWidth is 0 and availableWidth is undefined', () => {
            // Arrange
            const itemWidth: number = 0;
            const availableWidth: number = undefined;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when itemWidth and availableWidth are both undefined', () => {
            // Arrange
            const itemWidth: number = undefined;
            const availableWidth: number = undefined;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when itemWidth and availableWidth are both 0', () => {
            // Arrange
            const itemWidth: number = 0;
            const availableWidth: number = 0;

            // Act458
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth equals itemWidth', () => {
            // Arrange
            const itemWidth: number = 120;
            const availableWidth: number = 120;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return 0 when availableWidth is smaller than itemWidth', () => {
            // Arrange
            const itemWidth: number = 120;
            const availableWidth: number = 80;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(0);
        });

        it('should return the number of items that can fit in a row if availableWidth is larger than itemWidth plus additional margins', () => {
            // Arrange
            const itemWidth: number = 120;
            const availableWidth: number = 430;

            // Act
            const numberOfItemsPerRow: number = itemSpaceCalculator.calculateNumberOfItemsPerRow(itemWidth, availableWidth);

            // Assert
            expect(numberOfItemsPerRow).toEqual(3);
        });
    });
});
