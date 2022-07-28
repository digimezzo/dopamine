import { v4 as uuidv4 } from 'uuid';

export class AlbumArtworkCacheId {
    public constructor() {
        this.id = `album-${uuidv4()}`;
    }

    public readonly id: string;
}
