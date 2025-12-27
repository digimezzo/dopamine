import { Observable } from 'rxjs';

export abstract class NavigationServiceBase {
    public abstract showPlaybackQueueRequested$: Observable<void>;
    public abstract refreshPlaybackQueueListRequested$: Observable<void>;
    public abstract navigateToLoadingAsync(): Promise<void>;
    public abstract navigateToCollectionAsync(): Promise<void>;
    public abstract navigateToSettingsAsync(): Promise<void>;
    public abstract navigateToInformationAsync(): Promise<void>;
    public abstract navigateToWelcomeAsync(): Promise<void>;
    public abstract navigateToManageCollectionAsync(): Promise<void>;
    public abstract navigateToNowPlayingAsync(): Promise<void>;
    public abstract navigateToHighlightsAsync(): Promise<void>;
    public abstract navigateToCoverPlayerAsync(): Promise<void>;
    public abstract showPlaybackQueue(): void;
    public abstract refreshPlaybackQueueList(): void;
}
