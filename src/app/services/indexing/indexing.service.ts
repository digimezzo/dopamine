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
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { Track } from '../../data/entities/track';
import { TrackFiller } from './track-filler';
import { PlaybackService } from '../playback/playback.service';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';

@Injectable()
export class IndexingService implements OnDestroy {
    private indexingFinished: Subject<void> = new Subject();
    private subscription: Subscription = new Subscription();
    private foldersHaveChanged: boolean = false;
    private albumGroupingHasChanged: boolean = false;
    private currentIndexingTask: string = '';

    public constructor(
        private notificationService: NotificationServiceBase,
        private folderService: FolderServiceBase,
        private playbackService: PlaybackService,
        private albumArtworkIndexer: AlbumArtworkIndexer,
        private albumArtworkRepository: AlbumArtworkRepositoryBase,
        private trackRepository: TrackRepositoryBase,
        private trackFiller: TrackFiller,
        private desktop: DesktopBase,
        private scheduler: SchedulerBase,
        private settings: SettingsBase,
        private ipcProxy: IpcProxyBase,
        private logger: Logger,
    ) {
        this.initializeSubscriptions();
    }

    public indexingFinished$: Observable<void> = this.indexingFinished.asObservable();

    public isIndexingCollection: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

        this.ipcProxy.onIndexingWorkerExit$.subscribe(() => {
            void this.handleOnIndexingWorkerExitAsync();
        });
    }

    private async handleOnIndexingWorkerExitAsync(): Promise<void> {
        if (this.currentIndexingTask === 'replaygain') {
            const tracks: Track[] = this.trackRepository.getVisibleTracks() ?? [];
            this.playbackService.updateQueueTracks(tracks);
        } else {
            await this.albumArtworkIndexer.indexAlbumArtworkAsync();
        }

        this.isIndexingCollection = false;
        this.currentIndexingTask = '';
        this.indexingFinished.next();
    }

    public async indexCollectionIfOutdatedAsync(): Promise<void> {
        if (this.settings.showRefreshNotificationAtStartup) {
            await this.notificationService.refreshingAsync();
            await this.scheduler.sleepAsync(1000); // Wait a bit to ensure user sees a refreshing notification
        }
        this.indexCollection('outdated');
    }

    public async indexCollectionAlwaysAsync(): Promise<void> {
        await this.notificationService.refreshingAsync();
        await this.scheduler.sleepAsync(1000); // Wait a bit to ensure user sees a refreshing notification
        this.indexCollection('always');
    }

    public reindexReplayGainForExistingTracks(): void {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'reindexReplayGainForExistingTracks');

            return;
        }

        this.indexCollection('replaygain');
    }

    public async indexCollectionIfOptionsHaveChangedAsync(): Promise<void> {
        if (this.foldersHaveChanged) {
            this.logger.info('Folders have changed. Indexing collection.', 'IndexingService', 'indexCollectionIfOptionsHaveChanged');

            await this.notificationService.refreshingAsync();
            await this.scheduler.sleepAsync(1000); // Wait a bit to ensure user sees a refreshing notification
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

    public async indexAfterTagChangeAsync(fileMetaDatas: IFileMetadata[]): Promise<void> {
        const tracks: Track[] | undefined = this.trackRepository.getTracksForPaths(fileMetaDatas.map((f) => f.path));

        if (!tracks) {
            return;
        }

        const updatedTracks: Track[] = [];

        // Update track metadata in the database
        for (const track of tracks) {
            const fileMetaData: IFileMetadata | undefined = fileMetaDatas.find((f) => f.path === track.path);

            if (!fileMetaData) {
                continue;
            }

            const updatedTrack: Track = await this.trackFiller.addGivenFileMetadataToTrackAsync(track, fileMetaData, false);

            this.trackRepository.updateTrack(updatedTrack);
            updatedTracks.push(updatedTrack);
        }

        // Trigger album artwork indexing
        await this.indexAlbumArtworkOnlyAsync(false);

        // Refresh UI
        this.playbackService.updateQueueTracks(updatedTracks);
        this.indexingFinished.next();
    }

    public async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean, overwriteManuallyEditedCovers: boolean = false): Promise<void> {
        if (this.isIndexingCollection) {
            this.logger.info('Already indexing.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

            return;
        }

        this.isIndexingCollection = true;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexAlbumArtworkOnlyAsync');

        const albumKeyIndex = this.settings.albumKeyIndex;

        if (overwriteManuallyEditedCovers) {
            this.albumArtworkRepository.clearManuallySetFlag();
        }

        this.trackRepository.enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover, albumKeyIndex);
        this.albumArtworkRepository.deleteAlbumArtworkWithoutCover();

        await this.albumArtworkIndexer.indexAlbumArtworkAsync();

        this.isIndexingCollection = false;
        this.indexingFinished.next();
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
                await this.notificationService.refreshingAsync();
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
        this.currentIndexingTask = task;
        this.foldersHaveChanged = false;

        this.logger.info('Indexing collection.', 'IndexingService', 'indexCollection');

        this.ipcProxy.sendToMainProcess('indexing-worker', this.createWorkerArgs(task));
    }
}
