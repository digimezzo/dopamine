import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { ManageCollectionComponent } from '../app/components/manage-collection/manage-collection.component';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';

describe('ManageCollectionComponent', () => {
    describe('constructor', () => {
        it('Should set appearanceService', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

            // Act
            const manageCollectionComponent: ManageCollectionComponent = new ManageCollectionComponent(appearanceServiceMock.object);

            // Assert
            assert.ok(manageCollectionComponent.appearanceService != undefined);
        });
    });
});
