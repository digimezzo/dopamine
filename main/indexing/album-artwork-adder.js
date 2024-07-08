const { AlbumArtwork } = require('../data/entities/album-artwork');
const { UpdatingAlbumArtworkMessage } = require('./messages/updating-album-artwork-message');
const { MathUtils } = require('../common/utils/math-utils');

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
            this.logger.info(
                `Adding album artwork for albumKeyIndex: '${this.workerProxy.albumKeyIndex()}'`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            const albumDataThatNeedsIndexing = this.trackRepository.getAlbumDataThatNeedsIndexing(this.workerProxy.albumKeyIndex()) ?? [];

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

            // Only show message the first time that album artwork is added or if there are more than 20 albums that need indexing
            if (numberOfAlbumArtwork === 0 || albumDataThatNeedsIndexing.length > 20) {
                this.workerProxy.postMessage(new UpdatingAlbumArtworkMessage());
            }

            const loggedPercentages = new Set();

            for (let i = 0; i < albumDataThatNeedsIndexing.length; i++) {
                try {
                    await this.#addAlbumArtworkAsync(this.workerProxy.albumKeyIndex(), albumDataThatNeedsIndexing[i].albumKey);

                    const percentage = MathUtils.calculatePercentage(i + 1, albumDataThatNeedsIndexing.length);

                    if ((percentage % 10 === 0 || percentage === 100) && !loggedPercentages.has(percentage)) {
                        this.logger.info(
                            `Added ${i + 1} album artwork`,
                            'AlbumArtworkAdder',
                            'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                        );
                        loggedPercentages.add(percentage);
                    }
                } catch (e) {
                    this.logger.error(
                        e,
                        `Could not add album artwork for albumKey=${albumDataThatNeedsIndexing[i].albumKey}`,
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

    async #addAlbumArtworkAsync(albumKeyIndex, albumKey) {
        const track = this.trackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKeyIndex, albumKey);

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
