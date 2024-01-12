import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { CollectionChecker } from './collection-checker';
import { TrackIndexer } from './track-indexer';
import { IndexingServiceBase } from './indexing.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';

@Injectable()
export class IndexingService implements IndexingServiceBase, OnDestroy {
    private indexingFinished: Subject<void> = new Subject();
    private subscription: Subscription = new Subscription();
    private foldersHaveChanged: boolean = false;

    public constructor(
        private collectionChecker: CollectionChecker,
        private trackIndexer: TrackIndexer,
        private albumArtworkIndexer: AlbumArtworkIndexer,
        private trackRepository: TrackRepositoryBase,
        private folderService: FolderServiceBase,
        private ipcProxy: IpcProxyBase,
        private logger: Logger,
    ) {
        this.subscription.add(
            this.folderService.foldersChanged$.subscribe(() => {
                this.foldersHaveChanged = true;
            }),
        );
    }

    public indexingFinished$: Observable<void> = this.indexingFinished.asObservable();

    public isIndexingCollection: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async indexCollectionIfOutdatedAsync(): Promise<void> {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexCollectionIfOutdatedAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexCollectionIfOutdatedAsync');

        const collectionIsOutdated: boolean = await this.collectionChecker.isCollectionOutdatedAsync();

        if (collectionIsOutdated) {
            this.logger.info('Collection is outdated.', 'IndexingService', 'indexCollectionIfOutdatedAsync');
            // await this.trackIndexer.indexTracksAsync();
            await this.ipcProxy.sendToMainProcessAsync('indexing-worker', { task: 'outdated' });
        } else {
            this.logger.info('Collection is not outdated.', 'IndexingService', 'indexCollectionIfOutdatedAsync');
        }

        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.isIndexingCollection = false;
        this.indexingFinished.next();
    }

    public async indexCollectionIfFoldersHaveChangedAsync(): Promise<void> {
        if (!this.foldersHaveChanged) {
            this.logger.info('Folders have not changed.', 'IndexingService', 'indexCollectionIfFoldersHaveChangedAsync');

            return;
        }

        this.logger.info('Folders have changed.', 'IndexingService', 'indexCollectionIfFoldersHaveChangedAsync');

        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexCollectionIfFoldersHaveChangedAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexCollectionIfFoldersHaveChangedAsync');

        // await this.trackIndexer.indexTracksAsync();
        await this.ipcProxy.sendToMainProcessAsync('indexing-worker', { task: 'foldersChanged' });

        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.isIndexingCollection = false;
        this.indexingFinished.next();
    }

    public async indexCollectionAlwaysAsync(): Promise<void> {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexCollectionAlwaysAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexCollectionAlwaysAsync');

        // await this.trackIndexer.indexTracksAsync();
        await this.ipcProxy.sendToMainProcessAsync('indexing-worker', { task: 'always' });

        // await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.isIndexingCollection = false;
        this.indexingFinished.next();
    }

    public async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void> {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover);
        await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.isIndexingCollection = false;
        this.indexingFinished.next();
    }
}
