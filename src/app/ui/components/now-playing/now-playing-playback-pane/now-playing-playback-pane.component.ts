import { Component, ViewEncapsulation } from '@angular/core';
import { NowPlayingPage } from '../../../../services/now-playing-navigation/now-playing-page';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { NowPlayingNavigationServiceBase } from '../../../../services/now-playing-navigation/now-playing-navigation.service.base';

@Component({
    selector: 'app-now-playing-playback-pane',
    host: { style: 'display: block' },
    templateUrl: './now-playing-playback-pane.component.html',
    styleUrls: ['./now-playing-playback-pane.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingPlaybackPaneComponent {
    public constructor(
        private navigationService: NavigationServiceBase,
        private nowPlayingNavigationService: NowPlayingNavigationServiceBase,
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
