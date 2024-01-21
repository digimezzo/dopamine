const { AlbumArtworkCacheId } = require('./album-artwork-cache-id');

class AlbumArtworkCacheIdFactory {
    constructor(guidFactory) {
        this.guidFactory = guidFactory;
        this.id = `album-${guidFactory.create()}`;
    }

    create() {
        return new AlbumArtworkCacheId(this.guidFactory);
    }
}

exports.AlbumArtworkCacheIdFactory = AlbumArtworkCacheIdFactory;
