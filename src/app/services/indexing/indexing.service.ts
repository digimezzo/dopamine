import { Injectable } from '@angular/core';
import { BaseIndexingService } from './base-indexing.service';
import { Logger } from '../../core/logger';
import * as moment from 'moment';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { FileSystem } from '../../core/io/file-system';
import { Folder } from '../../data/entities/folder';
import { FileFormats } from '../../core/base/file-formats';
import { IndexablePath } from './indexable-path';

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

    const fetcher: IndexablePathFetcher = new IndexablePathFetcher(this.fileSystem, this.logger);
    const indexablePaths: IndexablePath[] = await fetcher.getIndexAblePathsInFolderAsync(
      new Folder('/home/raphael/Music'),
      FileFormats.supportedAudioExtensions
      );

    const finishedMilliseconds: number = moment().valueOf();

    this.logger.info(
      `+++ FINISHED INDEXING (Time required: ${finishedMilliseconds - startedMilliseconds}) +++`,
      'IndexingService',
      'startIndexing');
  }
}
