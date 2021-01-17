import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ColorScheme } from '../../services/appearance/color-scheme';
import { ColorSchemeSwitcherComponent } from './color-scheme-switcher.component';

describe('ColorSchemeSwitcherComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

    let component: ColorSchemeSwitcherComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        appearanceServiceMock.setup((x) => x.colorSchemes).returns(() => []);

        component = new ColorSchemeSwitcherComponent(appearanceServiceMock.object);
    });

    describe('setColorScheme', () => {
        it('should change the selected color scheme', () => {
            // Arrange

            // Act
            const defaultColorScheme: ColorScheme = new ColorScheme('Default', '#fff', '#fff', '#fff');
            component.setColorScheme(defaultColorScheme);

            // Assert
            appearanceServiceMock.verify((x) => (x.selectedColorScheme = defaultColorScheme), Times.atLeastOnce());
        });
    });
});
