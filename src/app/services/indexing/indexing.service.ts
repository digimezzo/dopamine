import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexingService } from './base-indexing.service';
import { TrackIndexer } from './track-indexer';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  private isIndexing: boolean = false;

  constructor(
    private collectionChecker: BaseCollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    private settings: BaseSettings,
    private logger: Logger
  ) { }

  public async indexCollectionIfNeededAsync(): Promise<void> {
    if (this.isIndexing) {
      return;
    }

    this.logger.info('Checking if collection needs indexing', 'IndexingService', 'indexCollectionIfNeededAsync');

    if (!this.settings.refreshCollectionAutomatically) {
      this.logger.info('Skipping indexing because automatic indexing is disabled.', 'IndexingService', 'indexCollectionIfNeededAsync');

      return;
    }

    this.isIndexing = true;

    if (await this.collectionChecker.collectionNeedsIndexingAsync()) {
      await this.trackIndexer.indexTracksAsync();
    }

    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexing = false;
  }

  public async indexCollectionAsync(): Promise<void> {
    if (this.isIndexing) {
      return;
    }

    this.isIndexing = true;

    await this.trackIndexer.indexTracksAsync();
    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexing = false;
  }
}
