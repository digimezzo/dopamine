import { IMock, Mock } from 'typemoq';
import { WelcomeAppearanceComponent } from './welcome-appearance.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';

describe('WelcomeAppearanceComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeAppearanceComponent = new WelcomeAppearanceComponent(appearanceServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange
            const component: WelcomeAppearanceComponent = new WelcomeAppearanceComponent(appearanceServiceMock.object);

            // Act, Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
