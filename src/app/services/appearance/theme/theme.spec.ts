import { Theme } from './theme';
import { ThemeCoreColors } from './theme-core-colors';
import { ThemeCreator } from './theme-creator';
import { ThemeNeutralColors } from './theme-neutral-colors';

describe('Theme', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme).toBeDefined();
        });

        it('should set name', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme.name).toEqual('My name');
        });

        it('should set creator', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme.creator).toBe(creator);
        });

        it('should set coreColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme.coreColors).toBe(coreColors);
        });

        it('should set darkColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme.darkColors).toBe(darkColors);
        });

        it('should set lightColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors('#fff', '#000', '#ccc');

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors);

            // Assert
            expect(theme.lightColors).toBe(lightColors);
        });
    });
});
