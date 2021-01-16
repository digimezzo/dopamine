import * as assert from 'assert';
import { FontSize } from './font-size';

describe('FontSize', () => {
    describe('constructor', () => {
        it('should have medium size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.mediumSize === 14);
        });

        it('should have large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.largeSize === 14 * 1.143);
        });

        it('should have extra large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.extraLargeSize === 14 * 1.857);
        });

        it('should have mega size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.megaSize === 14 * 2.571);
        });
    });
});
