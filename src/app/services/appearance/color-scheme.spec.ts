import * as assert from 'assert';
import { ColorScheme } from './color-scheme';

describe('ColorScheme', () => {
    let colorScheme: ColorScheme;

    beforeEach(() => {
        colorScheme = new ColorScheme('MyColorScheme', '#ffffff', '#000000', '#ff0000');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(colorScheme);
        });

        it('should set name', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(colorScheme.name === 'MyColorScheme');
        });

        it('should set primary color', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(colorScheme.primaryColor === '#ffffff');
        });

        it('should set secondary color', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(colorScheme.secondaryColor === '#000000');
        });

        it('should set accent color', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(colorScheme.accentColor === '#ff0000');
        });
    });
});
