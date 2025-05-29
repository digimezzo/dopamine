import { IOutputData } from 'angular-split';
import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { CollectionFoldersComponent } from './collection-folders.component';
import { FolderTracksPersister } from './folder-tracks-persister';
import { FoldersPersister } from './folders-persister';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { FolderServiceBase } from '../../../../services/folder/folder.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { PlaybackIndicationServiceBase } from '../../../../services/playback-indication/playback-indication.service.base';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { Logger } from '../../../../common/logger';
import { Hacks } from '../../../../common/hacks';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { ContextMenuOpener } from '../../context-menu-opener';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { DateTime } from '../../../../common/date-time';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { FolderModel } from '../../../../services/folder/folder-model';
import { SubfolderModel } from '../../../../services/folder/subfolder-model';
import { Track } from '../../../../data/entities/track';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { Folder } from '../../../../data/entities/folder';
import { Constants } from '../../../../common/application/constants';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';

describe('CollectionFoldersComponent', () => {
    let settingsStub: any;
    let searchServiceMock: IMock<SearchServiceBase>;
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let indexingServiceMock: IMock<IndexingService>;
    let collectionServiceMock: IMock<CollectionServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let playbackServiceMock: IMock<PlaybackService>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let trackServiceMock: IMock<TrackServiceBase>;
    let playbackIndicationServiceMock: IMock<PlaybackIndicationServiceBase>;
    let foldersPersisterMock: IMock<FoldersPersister>;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let hacksMock: IMock<Hacks>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let dateTimeMock: IMock<DateTime>;
    let folderTracksPersisterMock: IMock<FolderTracksPersister>;
    let desktopMock: IMock<DesktopBase>;

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

    let metadataService_ratingSaved: Subject<TrackModel>;

    let tracks: TrackModels;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionFoldersComponent {
        return new CollectionFoldersComponent(
            searchServiceMock.object,
            appearanceServiceMock.object,
            folderServiceMock.object,
            playbackServiceMock.object,
            folderTracksPersisterMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            addToPlaylistMenuMock.object,
            indexingServiceMock.object,
            collectionServiceMock.object,
            settingsStub,
            navigationServiceMock.object,
            trackServiceMock.object,
            playbackIndicationServiceMock.object,
            foldersPersisterMock.object,
            schedulerMock.object,
            loggerMock.object,
            hacksMock.object,
            desktopMock.object,
        );
    }

    beforeEach(() => {
        settingsStub = { foldersLeftPaneWidthPercent: 30 };
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        trackServiceMock = Mock.ofType<TrackServiceBase>();
        playbackIndicationServiceMock = Mock.ofType<PlaybackIndicationServiceBase>();
        foldersPersisterMock = Mock.ofType<FoldersPersister>();
        loggerMock = Mock.ofType<Logger>();
        hacksMock = Mock.ofType<Hacks>();
        schedulerMock = Mock.ofType<Scheduler>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        dateTimeMock = Mock.ofType<DateTime>();
        folderTracksPersisterMock = Mock.ofType<FolderTracksPersister>();
        desktopMock = Mock.ofType<DesktopBase>();

        folder1 = new FolderModel(new Folder('/home/user/Music'));
        folder2 = new FolderModel(new Folder('/home/user/Downloads'));
        folders = [folder1, folder2];
        folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
        subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', true);
        subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
        subfolders = [subfolder1, subfolder2];
        folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));
        folderServiceMock.setup((x) => x.getSubfolderBreadcrumbs(It.isAny(), It.isAny())).returns(() => subfolders);

        foldersPersisterMock.setup((x) => x.getOpenedFolder(It.isAny())).returns(() => folder1);
        foldersPersisterMock.setup((x) => x.getOpenedSubfolder()).returns(() => subfolder1);

        track1 = new Track('track1');
        track1.rating = 1;
        track2 = new Track('track2');
        track2.rating = 2;
        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsStub);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsStub);

        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);

        trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(() => Promise.resolve(tracks));

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

        it('should define subfolderBreadcrumbs', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolderBreadcrumbs).toBeDefined();
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

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.addToPlaylistMenu).toBeDefined();
        });

        it('should declare subfolderContextMenu', () => {
            // Arrange

            // Act
            const component: CollectionFoldersComponent = createComponent();

            // Assert
            expect(component.subfolderContextMenu).toBeUndefined();
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [40, 60] } as IOutputData);

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
        it('should get the folders', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve([]));
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve([]));
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should set the playing subfolder', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, trackModel1), Times.exactly(1));
        });

        it('should set the playing track', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, trackModel1), Times.exactly(1));
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

        it('should set the opened folder from the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBe(folder1);
        });

        it('should get subfolders for the the opened subfolder from the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1),
            );
        });

        it('should get the folders when indexing is finished', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            indexingServiceIndexingFinishedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should get the folders when collection has changed', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            collectionChangedMock.next();
            const scheduler: Scheduler = new Scheduler();
            await scheduler.sleepAsync(Constants.longListLoadDelayMilliseconds + Constants.shortListLoadDelayMilliseconds + 100);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();

            // Act
            await component.goToManageCollectionAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollectionAsync(), Times.exactly(1));
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
                Times.exactly(1),
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

        it('should get subfolders for the given opened subfolder if the opened folder is not undefined', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve([]));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadcrumbs(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are no subfolders', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve([]));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(subfolders));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(() => Promise.resolve(new TrackModels()));

            // Act
            await component.setOpenedSubfolderAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            foldersPersisterMock.reset();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1),
            );
        });

        it('should initialize MouseSelectionWatcher using tracks', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            await component.ngOnInit();
            mouseSelectionWatcherMock.reset();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve([]));

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(component.tracks.tracks, false), Times.exactly(1));
        });
    });

    describe('onSubfolderContextMenu', () => {
        it('should open the context menu', () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            const event: MouseEvent = new MouseEvent('contextmenu');
            const subfolder: SubfolderModel = subfolder1;

            // Act
            component.onSubfolderContextMenu(event, subfolder);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(component.subfolderContextMenu, event, subfolder), Times.exactly(1));
        });
    });

    describe('onOpenSubfolderAsync', () => {
        it('should open the given folder in the desktop', async () => {
            // Arrange
            const component: CollectionFoldersComponent = createComponent();
            desktopMock.setup((x) => x.openPathAsync(subfolder1.path)).returns(() => Promise.resolve());

            // Act
            await component.onOpenSubfolderAsync(subfolder1);

            // Assert
            desktopMock.verify((x) => x.openPathAsync(subfolder1.path), Times.exactly(1));
        });
    });
});
