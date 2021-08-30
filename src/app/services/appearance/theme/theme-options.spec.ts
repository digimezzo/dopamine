import { ThemeOptions } from './theme-options';

describe('ThemeOptions', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const creator: ThemeOptions = new ThemeOptions(false);

            // Assert
            expect(creator).toBeDefined();
        });

        it('should set centerAlbumInfoText', () => {
            // Arrange
            const creator: ThemeOptions = new ThemeOptions(false);

            // Act

            // Assert
            expect(creator.centerAlbumInfoText).toBeFalsy();
        });
    });
});
