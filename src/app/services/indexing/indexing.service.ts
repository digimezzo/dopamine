import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexingService } from './base-indexing.service';
import { TrackIndexer } from './track-indexer';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  constructor(
    private collectionChecker: BaseCollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    private logger: Logger
  ) { }

  public async indexCollectionIfNeededAsync(): Promise<void> {
    this.logger.info('Checking if collection needs indexing', 'IndexingService', 'indexCollectionIfNeededAsync');

    if (await this.collectionChecker.collectionNeedsIndexingAsync()) {
      await this.trackIndexer.indexTracksAsync();
    }

    this.albumArtworkIndexer.indexAlbumArtworkAsync();
  }
}
