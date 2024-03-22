import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Constants } from '../../common/application/constants';
import { StringUtils } from '../../common/utils/string-utils';
import { SearchServiceBase } from './search.service.base';

@Injectable()
export class SearchService implements SearchServiceBase {
    private updateDelayedSearchText: Subject<string> = new Subject<string>();
    private _searchText: string = '';
    private _delayedSearchText: string = '';

    public constructor() {
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
        return !StringUtils.isNullOrWhiteSpace(this.searchText);
    }

    public matchesSearchText(originalText: string, searchText: string): boolean {
        if (StringUtils.isNullOrWhiteSpace(originalText)) {
            return false;
        }

        if (StringUtils.removeAccents(originalText).toLowerCase().includes(searchText.toLowerCase())) {
            return true;
        }

        return false;
    }
}
