import { IMock, Mock, Times } from 'typemoq';
import { ManageRefreshComponent } from './manage-refresh.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';

describe('ManageRefreshComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let indexingServiceMock: IMock<IndexingServiceBase>;

    let component: ManageRefreshComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        indexingServiceMock = Mock.ofType<IndexingServiceBase>();

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
