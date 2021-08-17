import { ThemeCoreColors } from './theme-core-colors';

describe('ThemeCoreColors', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const colors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');

            // Assert
            expect(colors).toBeDefined();
        });

        it('should set primaryColor', () => {
            // Arrange
            const colors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');

            // Act

            // Assert
            expect(colors.primaryColor).toEqual('#fff');
        });

        it('should set secondaryColor', () => {
            // Arrange
            const colors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');

            // Act

            // Assert
            expect(colors.secondaryColor).toEqual('#000');
        });

        it('should set accentColor', () => {
            // Arrange
            const colors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');

            // Act

            // Assert
            expect(colors.accentColor).toEqual('#ccc');
        });
    });
});
