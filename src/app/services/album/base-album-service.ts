import { AlbumModel } from './album-model';

export abstract class BaseAlbumService {
    public abstract getAllAlbums(): AlbumModel[];
    public abstract getAlbumsForArtists(artists: string[]): AlbumModel[];
    public abstract getAlbumsForGenres(genres: string[]): AlbumModel[];
}
