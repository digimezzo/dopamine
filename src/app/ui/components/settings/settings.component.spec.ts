import { IMock, Mock } from 'typemoq';
import { SettingsComponent } from './settings.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

describe('SettingsComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;

    let component: SettingsComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();

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
