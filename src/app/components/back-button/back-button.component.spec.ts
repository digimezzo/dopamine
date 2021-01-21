import { IMock, Mock, Times } from 'typemoq';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BackButtonComponent } from './back-button.component';

describe('BackButtonComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let indexingServiceMock: IMock<BaseIndexingService>;

    let component: BackButtonComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();

        component = new BackButtonComponent(navigationServiceMock.object, indexingServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('goBackToCollection', () => {
        it('should navigate to collection', () => {
            // Arrange

            // Act
            component.goBackToCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });

        it('should index collection if folders have changed', () => {
            // Arrange

            // Act
            component.goBackToCollection();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfFoldersHaveChangedAsync(), Times.exactly(1));
        });
    });
});
