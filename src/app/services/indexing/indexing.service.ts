import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { FolderServiceBase } from '../folder/folder.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { IIndexingMessage } from './messages/i-indexing-message';
import { AddingTracksMessage } from './messages/adding-tracks-message';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { TrackModel } from '../track/track-model';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';

@Injectable()
export class IndexingService implements OnDestroy {
    private indexingFinished: Subject<void> = new Subject();
    private subscription: Subscription = new Subscription();
    private foldersHaveChanged: boolean = false;
    private albumGroupingHasChanged: boolean = false;

    public constructor(
        private notificationService: NotificationServiceBase,
        private folderService: FolderServiceBase,
        private albumArtworkIndexer: AlbumArtworkIndexer,
        private desktop: DesktopBase,
        private settings: SettingsBase,
        private ipcProxy: IpcProxyBase,
        private logger: Logger,
        private trackRepositoryBase: TrackRepositoryBase,
    ) {
        this.initializeSubscriptions();
    }

    public indexingFinished$: Observable<void> = this.indexingFinished.asObservable();

    public isIndexingCollection: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public indexCollectionIfOutdated(): void {
        this.indexCollection('outdated');
    }

    public indexCollectionAlways(): void {
        this.indexCollection('always');
    }

    public initializeSubscriptions(): void {
        this.subscription.add(
            this.folderService.foldersChanged$.subscribe(() => {
                this.foldersHaveChanged = true;
            }),
        );

        this.ipcProxy.onIndexingWorkerMessage$.subscribe((message: IIndexingMessage) => {
            PromiseUtils.noAwait(this.showNotification(message));
        });

        this.ipcProxy.onIndexingWorkerExit$.subscribe(async () => {
            await this.albumArtworkIndexer.indexAlbumArtworkAsync();
            this.isIndexingCollection = false;
            this.indexingFinished.next();
        });
    }

    public async indexCollectionIfOptionsHaveChangedAsync(): Promise<void> {
        if (this.foldersHaveChanged) {
            this.logger.info('Folders have changed. Indexing collection.', 'IndexingService', 'indexCollectionIfOptionsHaveChanged');
            this.indexCollection('always');
        } else if (this.albumGroupingHasChanged) {
            this.logger.info(
                'Album grouping has changed. Indexing album artwork.',
                'IndexingService',
                'indexCollectionIfOptionsHaveChanged',
            );
            await this.indexAlbumArtworkOnlyAsync(false);
        }
    }

    public async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void> {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        await this.albumArtworkIndexer.indexAlbumArtworkAsync();
    }

    public onAlbumGroupingChanged(): void {
        this.albumGroupingHasChanged = true;
    }

    private createWorkerArgs(task: string) {
        return {
            task: task,
            skipRemovedFilesDuringRefresh: this.settings.skipRemovedFilesDuringRefresh,
            applicationDataDirectory: this.desktop.getApplicationDataDirectory(),
        };
    }

    private async showNotification(message: IIndexingMessage): Promise<void> {
        switch (message.type) {
            case 'refreshing': {
                await this.notificationService.refreshing();
                break;
            }
            case 'addingTracks': {
                const addingTracksMessage: AddingTracksMessage = <AddingTracksMessage>message;
                await this.notificationService.addedTracksAsync(
                    addingTracksMessage.numberOfAddedTracks,
                    addingTracksMessage.percentageOfAddedTracks,
                );
                break;
            }
            case 'removingTracks': {
                await this.notificationService.removingTracksAsync();
                break;
            }
            case 'updatingTracks': {
                await this.notificationService.updatingTracksAsync();
                break;
            }
            case 'updatingAlbumArtwork': {
                await this.notificationService.updatingAlbumArtworkAsync();
                break;
            }
            case 'dismiss': {
                this.notificationService.dismiss();
                break;
            }
            default: {
                break;
            }
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

        this.ipcProxy.sendToMainProcess('indexing-worker', this.createWorkerArgs(task));
    }

    public indexAfterTagChange(paths: string[]): void {
        // Update track metadata in the database and set needs album artwork indexing to 1

        // Trigger album artwork indexing

        // Refresh queued tracks?

        this.indexingFinished.next();
    }
}
