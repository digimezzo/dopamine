/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
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

    public constructor(
        private spectrumAnalyzer: SpectrumAnalyzer,
        private playbackService: PlaybackServiceBase,
        private playbackInformationService: PlaybackInformationServiceBase,
    ) {}

    public ngAfterViewInit(): void {
        this.spectrumAnalyzer.init('spectrumCanvas');
        // this.subscription.add(
        //     this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
        //         const spectrumAnalyzer = new SpectrumAnalyzer(this.playbackService.audio, 'spectrumCanvas');
        //     }),
        // );
    }
}
