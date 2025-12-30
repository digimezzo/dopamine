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

        it('should define showYear as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.showYear).toBeFalsy();
        });
    });

    describe('formatYear', () => {
        it('should return "?" when year is undefined', () => {
            // Arrange

            // Act
            const result = component.formatYear(undefined as any);

            // Assert
            expect(result).toEqual('?');
        });

        it('should return "?" when year is 0', () => {
            // Arrange

            // Act
            const result = component.formatYear(0);

            // Assert
            expect(result).toEqual('?');
        });

        it('should return the year as a string when year is a positive number', () => {
            // Arrange

            // Act
            const result = component.formatYear(2023);

            // Assert
            expect(result).toEqual('2023');
        });

        it('should return the year as a string when year is a negative number', () => {
            // Arrange

            // Act
            const result = component.formatYear(-500);

            // Assert
            expect(result).toEqual('-500');
        });
    });
});
