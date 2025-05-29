import { IMock, Mock, Times } from 'typemoq';
import { ManageRefreshComponent } from './manage-refresh.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';

describe('ManageRefreshComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let indexingServiceMock: IMock<IndexingService>;

    let component: ManageRefreshComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        indexingServiceMock = Mock.ofType<IndexingService>();

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
        it('should index the collection', () => {
            // Arrange

            // Act
            component.refreshNow();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionAlways(), Times.exactly(1));
        });
    });
});
