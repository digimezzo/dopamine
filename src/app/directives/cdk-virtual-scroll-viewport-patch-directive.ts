import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Directive, Inject, OnDestroy, OnInit, Self } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

/**
 * A directive that is designed to work alongside CdkVirtualScrollViewport
 * which triggers the viewport size check when the windows is resized.
 */
@Directive({
	selector: 'cdk-virtual-scroll-viewport',
})
export class CdkVirtualScrollViewportPatchDirective implements OnInit, OnDestroy {
	protected readonly destroy$ = new Subject();

	constructor(@Self() @Inject(CdkVirtualScrollViewport) private readonly viewportComponent: CdkVirtualScrollViewport) { }

	ngOnInit() {
		fromEvent(window, 'resize')
			.pipe(
				debounceTime(10),
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.viewportComponent.checkViewportSize();
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}