import { Router } from '@angular/router';
import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { BackButtonComponent } from '../app/components/back-button/back-button.component';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';

describe('BackButtonComponent', () => {
    describe('constructor', () => {
        it('Should set router', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();

            // Act
            const advancedSettingsComponent: BackButtonComponent = new BackButtonComponent(
                routerMock.object,
                indexingServiceMock.object);

            // Assert
            assert.ok(advancedSettingsComponent.router != undefined);
        });
    });
});
