import { IMock, Mock } from 'typemoq';
import { AlbumComponent } from './album.component';
import { AppearanceServiceBase } from '../../../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../../../common/settings/settings.base';

describe('AlbumComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let component: AlbumComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        component = new AlbumComponent(appearanceServiceMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Album', () => {
            // Arrange

            // Act

            // Assert
            expect(component.album).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });
    });
});
