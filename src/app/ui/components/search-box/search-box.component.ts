import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { SearchServiceBase } from '../../../services/search/search.service.base';

@Component({
    selector: 'app-search-box',
    host: { style: 'display: block' },
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent {
    public constructor(public searchService: SearchServiceBase) {}

    private readonly _searchBoxId = 'app-search-box';

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement && event.target.id === this._searchBoxId) {
            if (event.key === 'Escape') {
                this.clearSearchText();
                event.preventDefault();
                event.target.blur();
            }
            return;
        }

        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.code === 'KeyF') {
            const appSearchBox = document.getElementById(this._searchBoxId);
            if (appSearchBox) {
                event.preventDefault();
                (<HTMLInputElement>appSearchBox).focus();
            }
        }
    }

    public clearSearchText(): void {
        this.searchService.searchText = '';
    }
}
