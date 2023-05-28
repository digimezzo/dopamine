import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Subscription } from 'rxjs';
import { Constants } from '../../../common/application/constants';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { Hacks } from '../../../common/hacks';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseMetadataService } from '../../../services/metadata/base-metadata.service';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { CollectionPersister } from '../collection-persister';
import { FoldersPersister } from './folders-persister';

@Component({
    selector: 'app-collection-folders',
    host: { style: 'display: block' },
    templateUrl: './collection-folders.component.html',
    styleUrls: ['./collection-folders.component.scss'],
    providers: [MouseSelectionWatcher],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionFoldersComponent implements OnInit, OnDestroy {
    constructor(
        public searchService: BaseSearchService,
        public appearanceService: BaseAppearanceService,
        public folderService: BaseFolderService,
        public playbackService: BasePlaybackService,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public addToPlaylistMenu: AddToPlaylistMenu,
        private metadataService: BaseMetadataService,
        private indexingService: BaseIndexingService,
        private collectionService: BaseCollectionService,
        private collectionPersister: CollectionPersister,
        private settings: BaseSettings,
        private navigationService: BaseNavigationService,
        private trackService: BaseTrackService,
        private playbackIndicationService: BasePlaybackIndicationService,
        private foldersPersister: FoldersPersister,
        private scheduler: Scheduler,
        private desktop: BaseDesktop,
        private logger: Logger,
        private hacks: Hacks
    ) {}

    private subscription: Subscription = new Subscription();

    @ViewChild('trackContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public trackContextMenu: MatMenuTrigger;

    public leftPaneSize: number = this.settings.foldersLeftPaneWidthPercent;
    public rightPaneSize: number = 100 - this.settings.foldersLeftPaneWidthPercent;

    public folders: FolderModel[] = [];
    public openedFolder: FolderModel;
    public subfolders: SubfolderModel[] = [];
    public selectedSubfolder: SubfolderModel;
    public subfolderBreadCrumbs: SubfolderModel[] = [];
    public tracks: TrackModels = new TrackModels();

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingSubfolder(this.subfolders, playbackStarted.currentTrack);
                this.playbackIndicationService.setPlayingTrack(this.tracks.tracks, playbackStarted.currentTrack);
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.playbackIndicationService.clearPlayingSubfolder(this.subfolders);
                this.playbackIndicationService.clearPlayingTrack(this.tracks.tracks);
            })
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(() => {
                this.processListsAsync();
            })
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                this.processListsAsync();
            })
        );

        this.subscription.add(
            this.collectionPersister.selectedTabChanged$.subscribe(() => {
                this.processListsAsync();
            })
        );

        this.subscription.add(
            this.metadataService.ratingSaved$.subscribe((track: TrackModel) => {
                this.updateTrackRating(track);
            })
        );

        await this.processListsAsync();
    }

    private updateTrackRating(trackWithUpToDateRating: TrackModel): void {
        for (const track of this.tracks.tracks) {
            if (track.path === trackWithUpToDateRating.path) {
                track.rating = trackWithUpToDateRating.rating;
            }
        }
    }

    public splitDragEnd(event: any): void {
        this.settings.foldersLeftPaneWidthPercent = event.sizes[0];
    }

    public getFolders(): void {
        try {
            this.folders = this.folderService.getFolders();
        } catch (e) {
            this.logger.error(`Could not get folders. Error: ${e.message}`, 'CollectionFoldersComponent', 'getFolders');
        }
    }

    public async setOpenedSubfolderAsync(subfolderToActivate: SubfolderModel): Promise<void> {
        if (this.openedFolder == undefined) {
            return;
        }

        try {
            this.subfolders = await this.folderService.getSubfoldersAsync(this.openedFolder, subfolderToActivate);
            const openedSubfolderPath = this.getOpenedSubfolderPath();

            this.foldersPersister.setOpenedSubfolder(new SubfolderModel(openedSubfolderPath, false));

            this.subfolderBreadCrumbs = await this.folderService.getSubfolderBreadCrumbsAsync(this.openedFolder, openedSubfolderPath);
            this.tracks = await this.trackService.getTracksInSubfolderAsync(openedSubfolderPath);
            this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);

            // HACK: when refreshing the subfolder list, the tooltip of the last hovered
            // subfolder remains visible. This function is a workaround for this problem.
            this.hacks.removeTooltips();

            this.playbackIndicationService.setPlayingSubfolder(this.subfolders, this.playbackService.currentTrack);
            this.playbackIndicationService.setPlayingTrack(this.tracks.tracks, this.playbackService.currentTrack);
        } catch (e) {
            this.logger.error(
                `Could not set the opened subfolder. Error: ${e.message}`,
                'CollectionFoldersComponent',
                'setOpenedSubfolderAsync'
            );
        }
    }

    public async setOpenedFolderAsync(folderToActivate: FolderModel): Promise<void> {
        this.openedFolder = folderToActivate;

        this.foldersPersister.setOpenedFolder(folderToActivate);

        const persistedOpenedSubfolder: SubfolderModel = this.foldersPersister.getOpenedSubfolder();
        await this.setOpenedSubfolderAsync(persistedOpenedSubfolder);
    }

    public setSelectedSubfolder(subfolder: SubfolderModel): void {
        this.selectedSubfolder = subfolder;
    }

    public goToManageCollection(): void {
        this.navigationService.navigateToManageCollection();
    }

    private async processListsAsync(): Promise<void> {
        if (this.collectionPersister.selectedTab === Constants.foldersTabLabel) {
            await this.fillListsAsync();
        } else {
            this.clearLists();
        }
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);
        this.getFolders();

        await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
        const persistedOpenedFolder: FolderModel = this.foldersPersister.getOpenedFolder(this.folders);
        await this.setOpenedFolderAsync(persistedOpenedFolder);
    }

    private clearLists(): void {
        this.folders = [];
        this.subfolders = [];
        this.subfolderBreadCrumbs = [];
        this.tracks = new TrackModels();
    }

    private getOpenedSubfolderPath(): string {
        return this.subfolders.length > 0 && this.subfolders.some((x) => x.isGoToParent)
            ? this.subfolders.filter((x) => x.isGoToParent)[0].path
            : this.openedFolder.path;
    }

    public setSelectedTrack(event: any, trackToSelect: TrackModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, trackToSelect);
    }

    public async onTrackContextMenuAsync(event: MouseEvent, track: TrackModel): Promise<void> {
        this.contextMenuOpener.open(this.trackContextMenu, event, track);
    }

    public async onAddToQueueAsync(): Promise<void> {
        await this.playbackService.addTracksToQueueAsync(this.mouseSelectionWatcher.selectedItems);
    }

    public onShowInFolder(): void {
        const tracks: TrackModel[] = this.mouseSelectionWatcher.selectedItems;

        if (tracks.length > 0) {
            this.desktop.showFileInDirectory(tracks[0].path);
        }
    }
}
