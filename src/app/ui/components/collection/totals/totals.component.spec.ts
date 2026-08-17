import { IMock, Mock } from 'typemoq';
import { TotalsComponent } from './totals.component';
import { SettingsBase } from '../../../../common/settings/settings.base';

describe('SnackBarComponent', () => {
    let component: TotalsComponent;
    let settingsMock: IMock<SettingsBase>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        component = new TotalsComponent(settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define totalFileSizeInBytes', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalFileSizeInBytes).toBeDefined();
        });

        it('should set totalFileSizeInBytes to 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalFileSizeInBytes).toEqual(0);
        });

        it('should define totalDurationInMilliseconds', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalDurationInMilliseconds).toBeDefined();
        });

        it('should set totalDurationInMilliseconds to 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalDurationInMilliseconds).toEqual(0);
        });
    });
});
