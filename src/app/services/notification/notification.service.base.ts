import { Observable } from 'rxjs';
import { NotificationData } from './notification-data';

export abstract class NotificationServiceBase {
    public abstract showNotification$: Observable<NotificationData>;
    public abstract dismissNotification$: Observable<void>;
    public abstract readonly notificationData: NotificationData | undefined;
    public abstract readonly hasNotificationData: boolean;
    public abstract folderAlreadyAddedAsync(): Promise<void>;
    public abstract refreshing(): Promise<void>;
    public abstract removingTracksAsync(): Promise<void>;
    public abstract updatingTracksAsync(): Promise<void>;
    public abstract addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void>;
    public abstract updatingAlbumArtworkAsync(): Promise<void>;
    public abstract dismiss(): void;
    public abstract dismissDelayedAsync(): Promise<void>;
    public abstract singleTrackAddedToPlaylistAsync(playlistName: string): Promise<void>;
    public abstract multipleTracksAddedToPlaylistAsync(playlistName: string, numberOfAddedTracks: number): Promise<void>;
    public abstract singleTrackAddedToPlaybackQueueAsync(): Promise<void>;
    public abstract multipleTracksAddedToPlaybackQueueAsync(numberOfAddedTracks: number): Promise<void>;
    public abstract lastFmLoginFailedAsync(): Promise<void>;
}
