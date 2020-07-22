import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { ColorSchemeSwitcherComponent } from '../app/components/color-scheme-switcher/color-scheme-switcher.component';
import { ColorScheme } from '../app/services/appearance/color-scheme';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';

describe('ColorSchemeSwitcherComponent', () => {
    describe('setColorScheme', () => {
        it('Should change the selected color scheme', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const colorThemeSwitcherComponent: ColorSchemeSwitcherComponent
            = new ColorSchemeSwitcherComponent(appearanceServiceMock.object);

            // Act
            const defaultColorScheme: ColorScheme = new ColorScheme('Default', '#fff', '#fff', '#fff');
            colorThemeSwitcherComponent.setColorScheme(defaultColorScheme);

            // Assert
            appearanceServiceMock.verify(x => x.selectedColorScheme = defaultColorScheme, Times.atLeastOnce());
        });
    });
});
