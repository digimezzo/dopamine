import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { ColorSchemeSwitcherComponent } from '../../app/components/color-scheme-switcher/color-scheme-switcher.component';
import { ColorScheme } from '../../app/core/color-scheme';
import { AppearanceServiceBase } from '../../app/services/appearance/appearance-service-base';

describe('ColorSchemeSwitcherComponent', () => {
    describe('setColorScheme', () => {
        it('Should change the selected color scheme', () => {
            // Arrange
            const appearanceServiceMock = TypeMoq.Mock.ofType<AppearanceServiceBase>();
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
