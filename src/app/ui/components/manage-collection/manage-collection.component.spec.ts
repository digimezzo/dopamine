import { IMock, Mock } from 'typemoq';
import { ManageCollectionComponent } from './manage-collection.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

describe('ManageRefreshComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;

    let component: ManageCollectionComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();

        component = new ManageCollectionComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
