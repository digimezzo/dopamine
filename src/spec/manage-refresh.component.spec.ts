import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { ManageRefreshComponent } from '../app/components/manage-collection/manage-refresh/manage-refresh.component';
import { BaseSettings } from '../app/core/settings/base-settings';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';

describe('ManageRefreshComponent', () => {
    describe('constructor', () => {
        it('should set settings', () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const baseIndexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();

            // Act
            const manageRefreshComponent: ManageRefreshComponent = new ManageRefreshComponent(
                settingsMock.object,
                baseIndexingServiceMock.object
            );

            // Assert
            assert.ok(manageRefreshComponent.settings != undefined);
        });

        describe('refreshNowAsync', () => {
            it('should index the collection', async () => {
                // Arrange
                const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
                const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
                const manageRefreshComponent: ManageRefreshComponent = new ManageRefreshComponent(
                    settingsMock.object,
                    indexingServiceMock.object
                );

                // Act
                await manageRefreshComponent.refreshNowAsync();

                // Assert
                indexingServiceMock.verify((x) => x.indexCollectionAlwaysAsync(), Times.exactly(1));
            });
        });
    });
});
