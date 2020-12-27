import { IMock, Mock, Times } from 'typemoq';
import { BackButtonComponent } from '../app/components/back-button/back-button.component';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';

describe('BackButtonComponent', () => {
    describe('goBackToCollection', () => {
        it('Should navigate to collection', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
            const backButtonComponent: BackButtonComponent = new BackButtonComponent(
                navigationServiceMock.object,
                indexingServiceMock.object);

            // Act
            backButtonComponent.goBackToCollection();

            // Assert
            navigationServiceMock.verify(x => x.navigateToCollection(), Times.exactly(1));
        });

        it('Should index collection if folders have changed', () => {
          // Arrange
          const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
          const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
          const backButtonComponent: BackButtonComponent = new BackButtonComponent(
              navigationServiceMock.object,
              indexingServiceMock.object);

          // Act
          backButtonComponent.goBackToCollection();

            // Assert
            indexingServiceMock.verify(x => x.indexCollectionIfFoldersHaveChangedAsync(), Times.exactly(1));
        });
    });
});
