class CollectionChecker {
    constructor(trackRepository, indexablePathFetcher, logger) {
        this.trackRepository = trackRepository;
        this.indexablePathFetcher = indexablePathFetcher;
        this.logger = logger;
    }

    async isCollectionOutdatedAsync() {
        let collectionIsOutdated = false;

        try {
            const numberOfDatabaseTracksThatNeedIndexing = this.trackRepository.getNumberOfTracksThatNeedIndexing();
            const indexablePathsOnDisk = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
            const numberOfDatabaseTracks = this.trackRepository.getNumberOfTracks();
            const lastDateFileModifiedInDatabase = this.trackRepository.getMaximumDateFileModified();
            const lastDateFileModifiedOnDisk = this.#getLastDateFileModifiedOnDisk(indexablePathsOnDisk);

            const tracksNeedIndexing = numberOfDatabaseTracksThatNeedIndexing > 0;
            const numberOfTracksHasChanged = numberOfDatabaseTracks !== indexablePathsOnDisk.length;
            const lastDateModifiedHasChanged = lastDateFileModifiedInDatabase < lastDateFileModifiedOnDisk;

            collectionIsOutdated = tracksNeedIndexing || numberOfTracksHasChanged || lastDateModifiedHasChanged;

            if (collectionIsOutdated) {
                this.logger.info(
                    `Collection is outdated: tracksNeedIndexing=${tracksNeedIndexing}, numberOfTracksHasChanged=${numberOfTracksHasChanged}, lastDateModifiedHasChanged=${lastDateModifiedHasChanged}`,
                    'CollectionChecker',
                    'isCollectionOutdatedAsync',
                );
            } else {
                this.logger.info('Collection is up to date', 'CollectionChecker', 'isCollectionOutdatedAsync');
            }
        } catch (e) {
            this.logger.error(
                e,
                'An error occurred while checking if collection is outdated',
                'CollectionChecker',
                'isCollectionOutdatedAsync',
            );
        }

        return collectionIsOutdated;
    }

    #getLastDateFileModifiedOnDisk(indexablePathsOnDisk) {
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
