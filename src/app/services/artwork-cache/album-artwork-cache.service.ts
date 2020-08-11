import { AlbumArtworkCacheId } from './album-artwork-cache-id';
import { BaseAlbumArtworkCacheService } from './base-album-artwork-cache.service';

export class AlbumArtworkCacheService implements BaseAlbumArtworkCacheService {
    public async addArtworkDataToCacheAsync(data: Buffer): Promise<AlbumArtworkCacheId> {
        return null;
    }
}
