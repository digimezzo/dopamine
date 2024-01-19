const { EmbeddedAlbumArtworkGetter } = require('./embedded-album-artwork-getter');
const { ExternalAlbumArtworkGetter } = require('./external-album-artwork-getter');
const { OnlineAlbumArtworkGetter } = require('./online-album-artwork-getter');
const { WorkerProxy } = require('../workers/worker-proxy');

class AlbumArtworkGetter {
    static async getAlbumArtworkAsync(fileMetadata, getOnlineArtwork) {
        const embeddedArtwork = EmbeddedAlbumArtworkGetter.getEmbeddedArtwork(fileMetadata);

        if (embeddedArtwork !== undefined && embeddedArtwork !== null) {
            return embeddedArtwork;
        }

        const externalArtwork = await ExternalAlbumArtworkGetter.getExternalArtworkAsync(fileMetadata);

        if (externalArtwork !== undefined && externalArtwork !== null) {
            return externalArtwork;
        }

        if (getOnlineArtwork && WorkerProxy.downloadMissingAlbumCovers()) {
            const onlineArtwork = await OnlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetadata);

            if (onlineArtwork !== undefined && onlineArtwork !== null) {
                return onlineArtwork;
            }
        }

        return undefined;
    }
}

exports.AlbumArtworkGetter = AlbumArtworkGetter;
