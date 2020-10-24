import * as assert from 'assert';
import { FontSize } from '../app/core/base/font-size';

describe('FontSize', () => {
    describe('constructor', () => {
        it('Should have normal size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.normalSize === 14);
        });

        it('Should have large size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.largeSize === 14 * 1.429);
        });


        it('Should have larger size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.largerSize === 14 * 1.857);
        });

        it('Should have largest size', () => {
            // Arrange

            // Act
            const fontSize = new FontSize(14);

            // Assert
            assert.ok(fontSize.largestSize === 14 * 2.857);
        });
    });
});
