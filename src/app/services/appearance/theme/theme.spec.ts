import { Theme } from './theme';
import { ThemeCoreColors } from './theme-core-colors';
import { ThemeCreator } from './theme-creator';
import { ThemeNeutralColors } from './theme-neutral-colors';
import { ThemeOptions } from './theme-options';

describe('Theme', () => {
    function createNeutralColors(): ThemeNeutralColors {
        return new ThemeNeutralColors(
            'red',
            'green',
            'blue',
            'black',
            'white',
            '#aaa',
            '#bbb',
            '#ccc',
            '#ddd',
            '#eee',
            '#fff',
            '#111',
            '#222',
            '#333',
            '#444',
            '#555',
            '#666',
            '#777',
            '#888',
            '#999',
            '#aaa',
            '#bbb',
            '#ccc',
            '#ddd',
            '#eee',
            '#fff',
            '#eff',
            '#dff'
        );
    }

    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme).toBeDefined();
        });

        it('should set name', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.name).toEqual('My name');
        });

        it('should set creator', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.creator).toBe(creator);
        });

        it('should set coreColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.coreColors).toBe(coreColors);
        });

        it('should set darkColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.darkColors).toBe(darkColors);
        });

        it('should set lightColors', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.lightColors).toBe(lightColors);
        });

        it('should set options', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.options).toBe(options);
        });

        it('should set isBroken to false', () => {
            // Arrange
            const creator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', creator, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.isBroken).toEqual(false);
        });
    });
});
