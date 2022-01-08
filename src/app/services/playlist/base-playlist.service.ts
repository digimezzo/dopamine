import { Observable } from 'rxjs';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistModel } from './playlist-model';

export abstract class BasePlaylistService {
    public abstract playlistsParentFolderPath: string;
    public abstract activePlaylistFolder: PlaylistFolderModel;
    public abstract playlistsChanged$: Observable<void>;
    public abstract setActivePlaylistFolder(selectedPlaylistFolders: PlaylistFolderModel[]): void;
    public abstract getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]>;
    public abstract deletePlaylistAsync(playlist: PlaylistModel): Promise<void>;
    public abstract tryUpdatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string, selectedImagePath: string): Promise<boolean>;
    public abstract getPlaylistsInParentFolder(): Promise<PlaylistModel[]>;
}
