import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-spectrum-analyzer',
    host: { style: 'display: block' },
    templateUrl: './spectrum-analyzer.component.html',
    styleUrls: ['./spectrum-analyzer.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SpectrumAnalyzerComponent {}
