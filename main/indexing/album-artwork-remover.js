const { Timer } = require('../common/scheduling/timer');
const { UpdatingAlbumArtworkMessage } = require('./messages/updating-album-artwork-message');

class AlbumArtworkRemover {
    constructor(albumArtworkRepository, applicationPaths, workerProxy, fileAccess, logger) {
        this.albumArtworkRepository = albumArtworkRepository;
        this.applicationPaths = applicationPaths;
        this.workerProxy = workerProxy;
        this.fileAccess = fileAccess;
        this.logger = logger;
    }

    async removeAlbumArtworkThatHasNoTrackAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove = this.albumArtworkRepository.getNumberOfAlbumArtworkThatHasNoTrack();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkThatHasNoTrackAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );

            this.workerProxy.postMessage(new UpdatingAlbumArtworkMessage());

            const numberOfRemovedAlbumArtwork = this.albumArtworkRepository.deleteAlbumArtworkThatHasNoTrack();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(e, 'Could not remove album artwork', 'AlbumArtworkRemover', 'removeAlbumArtworkThatHasNoTrackAsync');
        }
    }

    async removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove = this.albumArtworkRepository.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                this.logger.info(
                    `There is no album artwork to remove. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            this.logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            this.workerProxy.postMessage(new UpdatingAlbumArtworkMessage());

            const numberOfRemovedAlbumArtwork = this.albumArtworkRepository.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            timer.stop();

            this.logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        } catch (e) {
            timer.stop();

            this.logger.error(
                e,
                'Could not remove album artwork',
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync() {
        try {
            const allAlbumArtworkInDatabase = this.albumArtworkRepository.getAllAlbumArtwork() ?? [];

            this.logger.info(
                `Found ${allAlbumArtworkInDatabase.length} album artwork in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const allArtworkIdsInDatabase = allAlbumArtworkInDatabase.map((x) => x.artworkId);

            this.logger.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const coverArtCacheFullPath = this.applicationPaths.getCoverArtCacheFullPath();
            const allAlbumArtworkFilePaths = await this.fileAccess.getFilesInDirectoryAsync(coverArtCacheFullPath);

            this.logger.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            let numberOfRemovedAlbumArtwork = 0;

            for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
                const albumArtworkFileNameWithoutExtension = this.fileAccess.getFileNameWithoutExtension(albumArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
                    await this.fileAccess.deleteFileIfExistsAsync(albumArtworkFilePath);
                    numberOfRemovedAlbumArtwork++;
                }

                // Only send message once
                if (numberOfRemovedAlbumArtwork === 1) {
                    this.workerProxy.postMessage(new UpdatingAlbumArtworkMessage());
                }
            }
        } catch (e) {
            this.logger.error(
                e,
                'Could not remove album artwork from disk',
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );
        }
    }
}

exports.AlbumArtworkRemover = AlbumArtworkRemover;
