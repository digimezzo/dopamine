import { IMock, Mock } from 'typemoq';
import { GripesSettingsComponent } from './gripes-settings.component';
import { SettingsBase } from '../../../../common/settings/settings.base';

describe('GripesSettingsComponent', () => {
    let component: GripesSettingsComponent;
    let settingsMock: IMock<SettingsBase>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();

        component = new GripesSettingsComponent(settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            /// Arrange, Act, Assert
            expect(component.settings).toBeDefined();
        });
    });
});
