import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { NowPlayingPage } from './now-playing-page';
import { NowPlayingNavigationServiceBase } from './now-playing-navigation.service.base';
import { PlaybackInformationServiceBase } from '../playback-information/playback-information.service.base';
import { PlaybackInformation } from '../playback-information/playback-information';
import { PromiseUtils } from '../../common/utils/promise-utils';

@Injectable()
export class NowPlayingNavigationService implements NowPlayingNavigationServiceBase {
    private navigated: Subject<NowPlayingPage> = new Subject();
    private _currentNowPlayingPage: NowPlayingPage = NowPlayingPage.nothingPlaying;
    private subscription: Subscription = new Subscription();

    public constructor(private playbackInformationService: PlaybackInformationServiceBase) {
        this.initializeSubscriptions();
        PromiseUtils.noAwait(this.setCurrentNowPlayingPageAsync());
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe(() => {
                this.navigateToShowcaseIfNeeded();
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe(() => {
                this.navigateToShowcaseIfNeeded();
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe(() => {
                this.navigateToNothingPlaying();
            }),
        );
    }

    public get currentNowPlayingPage(): NowPlayingPage {
        return this._currentNowPlayingPage;
    }

    public navigated$: Observable<NowPlayingPage> = this.navigated.asObservable();

    public navigate(nowPlayingPage: NowPlayingPage) {
        this._currentNowPlayingPage = nowPlayingPage;
        this.navigated.next(nowPlayingPage);
    }

    private navigateToShowcaseIfNeeded() {
        if (this._currentNowPlayingPage !== NowPlayingPage.nothingPlaying) {
            return;
        }

        this.navigate(NowPlayingPage.showcase);
    }

    private navigateToNothingPlaying() {
        this.navigate(NowPlayingPage.nothingPlaying);
    }

    private async setCurrentNowPlayingPageAsync(): Promise<void> {
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();

        if (currentPlaybackInformation.track != undefined) {
            this.navigate(NowPlayingPage.showcase);
        } else {
            this.navigate(NowPlayingPage.nothingPlaying);
        }
    }
}
