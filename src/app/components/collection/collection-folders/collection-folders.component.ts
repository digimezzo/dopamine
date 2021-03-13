import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Subscription } from 'rxjs';
import { Hacks } from '../../../core/hacks';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { PlaybackIndicationService } from '../../../services/playback-indication/playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { FoldersPersister } from './folders-persister';

@Component({
    selector: 'app-collection-folders',
    host: { style: 'display: block' },
    templateUrl: './collection-folders.component.html',
    styleUrls: ['./collection-folders.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionFoldersComponent implements OnInit, OnDestroy {
    constructor(
        public playbackService: BasePlaybackService,
        private settings: BaseSettings,
        private folderService: BaseFolderService,
        private navigationService: BaseNavigationService,
        private trackService: BaseTrackService,
        private playbackIndicationService: PlaybackIndicationService,
        private foldersPersister: FoldersPersister,
        private hacks: Hacks
    ) {}

    @ViewChild('split', { static: false }) public split: SplitComponent;
    @ViewChild('area1', { static: false }) public area1: SplitAreaDirective;
    @ViewChild('area2', { static: false }) public area2: SplitAreaDirective;

    private subscription: Subscription = new Subscription();

    public area1Size: number = this.settings.foldersLeftPaneWithPercent;
    public area2Size: number = 100 - this.settings.foldersLeftPaneWithPercent;

    public folders: FolderModel[] = [];
    public activeFolder: FolderModel;
    public subfolders: SubfolderModel[] = [];
    public selectedSubfolder: SubfolderModel;
    public subfolderBreadCrumbs: SubfolderModel[] = [];
    public tracks: TrackModels = new TrackModels();
    public selectedTrack: TrackModel;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        await this.fillListsAsync();

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                this.playbackIndicationService.setPlayingSubfolder(this.subfolders, playbackStarted.currentTrack);
                this.playbackIndicationService.setPlayingTrack(this.tracks.tracks, playbackStarted.currentTrack);
            })
        );
    }

    public dragEnd(event: any): void {
        this.settings.foldersLeftPaneWithPercent = event.sizes[0];
    }

    public async getFoldersAsync(): Promise<void> {
        this.folders = this.folderService.getFolders();
    }

    public async setActiveSubfolderAsync(subfolderToActivate: SubfolderModel): Promise<void> {
        if (this.activeFolder == undefined) {
            return;
        }

        this.subfolders = await this.folderService.getSubfoldersAsync(this.activeFolder, subfolderToActivate);
        const activeSubfolderPath = this.getActiveSubfolderPath();

        this.foldersPersister.saveActiveSubfolderToSettings(new SubfolderModel(activeSubfolderPath, false));

        this.subfolderBreadCrumbs = await this.folderService.getSubfolderBreadCrumbsAsync(this.activeFolder, activeSubfolderPath);
        this.tracks = await this.trackService.getTracksInSubfolderAsync(activeSubfolderPath);

        // HACK: when refreshing the subfolder list, the tooltip of the last hovered
        // subfolder remains visible. This function is a workaround for this problem.
        this.hacks.removeTooltips();

        this.playbackIndicationService.setPlayingSubfolder(this.subfolders, this.playbackService.currentTrack);
        this.playbackIndicationService.setPlayingTrack(this.tracks.tracks, this.playbackService.currentTrack);
    }

    public async setActiveFolderAsync(folderToActivate: FolderModel): Promise<void> {
        this.activeFolder = folderToActivate;

        this.foldersPersister.saveActiveFolderToSettings(folderToActivate);

        const activeSubfolderFromSettings: SubfolderModel = this.foldersPersister.getActiveSubfolderFromSettings();
        await this.setActiveSubfolderAsync(activeSubfolderFromSettings);
    }

    public setSelectedSubfolder(subfolder: SubfolderModel): void {
        this.selectedSubfolder = subfolder;
    }

    public goToManageCollection(): void {
        this.navigationService.navigateToManageCollection();
    }

    private async fillListsAsync(): Promise<void> {
        await this.getFoldersAsync();

        const activeFolderFromSettings: FolderModel = this.foldersPersister.getActiveFolderFromSettings(this.folders);
        await this.setActiveFolderAsync(activeFolderFromSettings);
    }

    private getActiveSubfolderPath(): string {
        return this.subfolders.length > 0 && this.subfolders.some((x) => x.isGoToParent)
            ? this.subfolders.filter((x) => x.isGoToParent)[0].path
            : this.activeFolder.path;
    }

    public setSelectedTrack(track: TrackModel): void {
        this.selectedTrack = track;
    }
}
