import { Injectable } from '@angular/core';
import { BaseIndexingService } from './base-indexing.service';
import { Logger } from '../../core/logger';
import * as moment from 'moment';
import { IndexablePathFetcher } from './indexable-path-fetcher';
import { FileSystem } from '../../core/io/file-system';
import { Folder } from '../../data/entities/folder';
import { FileFormats } from '../../core/base/file-formats';
import { IndexablePath } from './indexable-path';
import { FolderRepository } from '../../data/repositories/folder-repository';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  constructor(
    private logger: Logger,
    private fileSystem: FileSystem,
    private folderRepository: FolderRepository
  ) { }

  public async startIndexingAsync(): Promise<void> {
    this.logger.info('+++ STARTED INDEXING +++', 'IndexingService', 'startIndexing');

    const startedMilliseconds: number = moment().valueOf();

    // TODO
    const indexablePathsInCollection: IndexablePath[] = await this.getIndexablePathsInCollectionAsync();

    const finishedMilliseconds: number = moment().valueOf();

    this.logger.info(
      `+++ FINISHED INDEXING (Time required: ${finishedMilliseconds - startedMilliseconds}) +++`,
      'IndexingService',
      'startIndexing');
  }

  private async getIndexablePathsInCollectionAsync(): Promise<IndexablePath[]> {
    const indexablePathsInCollection: IndexablePath[] = [];
    const folders: Folder[] = this.folderRepository.getFolders();

    const indexablePathFetcher: IndexablePathFetcher = new IndexablePathFetcher(this.fileSystem, this.logger);

    for (const folder of folders) {
      if (this.fileSystem.pathExists(folder.path)) {
        try {
          const indexablePathsForFolder: IndexablePath[] = await indexablePathFetcher.getIndexAblePathsInFolderAsync(
            folder,
            FileFormats.supportedAudioExtensions);
          indexablePathsInCollection.push(...indexablePathsForFolder);
        } catch (error) {
          this.logger.error(
            `Could not get indexable paths for folder '${folder.path}'`,
            'IndexingService',
            'getIndexablePathsInCollectionAsync');
        }
      }
    }

    return indexablePathsInCollection;
  }
}
