import { Router } from '@angular/router';
import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BackButtonComponent } from '../app/components/back-button/back-button.component';

describe('BackButtonComponent', () => {
    describe('constructor', () => {
        it('Should set router', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();

            // Act
            const advancedSettingsComponent: BackButtonComponent = new BackButtonComponent(routerMock.object);

            // Assert
            assert.ok(advancedSettingsComponent.router != undefined);
        });
    });
});
