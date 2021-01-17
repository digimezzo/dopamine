import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { AdvancedSettingsComponent } from './advanced-settings.component';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<BaseSettings>;

    let component: AdvancedSettingsComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();

        component = new AdvancedSettingsComponent(settingsMock.object);
    });

    describe('constructor', () => {
        it('should set settings', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(component.settings != undefined);
        });
    });
});
