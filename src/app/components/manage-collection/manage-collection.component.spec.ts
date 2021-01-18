import assert from 'assert';
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

    it('should create', () => {
        // Arrange

        // Act

        // Assert
        assert.ok(component);
    });

    describe('constructor', () => {
        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(component.appearanceService != undefined);
        });
    });
});
