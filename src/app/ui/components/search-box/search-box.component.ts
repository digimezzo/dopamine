import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { DocumentProxy } from '../../../common/io/document-proxy';

@Component({
    selector: 'app-search-box',
    host: { style: 'display: block' },
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBoxComponent {
    @ViewChild('appSearchBox') public appSearchBoxRef?: ElementRef<HTMLInputElement>;

    public constructor(
        public searchService: SearchServiceBase,
        private documentProxy: DocumentProxy,
    ) {}

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        const input = this.appSearchBoxRef?.nativeElement;
        if (!input) {
            return;
        }

        if (this.isSearchBoxFocused(input)) {
            this.handleSearchBoxKeys(event, input);
            return;
        }

        if (this.isSearchShortcut(event)) {
            this.focusSearchBox(event, input);
        }
    }

    public clearSearchText(): void {
        this.searchService.searchText = '';
    }

    private isSearchBoxFocused(input: HTMLInputElement): boolean {
        return input === this.documentProxy.getActiveElement();
    }

    private handleSearchBoxKeys(event: KeyboardEvent, input: HTMLInputElement): void {
        if (event.key === 'Escape') {
            this.clearSearchText();
            event.preventDefault();
            input.blur();
        }
    }

    private isSearchShortcut(event: KeyboardEvent): boolean {
        return (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.code === 'KeyF';
    }

    private focusSearchBox(event: KeyboardEvent, input: HTMLInputElement): void {
        event.preventDefault();
        input.focus();
    }
}
