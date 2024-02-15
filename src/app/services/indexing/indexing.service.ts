import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { IndexingServiceBase } from './indexing.service.base';
import { FolderServiceBase } from '../folder/folder.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { ipcRenderer } from 'electron';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { IIndexingMessage } from './messages/i-indexing-message';
import { AddingTracksMessage } from './messages/adding-tracks-message';

@Injectable()
export class IndexingService implements IndexingServiceBase, OnDestroy {
    private indexingFinished: Subject<void> = new Subject();
    private subscription: Subscription = new Subscription();
    private foldersHaveChanged: boolean = false;

    public constructor(
        private notificationService: NotificationServiceBase,
        private folderService: FolderServiceBase,
        private desktop: DesktopBase,
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
        if (!this.foldersHaveChanged) {
            this.logger.info('Folders have not changed.', 'IndexingService', 'indexCollectionIfFoldersHaveChangedAsync');

            return;
        }

        this.indexCollection('always');
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

        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: IIndexingMessage): void => {
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
            applicationDataDirectory: this.desktop.getApplicationDataDirectory(),
            onlyWhenHasNoCover: onlyWhenHasNoCover,
        };
    }

    private async showSnackBarMessage(message: IIndexingMessage): Promise<void> {
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
                await this.notificationService.dismissDelayedAsync();
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

        ipcRenderer.send('indexing-worker', this.createWorkerArgs(task, false));

        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: IIndexingMessage): void => {
            PromiseUtils.noAwait(this.showSnackBarMessage(message));
        });

        ipcRenderer.on('indexing-worker-exit', (): void => {
            this.isIndexingCollection = false;
            this.indexingFinished.next();
        });
    }
}
