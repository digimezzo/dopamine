import { CreatePlaylistFolderResult } from './create-playlist-folder-result';

export abstract class BasePlaylistService {
    public abstract createPlaylistFolder(playlistFolderName: string): CreatePlaylistFolderResult;
}
