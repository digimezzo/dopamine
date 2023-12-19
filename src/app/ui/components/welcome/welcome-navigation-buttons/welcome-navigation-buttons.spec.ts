import { IMock, Mock, Times } from 'typemoq';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { WelcomeServiceBase } from '../../../../services/welcome/welcome.service.base';
import { WelcomeNavigationButtonsComponent } from './welcome-navigation-buttons';

describe('WelcomeNavigationButtonsComponent', () => {
    let welcomeServiceMock: IMock<WelcomeServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;

    let component: WelcomeNavigationButtonsComponent;

    beforeEach(() => {
        welcomeServiceMock = Mock.ofType<WelcomeServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();

        component = new WelcomeNavigationButtonsComponent(welcomeServiceMock.object, navigationServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define page as 0', () => {
            // Arrange, Act, Assert
            expect(component.page).toEqual(0);
        });

        it('should define totalPages as 0', () => {
            // Arrange, Act, Assert
            expect(component.totalPages).toEqual(0);
        });
    });

    describe('canGoBack', () => {
        it('should return false when page is 0', () => {
            // Arrange
            component.page = 0;

            // Act, Assert
            expect(component.canGoBack).toBeFalsy();
        });

        it('should return false when page larger than 0 and page is larger than totalPages minus 1', () => {
            // Arrange
            component.page = 7;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canGoBack).toBeFalsy();
        });

        it('should return true when page larger than 0 and page is smaller than totalPages minus 1', () => {
            // Arrange
            component.page = 5;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canGoBack).toBeTruthy();
        });
    });

    describe('canGoForward', () => {
        it('should return false when page is larger than totalPages minus 1', () => {
            // Arrange
            component.page = 7;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canGoForward).toBeFalsy();
        });

        it('should return true when page is smaller than totalPages minus 1', () => {
            // Arrange
            component.page = 3;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canGoForward).toBeTruthy();
        });
    });

    describe('canFinish', () => {
        it('should return false when page is not equal to totalPages minus 1', () => {
            // Arrange
            component.page = 5;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canFinish).toBeFalsy();
        });

        it('should return true when page is not equal to totalPages minus 1', () => {
            // Arrange
            component.page = 6;
            component.totalPages = 7;

            // Act, Assert
            expect(component.canFinish).toBeTruthy();
        });
    });

    describe('goBack', () => {
        it('should decrease and emit page if possible to go back', () => {
            // Arrange
            component.page = 5;
            component.totalPages = 7;

            let receivedPage = 0;

            component.pageChange.subscribe((page) => (receivedPage = page));

            // Act
            component.goBack();

            // Assert
            expect(component.page).toEqual(4);
            expect(receivedPage).toEqual(4);
        });

        it('should not decrease page if not possible to go back', () => {
            // Arrange
            component.page = 6;
            component.totalPages = 7;

            // Act
            component.goBack();

            // Assert
            expect(component.page).toEqual(6);
        });
    });

    describe('goForward', () => {
        it('should increase and emit page if possible to go forward', () => {
            // Arrange
            component.page = 3;
            component.totalPages = 7;

            let receivedPage = 0;

            component.pageChange.subscribe((page) => (receivedPage = page));

            // Act
            component.goForward();

            // Assert
            expect(component.page).toEqual(4);
            expect(receivedPage).toEqual(4);
        });

        it('should not increase page if not possible to go forward', () => {
            // Arrange
            component.page = 7;
            component.totalPages = 7;

            // Act
            component.goForward();

            // Assert
            expect(component.page).toEqual(7);
        });
    });

    describe('finishAsync', () => {
        it('should navigate to loading', async () => {
            // Arrange

            // Act
            await component.finishAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoadingAsync(), Times.once());
        });
    });
});
