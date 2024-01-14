import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { IndexingServiceBase } from './indexing.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { ipcRenderer } from 'electron';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { PromiseUtils } from '../../common/utils/promise-utils';

@Injectable()
export class IndexingService implements IndexingServiceBase, OnDestroy {
    private indexingFinished: Subject<void> = new Subject();
    private subscription: Subscription = new Subscription();
    private foldersHaveChanged: boolean = false;

    public constructor(
        private snackBarService: SnackBarServiceBase,
        private albumArtworkIndexer: AlbumArtworkIndexer,
        private trackRepository: TrackRepositoryBase,
        private folderService: FolderServiceBase,
        private fileAccess: FileAccessBase,
        private settings: SettingsBase,
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

    public indexCollectionIfOutdated(): void {
        this.indexCollection('outdated');
    }

    public indexCollectionIfFoldersHaveChanged(): void {
        this.indexCollection('foldersChanged');
    }

    public indexCollectionAlways(): void {
        this.indexCollection('always');
    }

    public indexAlbumArtworkOnly(onlyWhenHasNoCover: boolean): void {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        ipcRenderer.send('indexing-worker', this.createWorkerArgs('albumArtwork', onlyWhenHasNoCover));

        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: any): void => {
            PromiseUtils.noAwait(this.showSnackBarMessage(message));
        });

        ipcRenderer.on('indexing-worker-exit', (): void => {
            this.isIndexingCollection = false;
            this.indexingFinished.next();
        });
    }

    private createWorkerArgs(task: string, onlyWhenHasNoCover: boolean) {
        return {
            task: task,
            skipRemovedFilesDuringRefresh: this.settings.skipRemovedFilesDuringRefresh,
            downloadMissingAlbumCovers: this.settings.downloadMissingAlbumCovers,
            applicationDataDirectory: this.fileAccess.applicationDataDirectory(),
            onlyWhenHasNoCover: onlyWhenHasNoCover,
        };
    }

    private async showSnackBarMessage(message: any): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (message.type) {
            case 'addingTracks':
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
                await this.snackBarService.addedTracksAsync(message.numberOfAddedTracks, message.percentageOfAddedTracks);
                break;
            case 'removingTracks':
                await this.snackBarService.removingTracksAsync();
                break;
            case 'updatingTracks':
                await this.snackBarService.updatingTracksAsync();
                break;
            case 'updatingAlbumArtwork':
                await this.snackBarService.updatingAlbumArtworkAsync();
                break;
            case 'dismiss':
                await this.snackBarService.dismissDelayedAsync();
                break;
            default:
                break;
        }
    }

    private indexCollection(task: string): void {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexCollection');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexCollection');

        ipcRenderer.send('indexing-worker', this.createWorkerArgs(task, false));

        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: any): void => {
            PromiseUtils.noAwait(this.showSnackBarMessage(message));
        });

        ipcRenderer.on('indexing-worker-exit', (): void => {
            this.isIndexingCollection = false;
            this.indexingFinished.next();
        });
    }
}
