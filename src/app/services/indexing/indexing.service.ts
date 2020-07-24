import { Injectable } from '@angular/core';
import { BaseIndexingService } from './base-indexing.service';
import { Logger } from '../../core/logger';
import * as moment from 'moment';
import { CollectionChecker } from './collection-checker';
import { CollectionIndexer } from './collection-indexer';
import { BaseCollectionChecker } from './base-collection-checker';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  constructor(
    private logger: Logger,
    private collectionChecker: BaseCollectionChecker,
    private collectionIndexer: CollectionIndexer
  ) { }

  public async indexCollectionIfNeeded(): Promise<void> {
    this.logger.info('+++ STARTED INDEXING +++', 'IndexingService', 'startIndexing');

    const startedMilliseconds: number = moment().valueOf();

    if (await this.collectionChecker.collectionNeedsIndexingAsync()) {
      await this.collectionIndexer.indexCollectionAsync();
    }

    const finishedMilliseconds: number = moment().valueOf();

    this.logger.info(
      `+++ FINISHED INDEXING (Time required: ${finishedMilliseconds - startedMilliseconds}) +++`,
      'IndexingService',
      'startIndexing');
  }
}
