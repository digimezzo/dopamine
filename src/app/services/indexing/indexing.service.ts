import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexingService } from './base-indexing.service';
import { TrackIndexer } from './track-indexer';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  private isIndexingCollection: boolean = false;
  private isIndexingArtworkOnly: boolean = false;

  constructor(
    private collectionChecker: BaseCollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    private trackRepository: BaseTrackRepository,
    private settings: BaseSettings,
    private logger: Logger
  ) { }

  public foldersHaveChanged: boolean = false;

  public async indexCollectionIfOutdatedAsync(): Promise<void> {
    if (this.isIndexingCollection) {
      return;
    }

    if (!this.settings.refreshCollectionAutomatically) {
      this.logger.info('Skipping indexing because automatic indexing is disabled.', 'IndexingService', 'indexCollectionIfOutdatedAsync');

      return;
    }

    this.isIndexingCollection = true;

    this.logger.info('Checking if collection is outdated', 'IndexingService', 'indexCollectionIfOutdatedAsync');

    const collectionIsOutdated: boolean = await this.collectionChecker.isCollectionOutdatedAsync();

    if (collectionIsOutdated) {
      await this.trackIndexer.indexTracksAsync();
    }

    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingCollection = false;
  }

  public async indexCollectionIfFoldersHaveChangedAsync(): Promise<void> {
    if (!this.foldersHaveChanged) {
      return;
    }

    this.foldersHaveChanged = false;

    await this.indexCollectionAlwaysAsync();
  }

  public async indexCollectionAlwaysAsync(): Promise<void> {
    if (this.isIndexingCollection) {
      return;
    }

    this.isIndexingCollection = true;

    await this.trackIndexer.indexTracksAsync();
    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingCollection = false;
  }

  public async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void> {
    if (this.isIndexingCollection || this.isIndexingArtworkOnly) {
      return;
    }

    this.isIndexingArtworkOnly = true;

    this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingArtworkOnly = false;
  }
}
