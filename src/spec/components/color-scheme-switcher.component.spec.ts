import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { ColorSchemeSwitcherComponent } from '../../app/components/color-scheme-switcher/color-scheme-switcher.component';
import { AppearanceService } from '../../app/services/appearance/appearance.service';
import { ColorScheme } from '../../app/core/color-scheme';

describe('ColorSchemeSwitcherComponent', () => {
    describe('setColorScheme', () => {
        it('Should change the selected color scheme', () => {
            // Arrange
            const appearanceServiceMock: TypeMoq.IMock<AppearanceService> = TypeMoq.Mock.ofType<AppearanceService>();
            const colorThemeSwitcher: ColorSchemeSwitcherComponent = new ColorSchemeSwitcherComponent(appearanceServiceMock.object);

            // Act
            const defaultColorScheme: ColorScheme = new ColorScheme('default', '#1d7dd4', '#1d7dd4');
            colorThemeSwitcher.setColorScheme(defaultColorScheme);

            // Assert
            appearanceServiceMock.verify(x => x.selectedColorScheme = defaultColorScheme, Times.atLeastOnce());
        });
    });
});
