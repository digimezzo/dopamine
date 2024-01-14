const { Logger } = require('../common/logger');
const { FileAccess } = require('../common/file-access');
const { Timer } = require('../common/timer');
const { AlbumArtworkRepository } = require('../data/entities/album-artwork-repository');
const { parentPort } = require('worker_threads');
const { UpdatingAlbumArtworkMessage } = require('./messages/updating-album-artwork-message');
const { ApplicationPaths } = require('../common/application/application-paths');

class AlbumArtworkRemover {
    static async removeAlbumArtworkThatHasNoTrackAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove = AlbumArtworkRepository.getNumberOfAlbumArtworkThatHasNoTrack();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                Logger.info(
                    `There is no album artwork to remove. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkThatHasNoTrackAsync',
                );

                return;
            }

            Logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );

            parentPort?.postMessage(new UpdatingAlbumArtworkMessage());

            const numberOfRemovedAlbumArtwork = AlbumArtworkRepository.deleteAlbumArtworkThatHasNoTrack();

            timer.stop();

            Logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatHasNoTrackAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(e, 'Could not remove album artwork', 'AlbumArtworkRemover', 'removeAlbumArtworkThatHasNoTrackAsync');
        }
    }

    static async removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync() {
        const timer = new Timer();
        timer.start();

        try {
            const numberOfAlbumArtworkToRemove = AlbumArtworkRepository.getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            if (numberOfAlbumArtworkToRemove === 0) {
                timer.stop();

                Logger.info(
                    `There is no album artwork to remove. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                    'AlbumArtworkRemover',
                    'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
                );

                return;
            }

            Logger.info(
                `Found ${numberOfAlbumArtworkToRemove} album artwork.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );

            parentPort?.postMessage(new UpdatingAlbumArtworkMessage());

            const numberOfRemovedAlbumArtwork = AlbumArtworkRepository.deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing();

            timer.stop();

            Logger.info(
                `Removed ${numberOfRemovedAlbumArtwork} album artwork. Time required: ${timer.getElapsedMilliseconds()} ms.`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        } catch (e) {
            timer.stop();

            Logger.error(
                e,
                'Could not remove album artwork',
                'AlbumArtworkRemover',
                'removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync',
            );
        }
    }

    static async removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync() {
        try {
            const allAlbumArtworkInDatabase = AlbumArtworkRepository.getAllAlbumArtwork() ?? [];

            Logger.info(
                `Found ${allAlbumArtworkInDatabase.length} album artwork in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const allArtworkIdsInDatabase = allAlbumArtworkInDatabase.map((x) => x.artworkId);

            Logger.info(
                `Found ${allArtworkIdsInDatabase.length} artworkIds in the database`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            const coverArtCacheFullPath = ApplicationPaths.getCoverArtCacheFullPath();
            const allAlbumArtworkFilePaths = await FileAccess.getFilesInDirectoryAsync(coverArtCacheFullPath);

            Logger.info(
                `Found ${allAlbumArtworkFilePaths.length} artwork files on disk`,
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );

            let numberOfRemovedAlbumArtwork = 0;

            for (const albumArtworkFilePath of allAlbumArtworkFilePaths) {
                const albumArtworkFileNameWithoutExtension = FileAccess.getFileNameWithoutExtension(albumArtworkFilePath);

                if (!allArtworkIdsInDatabase.includes(albumArtworkFileNameWithoutExtension)) {
                    await FileAccess.deleteFileIfExistsAsync(albumArtworkFilePath);
                    numberOfRemovedAlbumArtwork++;
                }

                // Only send message once
                if (numberOfRemovedAlbumArtwork === 1) {
                    parentPort?.postMessage(new UpdatingAlbumArtworkMessage());
                }
            }
        } catch (e) {
            Logger.error(
                e,
                'Could not remove album artwork from disk',
                'AlbumArtworkRemover',
                'removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync',
            );
        }
    }
}

exports.AlbumArtworkRemover = AlbumArtworkRemover;
