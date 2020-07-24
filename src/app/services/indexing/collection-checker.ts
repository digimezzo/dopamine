import { IndexablePath } from './indexable-path';
import { Logger } from '../../core/logger';
import { Injectable } from '@angular/core';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseIndexablePathFetcher } from './base-indexable-path-fetcher';

@Injectable({
    providedIn: 'root'
})
export class CollectionChecker {
    constructor(
        private indexablePathFetcher: BaseIndexablePathFetcher,
        private trackRepository: BaseTrackRepository,
        private logger: Logger
    ) { }

    public async collectionNeedsIndexingAsync(): Promise<boolean> {
        let collectionNeedsIndexing: boolean = false;

        const numberOfDatabaseTracksThatNeedIndexing: number = this.trackRepository.getNumberOfTracksThatNeedIndexing();
        const indexablePathsOnDisk: IndexablePath[] = await this.indexablePathFetcher.getIndexablePathsForAllFoldersAsync();
        const numberOfDatabaseTracks: number = this.trackRepository.getNumberOfTracks();
        const lastDateFileModifiedInDatabase: number = this.trackRepository.getMaximumDateFileModified();
        const lastDateFileModifiedOnDisk: number = this.getLastDateFileModifiedOnDisk(indexablePathsOnDisk);

        collectionNeedsIndexing = numberOfDatabaseTracksThatNeedIndexing > 0 ||
            numberOfDatabaseTracks !== indexablePathsOnDisk.length ||
            lastDateFileModifiedInDatabase < lastDateFileModifiedOnDisk;

        this.logger.info(
            `Collection needs indexing=${collectionNeedsIndexing}`,
            'CollectionChecker',
            'collectionNeedsIndexingAsync');

        return collectionNeedsIndexing;
    }

    private getLastDateFileModifiedOnDisk(indexablePathsOnDisk: IndexablePath[]): number {
        if (indexablePathsOnDisk.length <= 1) {
            return 0;
        }

        const indexablePathsSortedByDateModifiedTicksDescending: IndexablePath[] = indexablePathsOnDisk
            .sort((a, b) => a.dateModifiedTicks > b.dateModifiedTicks ? -1 : 1);

        return indexablePathsSortedByDateModifiedTicksDescending[0].dateModifiedTicks;
    }
}
