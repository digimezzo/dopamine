import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { AudioVisualizer } from '../../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../../common/io/document-proxy';

@Component({
    selector: 'app-cover-player',
    host: { style: 'display: block' },
    templateUrl: './dopamp-player.component.html',
    styleUrls: ['./dopamp-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DopampPlayerComponent implements OnInit, AfterViewInit {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
    ) {}

    public ngAfterViewInit(): void {
        this.setAudioVisualizer();
    }

    public ngOnInit(): void {}

    public openPlaybackQueue(): void {}

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('dopampPlayerAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }
}
