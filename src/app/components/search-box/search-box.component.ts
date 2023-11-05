import { Component, ViewEncapsulation } from '@angular/core';
import {SearchServiceBase} from "../../services/search/search.service.base";

@Component({
    selector: 'app-search-box',
    host: { style: 'display: block' },
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent {
    public constructor(public searchService: SearchServiceBase) {}

    public onBlur(): void {
        this.searchService.stopSearching();
    }

    public onFocus(): void {
        this.searchService.startSearching();
    }

    public clearSearchText(): void {
        this.searchService.searchText = '';
    }
}
