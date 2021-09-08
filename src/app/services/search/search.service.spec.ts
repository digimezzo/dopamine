import { BaseSearchService } from './base-search.service';
import { SearchService } from './search.service';

describe('SearchService', () => {
    let service: BaseSearchService;

    beforeEach(() => {
        service = new SearchService();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should initialize searchText as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(service.searchText).toEqual('');
        });

        it('should initialize hasSearchText as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.hasSearchText).toBeFalsy();
        });

        it('should initialize isSearching as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.isSearching).toBeFalsy();
        });
    });

    describe('hasSearchText', () => {
        it('should return false if searchText is undefined', () => {
            // Arrange
            service.searchText = undefined;

            // Act

            // Assert
            expect(service.hasSearchText).toBeFalsy();
        });

        it('should return false if searchText is empty', () => {
            // Arrange
            service.searchText = '';

            // Act

            // Assert
            expect(service.hasSearchText).toBeFalsy();
        });

        it('should return false if searchText is space', () => {
            // Arrange
            service.searchText = ' ';

            // Act

            // Assert
            expect(service.hasSearchText).toBeFalsy();
        });

        it('should return false if searchText is not empty and not space', () => {
            // Arrange
            service.searchText = 'Hello';

            // Act

            // Assert
            expect(service.hasSearchText).toBeTruthy();
        });
    });

    describe('startSearching', () => {
        it('should set isSearching to true', () => {
            // Arrange

            // Act
            service.startSearching();

            // Assert
            expect(service.isSearching).toBeTruthy();
        });
    });

    describe('stopSearching', () => {
        it('should set isSearching to false', () => {
            // Arrange
            service.startSearching();

            // Act
            service.stopSearching();

            // Assert
            expect(service.isSearching).toBeFalsy();
        });
    });
});
