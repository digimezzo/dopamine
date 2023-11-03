import { Component, ViewEncapsulation } from '@angular/core';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BaseNowPlayingNavigationService } from '../../../services/now-playing-navigation/base-now-playing-navigation.service';
import { NowPlayingPage } from '../../../services/now-playing-navigation/now-playing-page';

@Component({
    selector: 'app-now-playing-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './now-playing-playback-pane.component.html',
    styleUrls: ['./now-playing-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingPlaybackPaneComponent {
    public constructor(
        private navigationService: BaseNavigationService,
        private nowPlayingNavigationService: BaseNowPlayingNavigationService
    ) {}

    public nowPlayingPageEnum: typeof NowPlayingPage = NowPlayingPage;

    public get currentNowPlayingPage(): NowPlayingPage {
        return this.nowPlayingNavigationService.currentNowPlayingPage;
    }

    public showPlaybackQueue(): void {
        this.navigationService.showPlaybackQueue();
    }

    public navigateToShowcase(): void {
        this.nowPlayingNavigationService.navigate(NowPlayingPage.showcase);
    }

    public navigateToLyrics(): void {
        this.nowPlayingNavigationService.navigate(NowPlayingPage.lyrics);
    }

    public navigateToArtistInformation(): void {
        this.nowPlayingNavigationService.navigate(NowPlayingPage.artistInformation);
    }
}
