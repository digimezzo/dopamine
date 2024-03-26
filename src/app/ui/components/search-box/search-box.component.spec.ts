import { IMock, Mock, Times } from 'typemoq';
import { SearchBoxComponent } from './search-box.component';
import { SearchServiceBase } from '../../../services/search/search.service.base';

describe('SearchBoxComponent', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let component: SearchBoxComponent;

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        component = new SearchBoxComponent(searchServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define searchService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('clearSearchText', () => {
        it('should clear the search text', () => {
            // Arrange

            // Act
            component.clearSearchText();

            // Assert
            searchServiceMock.verify((x) => (x.searchText = ''), Times.once());
        });
    });
});
