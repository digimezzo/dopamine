import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';

export abstract class BaseAlbumService {
    public abstract getAllAlbums(): AlbumModel[];
    public abstract getAlbumsForArtists(artists: string[], artistType: ArtistType): AlbumModel[];
    public abstract getAlbumsForGenres(genres: string[]): AlbumModel[];
}
