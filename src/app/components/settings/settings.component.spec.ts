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

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toEqual(appearanceServiceMock.object);
        });
    });
});
