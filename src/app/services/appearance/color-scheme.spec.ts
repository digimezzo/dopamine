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
            expect(colorScheme).toBeDefined();
        });

        it('should set name', () => {
            // Arrange

            // Act

            // Assert
            expect(colorScheme.name).toEqual('MyColorScheme');
        });

        it('should set primary color', () => {
            // Arrange

            // Act

            // Assert
            expect(colorScheme.primaryColor).toEqual('#ffffff');
        });

        it('should set secondary color', () => {
            // Arrange

            // Act

            // Assert
            expect(colorScheme.secondaryColor).toEqual('#000000');
        });

        it('should set accent color', () => {
            // Arrange

            // Act

            // Assert
            expect(colorScheme.accentColor).toEqual('#ff0000');
        });
    });
});
