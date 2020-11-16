import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { ManageRefreshComponent } from '../app/components/manage-collection/manage-refresh/manage-refresh.component';
import { BaseSettings } from '../app/core/settings/base-settings';

describe('ManageRefreshComponent', () => {
    describe('constructor', () => {
        it('Should set settings', () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();

            // Act
            const manageRefreshComponent: ManageRefreshComponent = new ManageRefreshComponent(settingsMock.object);

            // Assert
            assert.ok(manageRefreshComponent.settings != undefined);
        });
    });
});
