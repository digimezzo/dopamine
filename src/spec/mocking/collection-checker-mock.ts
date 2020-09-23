import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { BaseTrackRepository } from '../../app/data/repositories/base-track-repository';
import { CollectionChecker } from '../../app/services/indexing/collection-checker';
import { IndexablePath } from '../../app/services/indexing/indexable-path';
import { IndexablePathFetcher } from '../../app/services/indexing/indexable-path-fetcher';

export class CollectionCheckerMock {
    constructor() {
        const indexablePath1: IndexablePath = new IndexablePath('/home/user/Music/track1.mp3', 10, 1);
        const indexablePath2: IndexablePath = new IndexablePath('/home/user/Music/track2.mp3', 20, 1);

        this.indexablePathFetcherMock.setup(x => x.getIndexablePathsForAllFoldersAsync())
        .returns(async () => [indexablePath1, indexablePath2]);

        this.collectionChecker = new CollectionChecker(
            this.indexablePathFetcherMock.object,
            this.trackRepositoryMock.object,
            this.loggerMock.object
        );
    }

    public indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
    public trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public collectionChecker: CollectionChecker;
}
