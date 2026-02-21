import { PlaylistModel } from '../playlist/playlist-model';
import { TrackModel } from '../track/track-model';

export abstract class DialogServiceBase {
    public abstract showConfirmationDialogAsync(dialogTitle: string, dialogText: string): Promise<boolean>;
    public abstract showInputDialogAsync(
        dialogTitle: string,
        placeHolderText: string,
        inputText: string,
        invalidCharacters: string[],
    ): Promise<string>;
    public abstract showErrorDialog(errorText: string): void;
    public abstract showInfoDialog(infoText: string): void;
    public abstract showLicenseDialog(): void;
    public abstract showEditPlaylistDialogAsync(playlist: PlaylistModel): Promise<void>;
    public abstract showCreatePlaylistDialogAsync(): Promise<void>;
    public abstract showEditColumnsDialogAsync(): Promise<void>;
    public abstract showEditTracksAsync(tracks: TrackModel[]): Promise<boolean>;
    public abstract cannotPlayM4aFileAsync(): Promise<void>;
    public abstract cannotPlayAudioFileAsync(): Promise<void>;
}
