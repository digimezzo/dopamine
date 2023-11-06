import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { WindowSize } from '../../../../common/io/window-size';
import { BaseSettings } from '../../../../common/settings/base-settings';
import { ApplicationBase } from '../../../../common/io/application.base';

@Component({
    selector: 'app-now-playing-showcase',
    host: { style: 'display: block' },
    templateUrl: './now-playing-showcase.component.html',
    styleUrls: ['./now-playing-showcase.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingShowcaseComponent implements OnInit {
    public constructor(
        public settings: BaseSettings,
        private application: ApplicationBase,
    ) {}

    public coverArtSize: number = 0;
    public playbackInformationHeight: number = 0;
    public playbackInformationLargeFontSize: number = 0;
    public playbackInformationSmallFontSize: number = 0;

    @HostListener('window:resize')
    public onResize(): void {
        this.setSizes();
    }

    public ngOnInit(): void {
        this.setSizes();
    }

    private setSizes(): void {
        const applicationWindowSize: WindowSize = this.application.getWindowSize();
        const playbackControlsHeight: number = 70;
        const windowControlsHeight: number = 46;
        const horizontalMargin: number = 100;

        const availableWidth: number = applicationWindowSize.width - horizontalMargin;
        const availableHeight: number = applicationWindowSize.height - (playbackControlsHeight + windowControlsHeight);

        const proposedCoverArtSize: number = availableHeight / 2;

        if (proposedCoverArtSize * 3 > availableWidth) {
            this.coverArtSize = availableWidth / 3;
        } else {
            this.coverArtSize = proposedCoverArtSize;
        }

        this.playbackInformationHeight = this.coverArtSize;
        this.playbackInformationLargeFontSize = this.playbackInformationHeight / 5.6;
        this.playbackInformationSmallFontSize = this.playbackInformationLargeFontSize / 2;
    }
}
