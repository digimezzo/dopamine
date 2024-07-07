import { IMock, Mock, Times } from 'typemoq';
import { BackButtonComponent } from './back-button.component';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { IndexingServiceBase } from '../../../services/indexing/indexing.service.base';

describe('BackButtonComponent', () => {
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let indexingServiceMock: IMock<IndexingServiceBase>;

    let component: BackButtonComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        indexingServiceMock = Mock.ofType<IndexingServiceBase>();

        component = new BackButtonComponent(navigationServiceMock.object, indexingServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });
    });

    describe('goBackToCollection', () => {
        it('should navigate to collection', async () => {
            // Arrange, Act
            await component.goBackToCollectionAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollectionAsync(), Times.exactly(1));
        });

        it('should index collection if options have changed', async () => {
            // Arrange, Act
            await component.goBackToCollectionAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexCollectionIfOptionsHaveChanged(), Times.exactly(1));
        });
    });
});
