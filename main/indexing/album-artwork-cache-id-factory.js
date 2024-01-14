const { AlbumArtworkCacheId } = require('./album-artwork-cache-id');

class AlbumArtworkCacheIdFactory {
    static create() {
        return new AlbumArtworkCacheId();
    }
}

exports.AlbumArtworkCacheIdFactory = AlbumArtworkCacheIdFactory;
