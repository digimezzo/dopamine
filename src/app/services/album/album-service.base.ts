import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';
import { ArtistModel } from '../artist/artist-model';

export abstract class AlbumServiceBase {
    public abstract getAllAlbums(): AlbumModel[];
    public abstract getAlbumsForArtists(artists: ArtistModel[], artistType: ArtistType): AlbumModel[];
    public abstract getAlbumsForGenres(genres: string[]): AlbumModel[];
    public abstract getMostPlayedAlbums(numberOfAlbums: number): AlbumModel[];
}