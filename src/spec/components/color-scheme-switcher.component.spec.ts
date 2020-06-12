import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { ColorSchemeSwitcherComponent } from '../../app/components/color-scheme-switcher/color-scheme-switcher.component';
import { ColorScheme } from '../../app/core/color-scheme';
import { Appearance } from '../../app/services/appearance/appearance';

describe('ColorSchemeSwitcherComponent', () => {
    describe('setColorScheme', () => {
        it('Should change the selected color scheme', () => {
            // Arrange
            const appearanceMock = TypeMoq.Mock.ofType<Appearance>();
            const colorThemeSwitcher: ColorSchemeSwitcherComponent = new ColorSchemeSwitcherComponent(appearanceMock.object);

            // Act
            const defaultColorScheme: ColorScheme = new ColorScheme('default', '#1d7dd4', '#1d7dd4');
            colorThemeSwitcher.setColorScheme(defaultColorScheme);

            // Assert
            appearanceMock.verify(x => x.selectedColorScheme = defaultColorScheme, Times.atLeastOnce());
        });
    });
});
