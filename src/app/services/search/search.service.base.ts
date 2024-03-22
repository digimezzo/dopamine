export abstract class SearchServiceBase {
    public abstract searchText: string;
    public abstract delayedSearchText: string;
    public abstract hasSearchText: boolean;
    public abstract matchesSearchText(originalText: string, searchText: string): boolean;
}
