import { AlbumModel } from './album-model';

export abstract class BaseAlbumService {
    public abstract getAllAlbums(): AlbumModel[];
}
