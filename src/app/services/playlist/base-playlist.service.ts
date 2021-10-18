import { PlaylistFolderModel } from './playlist-folder-model';

export abstract class BasePlaylistService {
    public abstract createPlaylistFolder(playlistFolderName: string): void;
    public abstract getPlaylistFolders(): PlaylistFolderModel[];
}
