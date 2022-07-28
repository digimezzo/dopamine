import { FontSize } from './font-size';

describe('FontSize', () => {
    describe('constructor', () => {
        it('should have normal size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            expect(fontSize.normalSize).toEqual(14);
        });

        it('should have medium size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            expect(fontSize.mediumSize).toEqual(14 * 1.143);
        });

        it('should have large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            expect(fontSize.largeSize).toEqual(14 * 1.571);
        });

        it('should have extra large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            expect(fontSize.extraLargeSize).toEqual(14 * 1.857);
        });

        it('should have mega size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            expect(fontSize.megaSize).toEqual(14 * 2.571);
        });
    });
});
