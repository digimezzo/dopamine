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
  constructor(
    private collectionChecker: BaseCollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    private settings: BaseSettings,
    private logger: Logger
  ) { }

  public async indexCollectionIfNeededAsync(): Promise<void> {
    this.logger.info('Checking if collection needs indexing', 'IndexingService', 'indexCollectionIfNeededAsync');

    if (!this.settings.refreshCollectionAutomatically) {
      this.logger.info('Skipping indexing because automatic indexing is disabled.', 'IndexingService', 'indexCollectionIfNeededAsync');

      return;
    }

    if (await this.collectionChecker.collectionNeedsIndexingAsync()) {
      await this.trackIndexer.indexTracksAsync();
    }

    this.albumArtworkIndexer.indexAlbumArtworkAsync();
  }

  public async indexCollectionAsync(): Promise<void> {
    await this.trackIndexer.indexTracksAsync();
    this.albumArtworkIndexer.indexAlbumArtworkAsync();
  }
}
