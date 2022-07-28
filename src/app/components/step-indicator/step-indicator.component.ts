import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-step-indicator',
    host: { style: 'display: block' },
    templateUrl: './step-indicator.component.html',
    styleUrls: ['./step-indicator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class StepIndicatorComponent implements OnInit {
    constructor() {}

    public totalStepsCollection: number[];

    @Input()
    public totalSteps: number;
    @Input()
    public currentStep: number;

    public ngOnInit(): void {
        this.totalStepsCollection = Array(this.totalSteps)
            .fill(1)
            .map((x, i) => i);
    }
}
