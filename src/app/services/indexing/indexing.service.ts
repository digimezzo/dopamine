import { Injectable } from '@angular/core';
import { BaseIndexingService } from './base-indexing.service';
import { Logger } from '../../core/logger';
import * as moment from 'moment';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { FileSystem } from '../../core/io/file-system';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  constructor(
    private logger: Logger,
    private fileSystem: FileSystem
  ) { }

  public async startIndexingAsync(): Promise<void> {
    this.logger.info('+++ STARTED INDEXING +++', 'IndexingService', 'startIndexing');

    const startedMilliseconds: number = moment().valueOf();

    // TODO

    const finishedMilliseconds: number = moment().valueOf();

    this.logger.info(
      `+++ FINISHED INDEXING (Time required: ${finishedMilliseconds - startedMilliseconds}) +++`,
      'IndexingService',
      'startIndexing');
  }
}
