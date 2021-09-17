import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Constants } from '../../common/application/constants';
import { Strings } from '../../common/strings';
import { BaseSearchService } from './base-search.service';

@Injectable()
export class SearchService implements BaseSearchService {
    private updateDelayedSearchText: Subject<string> = new Subject<string>();
    private _isSearching: boolean = false;
    private _searchText: string = '';
    private _delayedSearchText: string = '';

    constructor() {
        this.updateDelayedSearchText
            .pipe(debounceTime(Constants.searchDelayMilliseconds), distinctUntilChanged())
            .subscribe((searchText) => {
                this._delayedSearchText = searchText;
            });
    }

    public get searchText(): string {
        return this._searchText;
    }

    public set searchText(v: string) {
        this._searchText = v;
        this.updateDelayedSearchText.next(v);
    }

    public get delayedSearchText(): string {
        return this._delayedSearchText;
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

    public matchesSearchText(originalText: string, searchText: string): boolean {
        if (Strings.isNullOrWhiteSpace(originalText)) {
            return false;
        }

        if (Strings.removeAccents(originalText).toLowerCase().includes(searchText.toLowerCase())) {
            return true;
        }

        return false;
    }
}
