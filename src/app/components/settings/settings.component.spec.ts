import assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    let component: SettingsComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        component = new SettingsComponent(appearanceServiceMock.object);
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
