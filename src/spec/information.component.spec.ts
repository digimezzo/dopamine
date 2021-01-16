import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { InformationComponent } from '../app/components/information/information.component';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';

describe('InformationComponent', () => {
    describe('constructor', () => {
        it('should set appearanceService', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();

            // Act
            const informationComponent: InformationComponent = new InformationComponent(appearanceServiceMock.object);

            // Assert
            assert.ok(informationComponent.appearanceService != undefined);
        });
    });
});
