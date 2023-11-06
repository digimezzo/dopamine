import { IMock, Mock, Times } from 'typemoq';
import { SettingsBase } from '../../../common/settings/settings.base';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { ManageRefreshComponent } from './manage-refresh.component';

describe('ManageRefreshComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let indexingServiceMock: IMock<BaseIndexingService>;

    let component: ManageRefreshComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();

        component = new ManageRefreshComponent(settingsMock.object, indexingServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
        });
    });
    describe('refreshNowAsync', () => {
        it('should index the collection', async () => {
            // Arrange

            // Act
            await component.refreshNowAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionAlwaysAsync(), Times.exactly(1));
        });
    });
});
