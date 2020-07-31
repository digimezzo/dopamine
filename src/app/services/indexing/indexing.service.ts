import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Timer } from '../../core/timer';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexingService } from './base-indexing.service';
import { CollectionIndexer } from './collection-indexer';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  constructor(
    private logger: Logger,
    private collectionChecker: BaseCollectionChecker,
    private collectionIndexer: CollectionIndexer
  ) { }

  public async indexCollectionIfNeededAsync(): Promise<void> {
    this.logger.info('+++ STARTED INDEXING +++', 'IndexingService', 'startIndexing');

    const timer: Timer = new Timer();
    timer.start();

    if (await this.collectionChecker.collectionNeedsIndexingAsync()) {
      await this.collectionIndexer.indexCollectionAsync();
    }

    timer.stop();

    this.logger.info(
      `+++ FINISHED INDEXING (Time required: ${timer.elapsedMilliseconds}) +++`,
      'IndexingService',
      'startIndexing');
  }
}
