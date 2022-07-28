import { AlbumArtwork } from '../entities/album-artwork';

export abstract class BaseAlbumArtworkRepository {
    public abstract getNumberOfAlbumArtwork(): number;
    public abstract getNumberOfAlbumArtworkThatHasNoTrack(): number;
    public abstract deleteAlbumArtworkThatHasNoTrack(): number;
    public abstract addAlbumArtwork(albumArtwork: AlbumArtwork): void;
    public abstract getArtworkId(albumKey: string): string;
    public abstract getAllAlbumArtwork(): AlbumArtwork[];
    public abstract getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number;
    public abstract deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number;
}
