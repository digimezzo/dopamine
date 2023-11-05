import { Observable } from 'rxjs';
import { NowPlayingPage } from './now-playing-page';

export abstract class NowPlayingNavigationServiceBase {
    public abstract navigated$: Observable<NowPlayingPage>;
    public abstract readonly currentNowPlayingPage: NowPlayingPage;
    public abstract navigate(nowPlayingPage: NowPlayingPage);
}
