import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { BaseTrackRepository } from '../../app/data/repositories/base-track-repository';
import { AlbumArtworkIndexer } from '../../app/services/indexing/album-artwork-indexer';
import { CollectionChecker } from '../../app/services/indexing/collection-checker';
import { IndexingService } from '../../app/services/indexing/indexing.service';
import { TrackIndexer } from '../../app/services/indexing/track-indexer';
import { SettingsStub } from './settings-stub';

export class IndexingServiceMocker {
    constructor(private refreshCollectionAutomatically: boolean) {
        this.indexingService = new IndexingService(
            this.collectionCheckerMock.object,
            this.trackIndexerMock.object,
            this.albumArtworkIndexerMock.object,
            this.trackRepositoryMock.object,
            this.settingsStub,
            this.loggerMock.object
        );
    }

    public collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
    public trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
    public albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();
    public trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
    public settingsStub: SettingsStub = new SettingsStub(false, true, this.refreshCollectionAutomatically);
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public indexingService: IndexingService;
}
