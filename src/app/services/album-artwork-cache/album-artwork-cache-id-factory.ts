import { Injectable } from '@angular/core';
import { GuidFactory } from '../../common/guid.factory';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

@Injectable({ providedIn: 'root' })
export class AlbumArtworkCacheIdFactory {
    public constructor(private guidFactory: GuidFactory) {}

    public create(): AlbumArtworkCacheId {
        return new AlbumArtworkCacheId(this.guidFactory);
    }
}
