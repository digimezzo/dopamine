import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Constants } from '../../common/application/constants';
import { Strings } from '../../common/strings';
import { BaseSearchService } from './base-search.service';

@Injectable()
export class SearchService implements BaseSearchService {
    private debouncingSearchTextChanged: Subject<string> = new Subject<string>();
    private searchTextChanged: Subject<string> = new Subject<string>();
    private _isSearching: boolean = false;
    private _searchText: string = '';

    constructor() {
        this.debouncingSearchTextChanged
            .pipe(debounceTime(Constants.searchDelayMilliseconds), distinctUntilChanged())
            .subscribe((searchText) => {
                console.log(`Search text is '${searchText}'`);
                this.searchTextChanged.next(searchText);
            });
    }

    public searchTextChanged$: Observable<string> = this.searchTextChanged.asObservable();

    public get searchText(): string {
        return this._searchText;
    }
    public set searchText(v: string) {
        this._searchText = v;
        this.debouncingSearchTextChanged.next(v);
    }

    public get hasSearchText(): boolean {
        return !Strings.isNullOrWhiteSpace(this.searchText);
    }

    public get isSearching(): boolean {
        return this._isSearching;
    }

    public startSearching(): void {
        this._isSearching = true;
    }

    public stopSearching(): void {
        this._isSearching = false;
    }
}
