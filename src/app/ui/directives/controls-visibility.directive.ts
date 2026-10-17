import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { BehaviorSubject, Subscription } from 'rxjs';

@Directive({
    selector: '[appControlsHidden]',
})
export class ControlsVisibilityDirective {
    public readonly hidden$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @Input()
    public set appControlsHidden(hidden: boolean) {
        this.hidden$.next(hidden);
    }
}

// Tooltips live in an overlay outside the fading controls, including those in child components.
@Directive({
    selector: '[matTooltip]',
})
export class ControlTooltipDirective implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        private tooltip: MatTooltip,
        @Optional() private controlsVisibility: ControlsVisibilityDirective | null,
    ) {}

    public ngOnInit(): void {
        if (this.controlsVisibility) {
            this.subscription = this.controlsVisibility.hidden$.subscribe((hidden) => {
                this.tooltip.disabled = hidden;
            });
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
