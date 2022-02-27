import { Observable } from 'rxjs';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { GenreModel } from '../genre/genre-model';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
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
    public abstract getTracksAsync(playlists: PlaylistModel[]): Promise<TrackModels>;
    public abstract addArtistsToPlaylist(playlistPath: string, artists: ArtistModel[]): void;
    public abstract addGenresToPlaylist(playlistPath: string, genres: GenreModel[]): void;
    public abstract addAlbumsToPlaylist(playlistPath: string, albums: AlbumModel[]): void;
    public abstract addTracksToPlaylist(playlistPath: string, tracks: TrackModel[]): void;
}
