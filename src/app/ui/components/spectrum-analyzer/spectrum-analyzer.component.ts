import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { Subscription } from 'rxjs';
import { PlaybackInformationServiceBase } from '../../../services/playback-information/playback-information.service.base';
import { SpectrumAnalyzer } from './spectrum-analyzer';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';

@Component({
    selector: 'app-spectrum-analyzer',
    host: { style: 'display: block' },
    templateUrl: './spectrum-analyzer.component.html',
    styleUrls: ['./spectrum-analyzer.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SpectrumAnalyzerComponent implements AfterViewInit {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: PlaybackServiceBase,
        private playbackInformationService: PlaybackInformationServiceBase,
    ) {}

    public ngAfterViewInit(): void {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                const canvasId = 'yourCanvasId'; // Replace with the ID of your canvas element

                const spectrumAnalyzer = new SpectrumAnalyzer(this.playbackService.audio, canvasId);
            }),
        );
    }
}
