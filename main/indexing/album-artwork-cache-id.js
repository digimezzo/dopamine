const { GuidFactory } = require('../common/guid-factory');

class AlbumArtworkCacheId {
    constructor() {
        this.id = `album-${GuidFactory.create()}`;
    }
}

exports.AlbumArtworkCacheId = AlbumArtworkCacheId;
