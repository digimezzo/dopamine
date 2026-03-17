import { Theme } from './theme';
import { ThemeCoreColors } from './theme-core-colors';
import { ThemeAuthor } from './theme-author';
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
            '#222',
            '#333',
            '#555',
            '#667',
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
            '#dff',
            '#eff',
            '#eee',
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme).toBeDefined();
        });

        it('should set name', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.name).toEqual('My name');
        });

        it('should set author', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.author).toBe(author);
        });

        it('should set coreColors', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.coreColors).toBe(coreColors);
        });

        it('should set darkColors', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.darkColors).toBe(darkColors);
        });

        it('should set lightColors', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.lightColors).toBe(lightColors);
        });

        it('should set options', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.options).toBe(options);
        });

        it('should set isBroken to false', () => {
            // Arrange
            const author: ThemeAuthor = new ThemeAuthor('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('#fff', '#000', '#ccc');
            const darkColors: ThemeNeutralColors = createNeutralColors();
            const lightColors: ThemeNeutralColors = createNeutralColors();
            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const theme: Theme = new Theme('My name', author, coreColors, darkColors, lightColors, options);

            // Assert
            expect(theme.isBroken).toEqual(false);
        });
    });
});
