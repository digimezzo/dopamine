import { AlbumArtwork } from '../entities/album-artwork';

export abstract class AlbumArtworkRepositoryBase {
    public abstract getNumberOfAlbumArtworkAsync(): Promise<number>;
    public abstract getNumberOfAlbumArtworkThatHasNoTrackAsync(albumKeyIndex: string): Promise<number>;
    public abstract deleteAlbumArtworkThatHasNoTrackAsync(albumKeyIndex: string): Promise<number>;
    public abstract addAlbumArtworkAsync(albumArtwork: AlbumArtwork): Promise<void>;
    public abstract getAllAlbumArtworkAsync(): Promise<AlbumArtwork[] | undefined>;
    public abstract getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(albumKeyIndex: string): Promise<number>;
    public abstract deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(albumKeyIndex: string): Promise<number>;
}
