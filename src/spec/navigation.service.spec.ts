import { Router } from '@angular/router';
import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';
import { NavigationService } from '../app/services/navigation/navigation.service';

describe('NavigationService', () => {
    describe('navigateToLoading', () => {
        it('Should navigate to loading', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToLoading();

            // Assert
            routerMock.verify((x) => x.navigate(['/loading']), Times.exactly(1));
        });
    });

    describe('navigateToCollection', () => {
        it('Should navigate to collection', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToCollection();

            // Assert
            routerMock.verify((x) => x.navigate(['/collection']), Times.exactly(1));
        });
    });

    describe('navigateToWelcome', () => {
        it('Should navigate to welcome', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToWelcome();

            // Assert
            routerMock.verify((x) => x.navigate(['/welcome']), Times.exactly(1));
        });
    });

    describe('navigateToManageCollection', () => {
        it('Should navigate to manage collection', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToManageCollection();

            // Assert
            routerMock.verify((x) => x.navigate(['/managecollection']), Times.exactly(1));
        });
    });

    describe('navigateToSettings', () => {
        it('Should navigate to settings', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToSettings();

            // Assert
            routerMock.verify((x) => x.navigate(['/settings']), Times.exactly(1));
        });
    });

    describe('navigateToInformation', () => {
        it('Should navigate to information', async () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const navigationService: BaseNavigationService = new NavigationService(routerMock.object);

            // Act
            navigationService.navigateToInformation();

            // Assert
            routerMock.verify((x) => x.navigate(['/information']), Times.exactly(1));
        });
    });
});
