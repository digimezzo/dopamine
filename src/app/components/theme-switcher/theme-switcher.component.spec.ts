import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ColorScheme } from '../../services/appearance/color-scheme';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ColorSchemeSwitcherComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

    let component: ThemeSwitcherComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        appearanceServiceMock.setup((x) => x.colorSchemes).returns(() => []);

        component = new ThemeSwitcherComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('setColorScheme', () => {
        it('should change the selected color scheme', () => {
            // Arrange

            // Act
            const defaultColorScheme: ColorScheme = new ColorScheme('Default', '#fff', '#fff', '#fff');
            component.setTheme(defaultColorScheme);

            // Assert
            appearanceServiceMock.verify((x) => (x.selectedColorScheme = defaultColorScheme), Times.atLeastOnce());
        });
    });
});
