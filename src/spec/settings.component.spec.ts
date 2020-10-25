import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { SettingsComponent } from '../app/components/settings/settings.component';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';

describe('SettingsComponent', () => {
    describe('constructor', () => {
        it('Should set appearanceService', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

            // Act
            const settingsComponent: SettingsComponent = new SettingsComponent(appearanceServiceMock.object);

            // Assert
            assert.ok(settingsComponent.appearanceService != undefined);
        });
    });
});
