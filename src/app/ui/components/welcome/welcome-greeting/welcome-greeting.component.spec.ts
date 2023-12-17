import { IMock, Mock } from 'typemoq';
import { WelcomeServiceBase } from '../../../../services/welcome/welcome.service.base';
import { WelcomeGreetingComponent } from './welcome-greeting.component';

describe('WelcomeGreetingComponent', () => {
    let welcomeServiceMock: IMock<WelcomeServiceBase>;

    beforeEach(() => {
        welcomeServiceMock = Mock.ofType<WelcomeServiceBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: WelcomeGreetingComponent = new WelcomeGreetingComponent(welcomeServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('isLoaded', () => {
        it('should return isLoaded from WelcomeService', () => {
            // Arrange
            const component: WelcomeGreetingComponent = new WelcomeGreetingComponent(welcomeServiceMock.object);
            welcomeServiceMock.setup((x) => x.isLoaded).returns(() => true);

            // Act, Assert
            expect(component.isLoaded).toBeTruthy();
        });
    });
});
