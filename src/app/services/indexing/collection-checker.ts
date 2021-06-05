import { Injectable } from '@angular/core';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Logger } from '../../common/logger';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexablePathFetcher } from './base-indexable-path-fetcher';
import { IndexablePath } from './indexable-path';

@Injectable()
export class CollectionChecker implements BaseCollectionChecker {
    constructor(
        private indexablePathFetcher: BaseIndexablePathFetcher,
        private trackRepository: BaseTrackRepository,
        private logger: Logger
    ) {}

    public async isCollectionOutdatedAsync(): Promise<boolean> {
        let collectionNeedsIndexing: boolean = false;

        try {
            const numberOfDatabaseTracksThatNeedIndexing: number = this.trackRepository.getNumberOfTracksThatNeedIndexing();
            const indexablePathsOnDisk: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
            const numberOfDatabaseTracks: number = this.trackRepository.getNumberOfTracks();
            const lastDateFileModifiedInDatabase: number = this.trackRepository.getMaximumDateFileModified();
            const lastDateFileModifiedOnDisk: number = this.getLastDateFileModifiedOnDisk(indexablePathsOnDisk);

            collectionNeedsIndexing =
                numberOfDatabaseTracksThatNeedIndexing > 0 ||
                numberOfDatabaseTracks !== indexablePathsOnDisk.length ||
                lastDateFileModifiedInDatabase < lastDateFileModifiedOnDisk;

            this.logger.info(`Collection needs indexing=${collectionNeedsIndexing}`, 'CollectionChecker', 'isCollectionOutdatedAsync');
        } catch (e) {
            this.logger.error(
                `An error occurred while checking if collection needs indexing. Error ${e.message}`,
                'CollectionChecker',
                'isCollectionOutdatedAsync'
            );
        }

        return collectionNeedsIndexing;
    }

    private getLastDateFileModifiedOnDisk(indexablePathsOnDisk: IndexablePath[]): number {
        if (indexablePathsOnDisk.length <= 1) {
            return 0;
        }

        const indexablePathsSortedByDateModifiedTicksDescending: IndexablePath[] = indexablePathsOnDisk.sort((a, b) =>
            a.dateModifiedTicks > b.dateModifiedTicks ? -1 : 1
        );

        return indexablePathsSortedByDateModifiedTicksDescending[0].dateModifiedTicks;
    }
}
