class AlbumArtworkCacheId {
    constructor(guidFactory) {
        this.id = `album-${guidFactory.create()}`;
    }
}

exports.AlbumArtworkCacheId = AlbumArtworkCacheId;
