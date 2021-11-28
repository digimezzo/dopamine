import { Observable } from 'rxjs';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistModel } from './playlist-model';

export abstract class BasePlaylistService {
    public abstract playlistFoldersChanged$: Observable<void>;
    public abstract createPlaylistFolder(playlistFolderName: string): void;
    public abstract getPlaylistFoldersAsync(): Promise<PlaylistFolderModel[]>;
    public abstract deletePlaylistFolder(playlistFolder: PlaylistFolderModel): void;
    public abstract renamePlaylistFolder(playlistFolder: PlaylistFolderModel, newName: string): void;
    public abstract getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]>;
}
