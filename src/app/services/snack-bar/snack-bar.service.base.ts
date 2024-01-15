import { Observable } from 'rxjs';

export abstract class SnackBarServiceBase {
    public abstract showNotification$: Observable<void>;
    public abstract dismissNotification$: Observable<void>;
    public abstract readonly mustShowNotification: boolean;
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
