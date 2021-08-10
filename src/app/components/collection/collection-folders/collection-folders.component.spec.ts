import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Constants } from '../../../common/application/constants';
import { Folder } from '../../../common/data/entities/folder';
import { Track } from '../../../common/data/entities/track';
import { Hacks } from '../../../common/hacks';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionPersister } from '../collection-persister';
import { CollectionTab } from '../collection-tab';
import { CollectionFoldersComponent } from './collection-folders.component';
import { FoldersPersister } from './folders-persister';

describe('CollectionFoldersComponent', () => {
    let settingsStub: any;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let folderServiceMock: IMock<BaseFolderService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let foldersPersisterMock: IMock<FoldersPersister>;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let hacksMock: IMock<Hacks>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;
    let indexingServiceIndexingFinishedMock: Subject<void>;

    let folder1: FolderModel;
    let folder2: FolderModel;
    let folders: FolderModel[];

    let subfolder1: SubfolderModel;
    let subfolder2: SubfolderModel;
    let subfolders: SubfolderModel[];

    let track1: TrackModel;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

    const flushPromises = () => new Promise(setImmediate);

    function createComponent(): CollectionFoldersComponent {
        const component: CollectionFoldersComponent = new CollectionFoldersComponent(
            folderServiceMock.object,
            playbackServiceMock.object,
            indexingServiceMock.object,
            collectionPersisterMock.object,
            settingsStub,
            navigationServiceMock.object,
            trackServiceMock.object,
            playbackIndicationServiceMock.object,
            foldersPersisterMock.object,
            schedulerMock.object,
            loggerMock.object,
            hacksMock.object
        );

        return component;
    }

    beforeEach(() => {
        settingsStub = { foldersLeftPaneWidthPercent: 30 };
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
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
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

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

        track1 = new TrackModel(new Track('dummy'), translatorServiceMock.object);

        const tracks: TrackModels = new TrackModels();
        tracks.addTrack(track1);

        trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => tracks);

        playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);

        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStoppedMock$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStoppedMock$);

        indexingServiceIndexingFinishedMock = new Subject();
        const indexingServiceIndexingFinishedMock$: Observable<void> = indexingServiceIndexingFinishedMock.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingServiceIndexingFinishedMock$);

        selectedTabChangedMock = new Subject();
        selectedTabChangedMock$ = selectedTabChangedMock.asObservable();
        collectionPersisterMock.setup((x) => x.selectedTabChanged$).returns(() => selectedTabChangedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should set left pane size from settings', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(30);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(70);
        });

        it('should define folders', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.folders).toBeDefined();
        });

        it('should define subfolders', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolders).toBeDefined();
        });

        it('should define subfolderBreadCrumbs', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolderBreadCrumbs).toBeDefined();
        });

        it('should define tracks', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.tracks).toBeDefined();
        });

        it('should declare but not define selectedSubfolder', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.selectedSubfolder).toBeUndefined();
        });

        it('should declare but not define selectedTrack', async () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.selectedTrack).toBeUndefined();
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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get the folders if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should not get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent and the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get tracks for the opened folder if there are no subfolders and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should not get tracks if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(It.isAny()), Times.never());
        });

        it('should set the playing subfolder if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should not set the playing subfolder if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(It.isAny(), It.isAny()), Times.never());
        });

        it('should set the playing track if the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, track1), Times.exactly(1));
        });

        it('should not set the playing track if the selected tab is not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should set the playing track on playback started', async () => {
            // Arrange
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, track1), Times.exactly(1));
        });

        it('should set the opened folder from the settings if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBe(folder1);
        });

        it('should not set the opened folder from the settings if the selected tab is not folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBeUndefined();
        });

        it('should get subfolders for the the opened subfolder from the settings  if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should not get subfolders for the the opened subfolder from the settings if the selected tab is not folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.never());
        });

        it('should save the opened subfolder to the settings if the selected tab is folders', async () => {
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedSubfolder(It.isAny()), Times.never());
        });

        it('should get the folders when indexing is finished and the selected tab is folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            expect(component.tracks.tracks.length).toEqual(1);
        });

        it('should clear the lists if the selected tab changes to not folders', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();

            component.folders = [];
            component.subfolders = [];
            component.subfolderBreadCrumbs = [];
            component.tracks = new TrackModels();

            selectedTabChangedMock.next();
            await flushPromises();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            expect(component.folders.length).toEqual(0);
            expect(component.subfolders.length).toEqual(0);
            expect(component.subfolderBreadCrumbs.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
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
        it('should set the selected track', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            component.selectedTrack = undefined;

            // Act
            component.setSelectedTrack(track1);

            // Assert
            expect(component.selectedTrack).toBe(track1);
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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.folders);

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
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            foldersPersisterMock.reset();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedSubfolder(It.isAny()), Times.never());
        });
    });
});
