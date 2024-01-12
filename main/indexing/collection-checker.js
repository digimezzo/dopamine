const { Logger } = require('../common/logger');
const { IndexablePathFetcher } = require('./indexable-path-fetcher');
const { TrackRepository } = require('../data/track-repository');

class CollectionChecker {
    static async isCollectionOutdatedAsync() {
        let collectionIsOutdated = false;

        try {
            const numberOfDatabaseTracksThatNeedIndexing = TrackRepository.getNumberOfTracksThatNeedIndexing();
            const indexablePathsOnDisk = await IndexablePathFetcher.getIndexablePathsForAllFoldersAsync();
            const numberOfDatabaseTracks = TrackRepository.getNumberOfTracks();
            const lastDateFileModifiedInDatabase = TrackRepository.getMaximumDateFileModified();
            const lastDateFileModifiedOnDisk = this.#getLastDateFileModifiedOnDisk(indexablePathsOnDisk);

            const tracksNeedIndexing = numberOfDatabaseTracksThatNeedIndexing > 0;
            const numberOfTracksHasChanged = numberOfDatabaseTracks !== indexablePathsOnDisk.length;
            const lastDateModifiedHasChanged = lastDateFileModifiedInDatabase < lastDateFileModifiedOnDisk;

            collectionIsOutdated = tracksNeedIndexing || numberOfTracksHasChanged || lastDateModifiedHasChanged;

            Logger.info(
                `collectionIsOutdated=${collectionIsOutdated}, tracksNeedIndexing=${tracksNeedIndexing}, numberOfTracksHasChanged=${numberOfTracksHasChanged}, lastDateModifiedHasChanged=${lastDateModifiedHasChanged}`,
                'CollectionChecker',
                'isCollectionOutdatedAsync',
            );
        } catch (e) {
            Logger.error(e, 'An error occurred while checking if collection is outdated', 'CollectionChecker', 'isCollectionOutdatedAsync');
        }

        return collectionIsOutdated;
    }

    static #getLastDateFileModifiedOnDisk(indexablePathsOnDisk) {
        if (indexablePathsOnDisk.length <= 1) {
            return 0;
        }

        const indexablePathsSortedByDateModifiedTicksDescending = indexablePathsOnDisk.sort((a, b) =>
            a.dateModifiedTicks > b.dateModifiedTicks ? -1 : 1,
        );

        return indexablePathsSortedByDateModifiedTicksDescending[0].dateModifiedTicks;
    }
}

exports.CollectionChecker = CollectionChecker;
