import * as assert from 'assert';
import { ColorScheme } from '../app/services/appearance/color-scheme';

describe('ColorScheme', () => {
    describe('constructor', () => {
        it('Should set name', () => {
            // Arrange
            const colorScheme: ColorScheme = new ColorScheme('MyColorScheme', '#ffffff', '#000000', '#ff0000');

            // Act

            // Assert
            assert.ok(colorScheme.name === 'MyColorScheme');
        });

        it('Should set primary color', () => {
            // Arrange
            const colorScheme: ColorScheme = new ColorScheme('MyColorScheme', '#ffffff', '#000000', '#ff0000');

            // Act

            // Assert
            assert.ok(colorScheme.primaryColor === '#ffffff');
        });

        it('Should set secondary color', () => {
            // Arrange
            const colorScheme: ColorScheme = new ColorScheme('MyColorScheme', '#ffffff', '#000000', '#ff0000');

            // Act

            // Assert
            assert.ok(colorScheme.secondaryColor === '#000000');
        });

        it('Should set accent color', () => {
            // Arrange
            const colorScheme: ColorScheme = new ColorScheme('MyColorScheme', '#ffffff', '#000000', '#ff0000');

            // Act

            // Assert
            assert.ok(colorScheme.accentColor === '#ff0000');
        });
    });
});
