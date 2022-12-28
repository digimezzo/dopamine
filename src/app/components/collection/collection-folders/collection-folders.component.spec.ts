import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Constants } from '../../../common/application/constants';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { Folder } from '../../../common/data/entities/folder';
import { Track } from '../../../common/data/entities/track';
import { DateTime } from '../../../common/date-time';
import { Hacks } from '../../../common/hacks';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { Scheduler } from '../../../common/scheduling/scheduler';
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
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { CollectionPersister } from '../collection-persister';
import { CollectionFoldersComponent } from './collection-folders.component';
import { FoldersPersister } from './folders-persister';

describe('CollectionFoldersComponent', () => {
    let settingsStub: any;
    let searchServiceMock: IMock<BaseSearchService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let collectionServiceMock: IMock<BaseCollectionService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let folderServiceMock: IMock<BaseFolderService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let foldersPersisterMock: IMock<FoldersPersister>;
    let schedulerMock: IMock<Scheduler>;
    let desktopMock: IMock<BaseDesktop>;
    let loggerMock: IMock<Logger>;
    let hacksMock: IMock<Hacks>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let dateTimeMock: IMock<DateTime>;
    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;
    let indexingServiceIndexingFinishedMock: Subject<void>;

    let collectionChangedMock: Subject<void>;
    let collectionChangedMock$: Observable<void>;

    let folder1: FolderModel;
    let folder2: FolderModel;
    let folders: FolderModel[];

    let subfolder1: SubfolderModel;
    let subfolder2: SubfolderModel;
    let subfolders: SubfolderModel[];

    let track1: Track;
    let track2: Track;

    let trackModel1: TrackModel;
    let trackModel2: TrackModel;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

    let metadataService_ratingSaved: Subject<TrackModel>;

    let tracks: TrackModels;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionFoldersComponent {
        const component: CollectionFoldersComponent = new CollectionFoldersComponent(
            searchServiceMock.object,
            appearanceServiceMock.object,
            folderServiceMock.object,
            playbackServiceMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            addToPlaylistMenuMock.object,
            metadataServiceMock.object,
            indexingServiceMock.object,
            collectionServiceMock.object,
            collectionPersisterMock.object,
            settingsStub,
            navigationServiceMock.object,
            trackServiceMock.object,
            playbackIndicationServiceMock.object,
            foldersPersisterMock.object,
            schedulerMock.object,
            desktopMock.object,
            loggerMock.object,
            hacksMock.object
        );

        return component;
    }

    beforeEach(() => {
        settingsStub = { foldersLeftPaneWidthPercent: 30 };
        searchServiceMock = Mock.ofType<BaseSearchService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        collectionServiceMock = Mock.ofType<BaseCollectionService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        foldersPersisterMock = Mock.ofType<FoldersPersister>();
        loggerMock = Mock.ofType<Logger>();
        hacksMock = Mock.ofType<Hacks>();
        schedulerMock = Mock.ofType<Scheduler>();
        desktopMock = Mock.ofType<BaseDesktop>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        dateTimeMock = Mock.ofType<DateTime>();

        folder1 = new FolderModel(new Folder('/home/user/Music'));
        folder2 = new FolderModel(new Folder('/home/user/Downloads'));
        folders = [folder1, folder2];
        folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
        subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', true);
        subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
        subfolders = [subfolder1, subfolder2];
        folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);
        folderServiceMock.setup((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

        foldersPersisterMock.setup((x) => x.getOpenedFolder(It.isAny())).returns(() => folder1);
        foldersPersisterMock.setup((x) => x.getOpenedSubfolder()).returns(() => subfolder1);

        track1 = new Track('track1');
        track1.rating = 1;
        track2 = new Track('track2');
        track2.rating = 2;
        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);

        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);

        trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => tracks);

        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);

        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStoppedMock$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStoppedMock$);

        indexingServiceIndexingFinishedMock = new Subject();
        const indexingServiceIndexingFinishedMock$: Observable<void> = indexingServiceIndexingFinishedMock.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingServiceIndexingFinishedMock$);

        collectionChangedMock = new Subject();
        collectionChangedMock$ = collectionChangedMock.asObservable();
        collectionServiceMock.setup((x) => x.collectionChanged$).returns(() => collectionChangedMock$);

        selectedTabChangedMock = new Subject();
        selectedTabChangedMock$ = selectedTabChangedMock.asObservable();
        collectionPersisterMock.setup((x) => x.selectedTabChanged$).returns(() => selectedTabChangedMock$);

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should set left pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(30);
        });

        it('should set right pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(70);
        });

        it('should define folders', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.folders).toBeDefined();
        });

        it('should define subfolders', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolders).toBeDefined();
        });

        it('should define subfolderBreadCrumbs', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolderBreadCrumbs).toBeDefined();
        });

        it('should define tracks', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.tracks).toBeDefined();
        });

        it('should declare but not define selectedSubfolder', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.selectedSubfolder).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define folderService', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.folderService).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.contextMenuOpener).toBeDefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.mouseSelectionWatcher).toBeDefined();
        });

        it('should declare trackContextMenu', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.trackContextMenu).toBeUndefined();
        });

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.addToPlaylistMenu).toBeDefined();
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [40, 60] });

            // Assert
            expect(settingsStub.foldersLeftPaneWidthPercent).toEqual(40);
        });
    });

    describe('getFoldersAsync', () => {
        it('should get the folders', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            component.getFolders();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should get the folders if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get the folders if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the opened folder if there are no subfolders and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get tracks for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are subfolders but none is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should not get tracks if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(It.isAny()), Times.never());
        });

        it('should set the playing subfolder if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, trackModel1), Times.exactly(1));
        });

        it('should not set the playing subfolder if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(It.isAny(), It.isAny()), Times.never());
        });

        it('should set the playing track if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, trackModel1), Times.exactly(1));
        });

        it('should not set the playing track if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(It.isAny(), It.isAny()), Times.never());
        });

        it('should set the playing subfolder on playback started', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            component.subfolders = subfolders;
            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, trackModel1), Times.exactly(1));
        });

        it('should set the playing track on playback started', async () => {
            // Arrange
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, trackModel1), Times.exactly(1));
        });

        it('should set the opened folder from the settings if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBe(folder1);
        });

        it('should not set the opened folder from the settings if the selected tab is not folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBeUndefined();
        });

        it('should get subfolders for the the opened subfolder from the settings  if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should not get subfolders for the the opened subfolder from the settings if the selected tab is not folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.never());
        });

        it('should save the opened subfolder to the settings if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1)
            );
        });

        it('should not save the opened subfolder to the settings if the selected tab is not folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedSubfolder(It.isAny()), Times.never());
        });

        it('should get the folders when indexing is finished and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            indexingServiceIndexingFinishedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get the folders when indexing is finished and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            indexingServiceIndexingFinishedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should fill the lists if the selected tab changes to folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            component.folders = [];
            component.subfolders = [];
            component.subfolderBreadCrumbs = [];
            component.tracks = new TrackModels();

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            expect(component.folders.length).toEqual(2);
            expect(component.subfolders.length).toEqual(2);
            expect(component.subfolderBreadCrumbs.length).toEqual(2);
            expect(component.tracks.tracks.length).toEqual(2);
        });

        it('should clear the lists if the selected tab changes to not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            component.folders = [];
            component.subfolders = [];
            component.subfolderBreadCrumbs = [];
            component.tracks = new TrackModels();

            selectedTabChangedMock.next();
            await flushPromises();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            expect(component.folders.length).toEqual(0);
            expect(component.subfolders.length).toEqual(0);
            expect(component.subfolderBreadCrumbs.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should get the folders when collection has changed and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            collectionChangedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get the folders when collection has changed and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            collectionChangedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should update the rating for a track that has the same path as the track for which rating was saved', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);
            const component: CollectionFoldersComponent = createComponent();
            component.tracks = tracks;

            const track3 = new Track('track1');
            track3.rating = 3;

            const trackModel3: TrackModel = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);

            // Act
            component.ngOnInit();
            metadataService_ratingSaved.next(trackModel3);

            // Assert
            expect(trackModel1.rating).toEqual(3);
            expect(trackModel2.rating).toEqual(2);
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            component.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setOPenedFolderAsync', () => {
        it('should set the opened folder', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            component.openedFolder = folder2;

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            expect(component.openedFolder).toEqual(folder1);
        });

        it('should get subfolders for the the opened subfolder from the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should save the opened folder to the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedFolder(folder1), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1)
            );
        });
    });

    describe('setSelectedSubfolder', () => {
        it('should set the selected subfolder', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            component.selectedSubfolder = undefined;

            // Act
            component.setSelectedSubfolder(subfolder1);

            // Assert
            expect(component.selectedSubfolder).toBe(subfolder1);
        });
    });

    describe('setSelectedTrack', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            component.tracks = tracks;
            const event: any = {};

            // Act
            component.setSelectedTrack(event, trackModel1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel1), Times.exactly(1));
        });
    });

    describe('setOpenedSubfolderAsync', () => {
        it('should not get subfolders if the opened folder is undefined', async () => {
            // Arrange
            foldersPersisterMock.reset();
            foldersPersisterMock.setup((x) => x.getOpenedFolder(It.isAny())).returns(() => undefined);
            foldersPersisterMock.setup((x) => x.getOpenedSubfolder()).returns(() => subfolder1);
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get subfolders for the given opened subfolder if the opened folder is not undefined and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should not get subfolders for the given opened subfolder if the opened folder is not undefined and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the opened folder if there are no subfolders and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the opened folder if there are subfolders but none is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.never());
        });

        it('should get tracks for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should not get tracks for the opened folder if there are no subfolders and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(It.isAny()), Times.never());
        });

        it('should get tracks for the opened folder if there are subfolders but none is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should not get tracks for the opened folder if there are subfolders but none is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(It.isAny()), Times.never());
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.setOpenedSubfolderAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should not get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.setOpenedSubfolderAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.never());
        });

        it('should save the opened subfolder to the settings and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            foldersPersisterMock.reset();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1)
            );
        });

        it('should not save the opened subfolder to the settings and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            foldersPersisterMock.reset();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedSubfolder(It.isAny()), Times.never());
        });

        it('should initialize MouseSelectionWatcher using tracks if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.foldersTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            mouseSelectionWatcherMock.reset();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(component.tracks.tracks, false), Times.exactly(1));
        });

        it('should not initialize MouseSelectionWatcher using tracks if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(component.tracks.tracks, false), Times.never());
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected tracks to the queue', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.onAddToQueueAsync();

            // Assert
            playbackServiceMock.verify((x) => x.addTracksToQueueAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onTrackContextMenuAsync', () => {
        it('should open the track context menu', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            const event: any = {};

            // Act
            component.onTrackContextMenuAsync(event, trackModel1);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(component.trackContextMenu, event, trackModel1), Times.once());
        });
    });

    describe('onShowInFolder', () => {
        it('should not show in folder if there are no tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => []);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(It.isAny()), Times.never());
        });

        it('should show the first selected track in folder if there are tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(trackModel1.path), Times.once());
        });
    });
});
