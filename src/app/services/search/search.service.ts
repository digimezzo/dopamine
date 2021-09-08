import { Injectable } from '@angular/core';
import { Strings } from '../../common/strings';
import { BaseSearchService } from './base-search.service';

@Injectable()
export class SearchService implements BaseSearchService {
    private _isSearching: boolean = false;
    private _searchText: string = '';

    constructor() {}

    public get searchText(): string {
        return this._searchText;
    }
    public set searchText(v: string) {
        this._searchText = v;
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
