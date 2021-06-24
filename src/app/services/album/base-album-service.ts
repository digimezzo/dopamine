import { AlbumModel } from './album-model';

export abstract class BaseAlbumService {
    public abstract getAllAlbums(): AlbumModel[];
    public abstract getGenreAlbums(genres: string[]): AlbumModel[];
}
