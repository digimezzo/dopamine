import { DefaultThemesCreator } from './default-themes-creator';
import { Theme } from './theme/theme';

describe('DefaultThemesCreator', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const defaultThemesCreator: DefaultThemesCreator = new DefaultThemesCreator();

            // Assert
            expect(defaultThemesCreator).toBeDefined();
        });
    });

    describe('createAllThemes', () => {
        it('should create all default themes', () => {
            // Arrange
            const defaultThemesCreator: DefaultThemesCreator = new DefaultThemesCreator();

            // Act
            const defaultThemes: Theme[] = defaultThemesCreator.createAllThemes();

            // Assert
            expect(defaultThemes.length).toEqual(7);
            expect(defaultThemes[0].name).toEqual('Dopamine');
            expect(defaultThemes[1].name).toEqual('Zune');
            expect(defaultThemes[2].name).toEqual('Beats');
            expect(defaultThemes[3].name).toEqual('Naughty');
            expect(defaultThemes[4].name).toEqual('Ubuntu');
            expect(defaultThemes[5].name).toEqual('Manjaro');
            expect(defaultThemes[6].name).toEqual('Palenight');
        });
    });
});
