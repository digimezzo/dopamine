import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IOutputData } from 'angular-split';
import { Subscription } from 'rxjs';
import { Constants } from '../../../../common/application/constants';
import { Hacks } from '../../../../common/hacks';
import { Logger } from '../../../../common/logger';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { FolderModel } from '../../../../services/folder/folder-model';
import { SubfolderModel } from '../../../../services/folder/subfolder-model';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { TrackModels } from '../../../../services/track/track-models';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { FolderTracksPersister } from './folder-tracks-persister';
import { FoldersPersister } from './folders-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { FolderServiceBase } from '../../../../services/folder/folder.service.base';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { PlaybackIndicationServiceBase } from '../../../../services/playback-indication/playback-indication.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../context-menu-opener';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';
import { MatMenuTrigger } from '@angular/material/menu';
import { DesktopBase } from '../../../../common/io/desktop.base';

@Component({
    selector: 'app-collection-folders',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './collection-folders.component.html',
    styleUrls: ['./collection-folders.component.scss'],
    providers: [MouseSelectionWatcher],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionFoldersComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        public searchService: SearchServiceBase,
        public appearanceService: AppearanceServiceBase,
        public folderService: FolderServiceBase,
        public playbackService: PlaybackService,
        public tracksPersister: FolderTracksPersister,
        public contextMenuOpener: ContextMenuOpener,
        public mouseSelectionWatcher: MouseSelectionWatcher,
        public addToPlaylistMenu: AddToPlaylistMenu,
        private indexingService: IndexingService,
        private collectionService: CollectionServiceBase,
        private settings: SettingsBase,
        private navigationService: NavigationServiceBase,
        private trackService: TrackServiceBase,
        private playbackIndicationService: PlaybackIndicationServiceBase,
        private foldersPersister: FoldersPersister,
        private scheduler: SchedulerBase,
        private logger: Logger,
        private hacks: Hacks,
        private desktop: DesktopBase,
    ) {}

    @ViewChild('subfolderContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public subfolderContextMenu: MatMenuTrigger;

    public leftPaneSize: number = this.settings.foldersLeftPaneWidthPercent;
    public rightPaneSize: number = 100 - this.settings.foldersLeftPaneWidthPercent;

    public folders: FolderModel[] = [];
    public openedFolder: FolderModel;
    public subfolders: SubfolderModel[] = [];
    public selectedSubfolder: SubfolderModel | undefined;
    public subfolderBreadcrumbs: SubfolderModel[] = [];
    public tracks: TrackModels = new TrackModels();

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearLists();
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingSubfolder(this.subfolders, playbackStarted.currentTrack);
            }),
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.playbackIndicationService.clearPlayingSubfolder(this.subfolders);
            }),
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        this.subscription.add(
            this.collectionService.collectionChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillListsAsync());
            }),
        );

        await this.fillListsAsync();
    }

    public splitDragEnd(event: IOutputData): void {
        this.settings.foldersLeftPaneWidthPercent = <number>event.sizes[0];
    }

    public getFolders(): void {
        try {
            this.folders = this.folderService.getFolders();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get folders', 'CollectionFoldersComponent', 'getFolders');
        }
    }

    public async setOpenedSubfolderAsync(subfolderToActivate: SubfolderModel | undefined): Promise<void> {
        if (this.openedFolder == undefined) {
            return;
        }

        try {
            this.subfolders = await this.folderService.getSubfoldersAsync(this.openedFolder, subfolderToActivate);
            const openedSubfolderPath = this.getOpenedSubfolderPath();

            this.foldersPersister.setOpenedSubfolder(new SubfolderModel(openedSubfolderPath, false));

            this.subfolderBreadcrumbs = this.folderService.getSubfolderBreadcrumbs(this.openedFolder, openedSubfolderPath);
            this.tracks = await this.trackService.getTracksInSubfolderAsync(openedSubfolderPath);
            this.mouseSelectionWatcher.initialize(this.tracks.tracks, false);

            // HACK: when refreshing the subfolder list, the tooltip of the last hovered
            // subfolder remains visible. This function is a workaround for this problem.
            this.hacks.removeTooltips();

            this.playbackIndicationService.setPlayingSubfolder(this.subfolders, this.playbackService.currentTrack);
            this.playbackIndicationService.setPlayingTrack(this.tracks.tracks, this.playbackService.currentTrack);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set the opened subfolder', 'CollectionFoldersComponent', 'setOpenedSubfolderAsync');
        }
    }

    public async setOpenedFolderAsync(folderToActivate: FolderModel): Promise<void> {
        this.openedFolder = folderToActivate;

        this.foldersPersister.setOpenedFolder(folderToActivate);

        const persistedOpenedSubfolder: SubfolderModel | undefined = this.foldersPersister.getOpenedSubfolder();
        await this.setOpenedSubfolderAsync(persistedOpenedSubfolder);
    }

    public setSelectedSubfolder(subfolder: SubfolderModel): void {
        this.selectedSubfolder = subfolder;
    }

    public async goToManageCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToManageCollectionAsync();
    }

    public onSubfolderContextMenu(event: MouseEvent, subfolder: SubfolderModel): void {
        this.contextMenuOpener.open(this.subfolderContextMenu, event, subfolder);
    }

    public async onOpenSubfolderAsync(subfolder: SubfolderModel): Promise<void> {
        await this.desktop.openPathAsync(subfolder.path);
    }

    private async fillListsAsync(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds);
        this.getFolders();

        await this.scheduler.sleepAsync(Constants.shortListLoadDelayMilliseconds);
        const persistedOpenedFolder: FolderModel | undefined = this.foldersPersister.getOpenedFolder(this.folders);

        if (persistedOpenedFolder != undefined) {
            await this.setOpenedFolderAsync(persistedOpenedFolder);
        }
    }

    private clearLists(): void {
        this.folders = [];
        this.subfolders = [];
        this.subfolderBreadcrumbs = [];
        this.tracks = new TrackModels();
    }

    private getOpenedSubfolderPath(): string {
        return this.subfolders.length > 0 && this.subfolders.some((x) => x.isGoToParent)
            ? this.subfolders.filter((x) => x.isGoToParent)[0].path
            : this.openedFolder.path;
    }
}
