import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

    let component: CollectionComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        component = new CollectionComponent(appearanceServiceMock.object);
    });

    describe('ngOnInit', () => {
        it('should set appearanceService', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            assert.ok(component.appearanceService != undefined);
        });
    });
});
