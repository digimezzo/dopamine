import { Router } from '@angular/router';
import { IMock, Mock, Times } from 'typemoq';
import { BackButtonComponent } from '../app/components/back-button/back-button.component';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';

describe('BackButtonComponent', () => {
    describe('gobackToCollection', () => {
        it('Should navigate back to collection', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
            const backButtonComponent: BackButtonComponent = new BackButtonComponent(
                routerMock.object,
                indexingServiceMock.object);

            // Act
            backButtonComponent.goBackToCollection();

            // Assert
            routerMock.verify(x => x.navigate(['/collection']), Times.exactly(1));
        });

        it('Should start indexing if the folders have changed', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
            const backButtonComponent: BackButtonComponent = new BackButtonComponent(
                routerMock.object,
                indexingServiceMock.object);

            // Act
            backButtonComponent.goBackToCollection();

            // Assert
            indexingServiceMock.verify(x => x.indexCollectionIfFoldersHaveChangedAsync(), Times.exactly(1));
        });
    });
});
