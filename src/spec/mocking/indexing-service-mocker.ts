import { IMock, Mock } from 'typemoq';
import { AlbumArtworkIndexer } from '../../app/services/indexing/album-artwork-indexer';
import { CollectionChecker } from '../../app/services/indexing/collection-checker';
import { IndexingService } from '../../app/services/indexing/indexing.service';
import { TrackIndexer } from '../../app/services/indexing/track-indexer';

export class IndexingServiceMocker {
    constructor() {
        this.indexingService = new IndexingService(
            this.collectionCheckerMock.object,
            this.trackIndexerMock.object,
            this.albumArtworkIndexerMock.object
        );
    }

    public collectionCheckerMock: IMock<CollectionChecker> = Mock.ofType<CollectionChecker>();
    public trackIndexerMock: IMock<TrackIndexer> = Mock.ofType<TrackIndexer>();
    public albumArtworkIndexerMock: IMock<AlbumArtworkIndexer> = Mock.ofType<AlbumArtworkIndexer>();
    public indexingService: IndexingService;
}
