import * as assert from 'assert';
import { FontSize } from '../app/core/base/font-size';

describe('FontSize', () => {
    describe('constructor', () => {
        it('Should have medium size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.mediumSize === 14);
        });

        it('Should have large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.largeSize === 14 * 1.429);
        });


        it('Should have extra large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.extraLargeSize === 14 * 1.857);
        });

        it('Should have mega size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.megaSize === 14 * 2.857);
        });
    });
});
