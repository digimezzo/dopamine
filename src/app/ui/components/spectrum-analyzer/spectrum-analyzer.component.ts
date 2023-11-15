import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { SpectrumAnalyzer } from '../../../services/playback/spectrum-analyzer';

@Component({
    selector: 'app-spectrum-analyzer',
    host: { style: 'display: block' },
    templateUrl: './spectrum-analyzer.component.html',
    styleUrls: ['./spectrum-analyzer.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SpectrumAnalyzerComponent implements AfterViewInit {
    public constructor(private spectrumAnalyzer: SpectrumAnalyzer) {}

    public ngAfterViewInit(): void {
        const canvas: HTMLCanvasElement = document.getElementById('spectrumCanvas') as HTMLCanvasElement;
        this.spectrumAnalyzer.attachToCanvas(canvas);
    }
}
