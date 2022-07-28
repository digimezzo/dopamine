import { Observable } from 'rxjs';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { GenreModel } from '../genre/genre-model';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { PlaylistModel } from './playlist-model';

export abstract class BasePlaylistService {
    public abstract hasActivePlaylistFolder: boolean;
    public abstract playlistsParentFolderPath: string;
    public abstract activePlaylistFolder: PlaylistFolderModel;
    public abstract playlistsChanged$: Observable<void>;
    public abstract playlistTracksChanged$: Observable<void>;
    public abstract setActivePlaylistFolder(selectedPlaylistFolders: PlaylistFolderModel[]): void;
    public abstract getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]>;
    public abstract deletePlaylistAsync(playlist: PlaylistModel): Promise<void>;
    public abstract updatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string, selectedImagePath: string): Promise<void>;
    public abstract getPlaylistsInParentFolder(): Promise<PlaylistModel[]>;
    public abstract getTracksAsync(playlists: PlaylistModel[]): Promise<TrackModels>;
    public abstract addArtistsToPlaylistAsync(playlistPath: string, playlistName: string, artistsToAdd: ArtistModel[]): Promise<void>;
    public abstract addGenresToPlaylistAsync(playlistPath: string, playlistName: string, genresToAdd: GenreModel[]): Promise<void>;
    public abstract addAlbumsToPlaylistAsync(playlistPath: string, playlistName: string, albumsToAdd: AlbumModel[]): Promise<void>;
    public abstract addTracksToPlaylistAsync(playlistPath: string, playlistName: string, tracksToAdd: TrackModel[]): Promise<void>;
    public abstract removeTracksFromPlaylistsAsync(tracksToRemove: TrackModel[]): Promise<void>;
    public abstract updatePlaylistOrderAsync(tracks: TrackModel[]): Promise<void>;
}
