import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { InformationComponent } from './information.component';

describe('InformationComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    let component: InformationComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        component = new InformationComponent(appearanceServiceMock.object);
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
            assert.strictEqual(component.appearanceService, appearanceServiceMock.object);
        });
    });
});
