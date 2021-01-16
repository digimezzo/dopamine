import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { AdvancedSettingsComponent } from '../app/components/settings/advanced-settings/advanced-settings.component';
import { BaseSettings } from '../app/core/settings/base-settings';

describe('AdvancedSettingsComponent', () => {
    describe('constructor', () => {
        it('should set settings', () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();

            // Act
            const advancedSettingsComponent: AdvancedSettingsComponent = new AdvancedSettingsComponent(settingsMock.object);

            // Assert
            assert.ok(advancedSettingsComponent.settings != undefined);
        });
    });
});
