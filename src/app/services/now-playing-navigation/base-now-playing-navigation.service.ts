import { Observable } from 'rxjs';
import { NowPlayingPage } from './now-playing-page';

export abstract class BaseNowPlayingNavigationService {
    public abstract navigated$: Observable<NowPlayingPage>;
    public abstract readonly currentNowPlayingPage: NowPlayingPage;
    public abstract navigate(nowPlayingPage: NowPlayingPage);
}
