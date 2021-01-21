import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { ManageCollectionComponent } from './manage-collection.component';

describe('ManageRefreshComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    let component: ManageCollectionComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        component = new ManageCollectionComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeTruthy();
        });

        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeTruthy();
        });
    });
});
