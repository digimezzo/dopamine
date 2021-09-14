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

        it('should initialize delayedSearchText as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(service.delayedSearchText).toEqual('');
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

    describe('searchText', () => {
        it('should return the search text', () => {
            // Arrange
            service.searchText = 'mysearchtext';

            // Act
            const searchText: string = service.searchText;

            // Assert
            expect(searchText).toEqual('mysearchtext');
        });

        it('should update delayedSearchText', () => {
            // Arrange

            // Act
            jest.useFakeTimers();
            service.searchText = 'mysearchtext';
            jest.runAllTimers();

            // Assert
            expect(service.delayedSearchText).toEqual('mysearchtext');
        });
    });

    describe('matchesSearchText', () => {
        it('should return false if the original text is undefined', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText(undefined, 'test');

            // Assert
            expect(matchesSearchText).toBeFalsy();
        });

        it('should return false if the original text is empty', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('', 'test');

            // Assert
            expect(matchesSearchText).toBeFalsy();
        });

        it('should return false if the original text is space', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText(' ', 'test');

            // Assert
            expect(matchesSearchText).toBeFalsy();
        });

        it('should return false if the original text does not contain the search text', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('some text', 'test');

            // Assert
            expect(matchesSearchText).toBeFalsy();
        });

        it('should return true if the original text contains the search text exactly', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('this is a test', 'test');

            // Assert
            expect(matchesSearchText).toBeTruthy();
        });

        it('should return true if the original text contains the search text with different casing', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('this is a TeSt', 'test');

            // Assert
            expect(matchesSearchText).toBeTruthy();
        });

        it('should return true if the original text contains the search text with accents', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('this is a tèst', 'test');

            // Assert
            expect(matchesSearchText).toBeTruthy();
        });

        it('should return true if the original text contains the search text with accents and different casing', () => {
            // Arrange

            // Act
            const matchesSearchText: boolean = service.matchesSearchText('this is a TèSt', 'test');

            // Assert
            expect(matchesSearchText).toBeTruthy();
        });
    });
});
