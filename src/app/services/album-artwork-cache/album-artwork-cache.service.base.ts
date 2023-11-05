import { AlbumArtworkCacheId } from './album-artwork-cache-id';

export abstract class AlbumArtworkCacheServiceBase {
    public abstract addArtworkDataToCacheAsync(data: Buffer): Promise<AlbumArtworkCacheId | undefined>;
    public abstract removeArtworkDataFromCacheAsync(albumKey: string): Promise<void>;
}
