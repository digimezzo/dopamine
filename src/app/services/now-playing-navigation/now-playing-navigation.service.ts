import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseNowPlayingNavigationService } from './base-now-playing-navigation.service';
import { NowPlayingPage } from './now-playing-page';

@Injectable()
export class NowPlayingNavigationService implements BaseNowPlayingNavigationService {
    private navigated: Subject<NowPlayingPage> = new Subject();
    private _currentNowPlayingPage: NowPlayingPage = NowPlayingPage.showcase;

    public get currentNowPlayingPage(): NowPlayingPage {
        return this._currentNowPlayingPage;
    }

    public navigated$: Observable<NowPlayingPage> = this.navigated.asObservable();

    public navigate(nowPlayingPage: NowPlayingPage) {
        this._currentNowPlayingPage = nowPlayingPage;
        this.navigated.next(nowPlayingPage);
    }
}
