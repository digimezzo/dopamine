import { Observable } from 'rxjs';

export abstract class BaseNavigationService {
    public abstract showPlaybackQueueRequested$: Observable<void>;
    public abstract navigateToLoading(): void;
    public abstract navigateToCollection(): void;
    public abstract navigateToSettings(): void;
    public abstract navigateToInformation(): void;
    public abstract navigateToWelcome(): void;
    public abstract navigateToManageCollection(): void;
    public abstract navigateToNowPlaying(): void;
    public abstract showPlaybackQueue(): void;
}
