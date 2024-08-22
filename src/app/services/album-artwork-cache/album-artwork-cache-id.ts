import { GuidFactory } from '../../common/guid.factory';

export class AlbumArtworkCacheId {
    public constructor(guidFactory: GuidFactory) {
        this.id = `album-${guidFactory.create()}`;
    }

    public readonly id: string;
}