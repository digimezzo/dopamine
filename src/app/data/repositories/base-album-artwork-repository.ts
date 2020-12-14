import { AlbumArtwork } from '../entities/album-artwork';

export abstract class BaseAlbumArtworkRepository {
    public abstract deleteAlbumArtwork(albumKey: string): void;
    public abstract addAlbumArtwork(albumArtwork: AlbumArtwork): void;
    public abstract getArtworkId(albumKey: string): string;
    public abstract getAlbumArtworksThatHaveNoTrack(): AlbumArtwork[];
}
