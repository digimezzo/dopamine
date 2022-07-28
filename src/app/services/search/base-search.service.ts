export abstract class BaseSearchService {
    public abstract searchText: string;
    public abstract delayedSearchText: string;
    public abstract hasSearchText: boolean;
    public abstract isSearching: boolean;
    public abstract startSearching(): void;
    public abstract stopSearching(): void;
    public abstract matchesSearchText(originalText: string, searchText: string): boolean;
}
