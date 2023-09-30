import { Observable } from 'rxjs';

export abstract class BaseNavigationService {
    public abstract showPlaybackQueueRequested$: Observable<void>;
    public abstract navigateToLoadingAsync(): Promise<void>;
    public abstract navigateToCollectionAsync(): Promise<void>;
    public abstract navigateToSettingsAsync(): Promise<void>;
    public abstract navigateToInformationAsync(): Promise<void>;
    public abstract navigateToWelcomeAsync(): Promise<void>;
    public abstract navigateToManageCollectionAsync(): void;
    public abstract navigateToNowPlayingAsync(): void;
    public abstract showPlaybackQueue(): void;
}
