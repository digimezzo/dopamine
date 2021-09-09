import { Observable } from 'rxjs';

export abstract class BaseSearchService {
    public abstract searchTextChanged$: Observable<string>;
    public abstract searchText: string;
    public abstract hasSearchText: boolean;
    public abstract isSearching: boolean;
    public abstract startSearching(): void;
    public abstract stopSearching(): void;
}
