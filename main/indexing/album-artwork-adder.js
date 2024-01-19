const { TrackRepository } = require('../data/track-repository');
const { Logger } = require('../common/logger');
const { AlbumArtworkRepository } = require('../data/entities/album-artwork-repository');
const { AlbumArtworkGetter } = require('./album-artwork-getter');
const { FileMetadataFactory } = require('./file-metadata.factory');
const { AlbumArtwork } = require('../data/entities/album-artwork');
const { AlbumArtworkCache } = require('./album-artwork-cache');
const { UpdatingAlbumArtworkMessage } = require('./messages/updating-album-artwork-message');
const { WorkerProxy } = require('../workers/worker-proxy');

class AlbumArtworkAdder {
    static async addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        try {
            const albumDataThatNeedsIndexing = TrackRepository.getAlbumDataThatNeedsIndexing() ?? [];

            if (albumDataThatNeedsIndexing.length === 0) {
                Logger.info(
                    `Found no album data that needs indexing`,
                    'AlbumArtworkAdder',
                    'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            Logger.info(
                `Found ${albumDataThatNeedsIndexing.length} album data that needs indexing`,
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            const numberOfAlbumArtwork = AlbumArtworkRepository.getNumberOfAlbumArtwork();

            // Only show message the first time that album artwork is added
            if (numberOfAlbumArtwork === 0) {
                WorkerProxy.postMessage(new UpdatingAlbumArtworkMessage());
            }

            for (const albumData of albumDataThatNeedsIndexing) {
                try {
                    await this.#addAlbumArtworkAsync(albumData.albumKey);
                } catch (e) {
                    Logger.error(
                        e,
                        `Could not add album artwork for albumKey=${albumData.albumKey}`,
                        'AlbumArtworkAdder',
                        'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                    );
                }
            }
        } catch (e) {
            Logger.error(
                e,
                'Could not add album artwork for tracks that need album artwork indexing',
                'AlbumArtworkAdder',
                'addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    static async #addAlbumArtworkAsync(albumKey) {
        const track = TrackRepository.getLastModifiedTrackForAlbumKeyAsync(albumKey);

        if (track === undefined || track === null) {
            return;
        }

        let albumArtwork;

        try {
            const fileMetadata = FileMetadataFactory.create(track.path);
            albumArtwork = await AlbumArtworkGetter.getAlbumArtworkAsync(fileMetadata, true);
        } catch (e) {
            Logger.error(e, `Could not create file metadata for path='${track.path}'`, 'AlbumArtworkAdder', 'addAlbumArtworkAsync');
        }

        if (albumArtwork === undefined || albumArtwork === null) {
            return;
        }

        const albumArtworkCacheId = await AlbumArtworkCache.addArtworkDataToCacheAsync(albumArtwork);

        if (albumArtworkCacheId === undefined || albumArtworkCacheId === null) {
            return;
        }

        TrackRepository.disableNeedsAlbumArtworkIndexing(albumKey);
        const newAlbumArtwork = new AlbumArtwork(albumKey, albumArtworkCacheId.id);
        AlbumArtworkRepository.addAlbumArtwork(newAlbumArtwork);
    }
}

exports.AlbumArtworkAdder = AlbumArtworkAdder;
