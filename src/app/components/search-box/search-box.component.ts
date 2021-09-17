import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSearchService } from '../../services/search/base-search.service';

@Component({
    selector: 'app-search-box',
    host: { style: 'display: block' },
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent implements OnInit {
    constructor(public searchService: BaseSearchService) {}

    public ngOnInit(): void {}

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
