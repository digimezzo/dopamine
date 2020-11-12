import { Router } from '@angular/router';
import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { MainMenuComponent } from '../app/components/main-menu/main-menu.component';

describe('MainMenuComponent', () => {
    describe('constructor', () => {
        it('Should set router', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();

            // Act
            const advancedSettingsComponent: MainMenuComponent = new MainMenuComponent(routerMock.object);

            // Assert
            assert.ok(advancedSettingsComponent.router != undefined);
        });
    });

    describe('goToSettings', () => {
        it('Should navigate to settings', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(routerMock.object);

            // Act
            mainMenuComponent.goToManageCollection();

            // Assert
            routerMock.verify(x => x.navigate(['/managecollection']), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('Should navigate to settings', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(routerMock.object);

            // Act
            mainMenuComponent.goToSettings();

            // Assert
            routerMock.verify(x => x.navigate(['/settings']), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('Should navigate to information', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(routerMock.object);

            // Act
            mainMenuComponent.goToInformation();

            // Assert
            routerMock.verify(x => x.navigate(['/information']), Times.exactly(1));
        });
    });
});
