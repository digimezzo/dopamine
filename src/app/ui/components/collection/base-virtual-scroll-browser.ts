import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { ScrollPositionService } from '../../../services/scroll-position/scroll-position.service';
import { SearchServiceBase } from '../../../services/search/search.service.base';

export abstract class BaseVirtualScrollBrowser {
    private hasRestoredScrollPosition: boolean = false;
    private hasSubscribedToViewPort: boolean = false;
    private lastScrollPosition: number = 0;
    private readonly scrollPositionSubscription: Subscription = new Subscription();

    protected constructor(
        private scrollPositionService: ScrollPositionService,
        private scrollSearchService: SearchServiceBase,
    ) {}

    protected initializeScrollPosition(viewPort: CdkVirtualScrollViewport, scrollPositionKey: string, resetOnSearch: boolean = true): void {
        this.lastScrollPosition = this.scrollPositionService.getScrollPosition(scrollPositionKey);
        this.subscribeToViewPort(viewPort, scrollPositionKey, resetOnSearch);
    }

    protected restoreScrollPosition(
        viewPort: CdkVirtualScrollViewport,
        scrollPositionKey: string,
        hasItems: boolean,
        resetOnSearch: boolean = true,
    ): void {
        // The viewport can appear later than ngAfterViewInit (e.g. behind an empty-state *ngIf),
        // so keep trying to subscribe to it here too.
        this.subscribeToViewPort(viewPort, scrollPositionKey, resetOnSearch);

        if (this.hasRestoredScrollPosition || viewPort == undefined || !hasItems) {
            return;
        }

        setTimeout(() => {
            if (viewPort == undefined) {
                return;
            }

            viewPort.scrollToOffset(this.lastScrollPosition);
            this.hasRestoredScrollPosition = true;
        }, 0);
    }

    protected disposeScrollPosition(scrollPositionKey: string): void {
        this.scrollPositionService.setScrollPosition(scrollPositionKey, this.lastScrollPosition);
        this.scrollPositionSubscription.unsubscribe();
    }

    private subscribeToViewPort(viewPort: CdkVirtualScrollViewport, scrollPositionKey: string, resetOnSearch: boolean): void {
        if (this.hasSubscribedToViewPort || viewPort == undefined) {
            return;
        }

        this.hasSubscribedToViewPort = true;

        this.scrollPositionSubscription.add(viewPort.elementScrolled().subscribe(() => this.saveScrollPosition(viewPort, scrollPositionKey)));

        if (resetOnSearch) {
            // Scroll positions no longer make sense once the list is filtered down by a search.
            this.scrollPositionSubscription.add(
                this.scrollSearchService.delayedSearchTextChanged$.subscribe(() => viewPort.scrollToOffset(0)),
            );
        }
    }

    private saveScrollPosition(viewPort: CdkVirtualScrollViewport, scrollPositionKey: string): void {
        this.lastScrollPosition = viewPort.measureScrollOffset();
        this.scrollPositionService.setScrollPosition(scrollPositionKey, this.lastScrollPosition);
    }
}