import { Injectable } from '@angular/core';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

@Injectable()
export class AlbumArtworkCacheIdFactory {
    public create(): AlbumArtworkCacheId {
        return new AlbumArtworkCacheId();
    }
}
