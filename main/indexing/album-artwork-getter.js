class AlbumArtworkGetter {
    constructor(embeddedAlbumArtworkGetter, externalAlbumArtworkGetter, onlineAlbumArtworkGetter, workerProxy) {
        this.embeddedAlbumArtworkGetter = embeddedAlbumArtworkGetter;
        this.externalAlbumArtworkGetter = externalAlbumArtworkGetter;
        this.onlineAlbumArtworkGetter = onlineAlbumArtworkGetter;
        this.workerProxy = workerProxy;
    }

    async getAlbumArtworkAsync(fileMetadata, getOnlineArtwork) {
        const embeddedArtwork = this.embeddedAlbumArtworkGetter.getEmbeddedArtwork(fileMetadata);

        if (embeddedArtwork !== undefined && embeddedArtwork !== null) {
            return embeddedArtwork;
        }

        const externalArtwork = await this.externalAlbumArtworkGetter.getExternalArtworkAsync(fileMetadata);

        if (externalArtwork !== undefined && externalArtwork !== null) {
            return externalArtwork;
        }

        if (getOnlineArtwork && this.workerProxy.downloadMissingAlbumCovers()) {
            const onlineArtwork = await this.onlineAlbumArtworkGetter.getOnlineArtworkAsync(fileMetadata);

            if (onlineArtwork !== undefined && onlineArtwork !== null) {
                return onlineArtwork;
            }
        }

        return undefined;
    }
}

exports.AlbumArtworkGetter = AlbumArtworkGetter;
