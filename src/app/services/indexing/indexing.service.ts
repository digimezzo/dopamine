import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { BaseFolderService } from '../folder/base-folder.service';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { BaseCollectionChecker } from './base-collection-checker';
import { BaseIndexingService } from './base-indexing.service';
import { TrackIndexer } from './track-indexer';

@Injectable({
  providedIn: 'root'
})
export class IndexingService implements BaseIndexingService {
  private isIndexingCollection: boolean = false;

  constructor(
    private collectionChecker: BaseCollectionChecker,
    private trackIndexer: TrackIndexer,
    private albumArtworkIndexer: AlbumArtworkIndexer,
    private trackRepository: BaseTrackRepository,
    private folderService: BaseFolderService,
    private logger: Logger
  ) { }

  public async indexCollectionIfOutdatedAsync(): Promise<void> {
    if (this.isIndexingCollection) {
      return;
    }

    this.isIndexingCollection = true;

    const collectionIsOutdated: boolean = await this.collectionChecker.isCollectionOutdatedAsync();

    if (collectionIsOutdated) {
      await this.trackIndexer.indexTracksAsync();
    }

    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingCollection = false;
  }

  public async indexCollectionIfFoldersHaveChangedAsync(): Promise<void> {
    if (!this.folderService.haveFoldersChanged()) {
      return;
    }

    if (this.isIndexingCollection) {
      return;
    }

    this.isIndexingCollection = true;

    this.folderService.resetFolderChanges();

    await this.trackIndexer.indexTracksAsync();
    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingCollection = false;
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
    if (this.isIndexingCollection) {
      return;
    }

    this.isIndexingCollection = true;

    this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
    await this.albumArtworkIndexer.indexAlbumArtworkAsync();

    this.isIndexingCollection = false;
  }
}
