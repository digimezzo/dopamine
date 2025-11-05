import { IMock, Mock, Times } from 'typemoq';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { ThemeCreator } from '../../../services/appearance/theme/theme-creator';
import { ThemeCoreColors } from '../../../services/appearance/theme/theme-core-colors';
import { ThemeNeutralColors } from '../../../services/appearance/theme/theme-neutral-colors';
import { ThemeOptions } from '../../../services/appearance/theme/theme-options';
import { Theme } from '../../../services/appearance/theme/theme';

describe('ColorSchemeSwitcherComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase> = Mock.ofType<AppearanceServiceBase>();

    let component: ThemeSwitcherComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();

        component = new ThemeSwitcherComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });

    describe('setTheme', () => {
        it('should change the selected theme', () => {
            // Arrange
            const themeCreator: ThemeCreator = new ThemeCreator('My creator', 'my@email.com');
            const coreColors: ThemeCoreColors = new ThemeCoreColors('red', 'green', 'blue');
            const darkColors: ThemeNeutralColors = new ThemeNeutralColors(
                'red',
                'green',
                'blue',
                '#fff',
                '#000',
                '#111',
                '#222',
                '#333',
                '#444',
                '#555',
                '#666',
                '#888',
                '#999',
                '#bbb',
                '#ccd',
                '#ccc',
                '#ddd',
                '#eee',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
            );
            const lightColors: ThemeNeutralColors = new ThemeNeutralColors(
                'red',
                'green',
                'blue',
                '#fff',
                '#000',
                '#111',
                '#222',
                '#333',
                '#444',
                '#555',
                '#666',
                '#888',
                '#999',
                '#bbb',
                '#ccd',
                '#ccc',
                '#ddd',
                '#eee',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
            );

            const options: ThemeOptions = new ThemeOptions(false);

            // Act
            const defaultColorScheme: Theme = new Theme('My theme', themeCreator, coreColors, darkColors, lightColors, options);
            component.setTheme(defaultColorScheme);

            // Assert
            appearanceServiceMock.verify((x) => (x.selectedTheme = defaultColorScheme), Times.once());
        });
    });
});
