import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';
import { ArtistModel } from '../artist/artist-model';

export abstract class AlbumServiceBase {
    public abstract getAllAlbumsAsync(): Promise<AlbumModel[]>;
    public abstract getAlbumsForArtistsAsync(artists: ArtistModel[], artistType: ArtistType): Promise<AlbumModel[]>;
    public abstract getAlbumsForGenresAsync(genres: string[]): Promise<AlbumModel[]>;
}
