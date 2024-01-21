const { AlbumArtwork } = require('../data/entities/album-artwork');
const { UpdatingAlbumArtworkMessage } = require('./messages/updating-album-artwork-message');

class AlbumArtworkAdder {
    constructor(trackRepository, albumArtworkRepository, albumArtworkGetter, fileMetadataFactory, albumArtworkCache, workerProxy, logger) {
        this.trackRepository = trackRepository;
        this.albumArtworkRepository = albumArtworkRepository;
        this.albumArtworkGetter = albumArtworkGetter;
        this.fileMetadataFactory = fileMetadataFactory;
        this.albumArtworkCache = albumArtworkCache;
        this.workerProxy = workerProxy;
        this.logger = logger;
    }
    async addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        try {
            const albumDataThatNeedsIndexing = this.trackRepository.getAlbumDataThatNeedsIndexing() ?? [];

            if (albumDataThatNeedsIndexing.length === 0) {
                this.logger.info(
                    `Found no album data that needs indexing`,
                    'AlbumArtworkAdder',
                    'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${albumDataThatNeedsIndexing.length} album data that needs indexing`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            const numberOfAlbumArtwork = this.albumArtworkRepository.getNumberOfAlbumArtwork();

            // Only show message the first time that album artwork is added
            if (numberOfAlbumArtwork === 0) {
                this.workerProxy.postMessage(new UpdatingAlbumArtworkMessage());
            }

            for (const albumData of albumDataThatNeedsIndexing) {
                try {
                    await this.#addAlbumArtworkAsync(albumData.albumKey);
                } catch (e) {
                    this.logger.error(
                        e,
                        `Could not add album artwork for albumKey=${albumData.albumKey}`,
                        'AlbumArtworkAdder',
                        'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                e,
                'Could not add album artwork for tracks that need album artwork indexing',
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    async #addAlbumArtworkAsync(albumKey) {
        const track = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKey);

        if (track === undefined || track === null) {
            return;
        }

        let albumArtwork;

        try {
            const fileMetadata = this.fileMetadataFactory.create(track.path);
            albumArtwork = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetadata, true);
        } catch (e) {
            this.logger.error(e, `Could not create file metadata for path='${track.path}'`, 'AlbumArtworkAdder', 'addAlbumArtworkAsync');
        }

        if (albumArtwork === undefined || albumArtwork === null) {
            return;
        }

        const albumArtworkCacheId = await this.albumArtworkCache.addArtworkDataToCacheAsync(albumArtwork);

        if (albumArtworkCacheId === undefined || albumArtworkCacheId === null) {
            return;
        }

        this.trackRepository.disableNeedsAlbumArtworkIndexing(albumKey);
        const newAlbumArtwork = new AlbumArtwork(albumKey, albumArtworkCacheId.id);
        this.albumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
    }
}

exports.AlbumArtworkAdder = AlbumArtworkAdder;
