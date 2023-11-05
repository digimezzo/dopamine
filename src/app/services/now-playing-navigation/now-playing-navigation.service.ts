import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NowPlayingPage } from './now-playing-page';
import {NowPlayingNavigationServiceBase} from "./now-playing-navigation.service.base";

@Injectable()
export class NowPlayingNavigationService implements NowPlayingNavigationServiceBase {
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
