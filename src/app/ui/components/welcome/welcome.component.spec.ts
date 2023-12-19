import { IMock, Mock, Times } from 'typemoq';
import { WelcomeComponent } from './welcome.component';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { WelcomeServiceBase } from '../../../services/welcome/welcome.service.base';
import { WelcomeGreetingComponent } from './welcome-greeting/welcome-greeting.component';

describe('WelcomeComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let welcomeServiceMock: IMock<WelcomeServiceBase>;

    let component: WelcomeComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        welcomeServiceMock = Mock.ofType<WelcomeServiceBase>();

        component = new WelcomeComponent(appearanceServiceMock.object, welcomeServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should have 7 pages', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalPages).toEqual(7);
        });
    });

    describe('isLoaded', () => {
        it('should return isLoaded from WelcomeService', () => {
            // Arrange
            welcomeServiceMock.setup((x) => x.isLoaded).returns(() => true);

            // Act, Assert
            expect(component.isLoaded).toBeTruthy();
        });
    });

    describe('currentPage', () => {
        it('should get page', () => {
            // Arrange
            component.page = 6;

            // Act, Assert
            expect(component.currentPage).toEqual(6);
        });

        it('should set page', () => {
            // Arrange
            component.page = 6;

            // Act
            component.currentPage = 5;

            // Assert
            expect(component.currentPage).toEqual(5);
        });
    });
});
