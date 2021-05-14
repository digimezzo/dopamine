import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Hacks } from '../../../core/hacks';
import { Logger } from '../../../core/logger';
import { Folder } from '../../../data/entities/folder';
import { Track } from '../../../data/entities/track';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionFoldersComponent } from './collection-folders.component';
import { FoldersPersister } from './folders-persister';

describe('CollectionFoldersComponent', () => {
    let settingsStub: any;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let folderServiceMock: IMock<BaseFolderService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let foldersPersisterMock: IMock<FoldersPersister>;
    let loggerMock: IMock<Logger>;
    let hacksMock: IMock<Hacks>;

    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;

    let folder1: FolderModel;
    let folder2: FolderModel;
    let folders: FolderModel[];

    let subfolder1: SubfolderModel;
    let subfolder2: SubfolderModel;
    let subfolders: SubfolderModel[];

    let track1: TrackModel;

    let component: CollectionFoldersComponent;

    beforeEach(() => {
        settingsStub = { foldersLeftPaneWidthPercent: 30 };
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        foldersPersisterMock = Mock.ofType<FoldersPersister>();
        loggerMock = Mock.ofType<Logger>();
        hacksMock = Mock.ofType<Hacks>();

        folder1 = new FolderModel(new Folder('/home/user/Music'));
        folder2 = new FolderModel(new Folder('/home/user/Downloads'));
        folders = [folder1, folder2];
        folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
        subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', true);
        subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
        subfolders = [subfolder1, subfolder2];
        folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

        foldersPersisterMock.setup((x) => x.getOpenedFolder(It.isAny())).returns(() => folder1);
        foldersPersisterMock.setup((x) => x.getOpenedSubfolder()).returns(() => subfolder1);

        trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

        track1 = new TrackModel(new Track('dummy'));
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();

        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        component = new CollectionFoldersComponent(
            playbackServiceMock.object,
            settingsStub,
            folderServiceMock.object,
            navigationServiceMock.object,
            trackServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            playbackIndicationServiceMock.object,
            foldersPersisterMock.object,
            loggerMock.object,
            hacksMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should set left pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.leftPaneSize).toEqual(30);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.rightPaneSize).toEqual(70);
        });

        it('should define folders', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.folders).toBeDefined();
        });

        it('should define subfolders', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.subfolders).toBeDefined();
        });

        it('should define subfolderBreadCrumbs', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.subfolderBreadCrumbs).toBeDefined();
        });

        it('should define tracks', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.tracks).toBeDefined();
        });

        it('should declare but not define selectedSubfolder', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.selectedSubfolder).toBeUndefined();
        });

        it('should declare but not define selectedTrack', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.selectedTrack).toBeUndefined();
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            30;
            // Act
            component.splitDragEnd({ sizes: [40, 60] });

            // Assert
            expect(settingsStub.foldersLeftPaneWidthPercent).toEqual(40);
        });
    });

    describe('getFoldersAsync', () => {
        it('should get the folders', () => {
            // Arrange

            // Act
            component.getFolders();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should get the folders', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);

            subfolder1 = new SubfolderModel('/home/user/Music/subfolder1', false);
            subfolder2 = new SubfolderModel('/home/user/Music/subfolder2', false);
            subfolders = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

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
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should set the playing subfolder', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should set the playing track', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, track1), Times.exactly(1));
        });

        it('should set the playing subfolder on playback started', async () => {
            // Arrange
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should set the playing track on playback started', async () => {
            // Arrange
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.tracks.tracks, track1), Times.exactly(1));
        });

        it('should set the opened folder from the settings', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.openedFolder).toBe(folder1);
        });

        it('should get subfolders for the the opened subfolder from the settings', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            foldersPersisterMock.verify(
                (x) => x.setOpenedSubfolder(It.isObjectWith<SubfolderModel>({ path: subfolder1.path })),
                Times.exactly(1)
            );
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange

            // Act
            component.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setOPenedFolderAsync', () => {
        it('should set the opened folder', async () => {
            // Arrange
            component.openedFolder = folder2;

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            expect(component.openedFolder).toEqual(folder1);
        });

        it('should get subfolders for the the opened subfolder from the settings', async () => {
            // Arrange

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should save the opened folder to the settings', async () => {
            // Arrange

            // Act
            await component.setOpenedFolderAsync(folder1);

            // Assert
            foldersPersisterMock.verify((x) => x.setOpenedFolder(folder1), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange

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
            await component.ngOnInit();

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get subfolders for the given opened subfolder if the opened folder is not undefined', async () => {
            // Arrange
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder1, subfolder1), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are no subfolders', async () => {
            // Arrange
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, folder1.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
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

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(folder1, subfolder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are no subfolders', async () => {
            // Arrange
            await component.ngOnInit();
            folderServiceMock.reset();
            folderServiceMock.setup((x) => x.getFolders()).returns(() => folders);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.setOpenedSubfolderAsync(subfolder1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(folder1.path), Times.exactly(1));
        });

        it('should get tracks for the opened folder if there are subfolders but none is go to parent', async () => {
            // Arrange
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

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.setOpenedSubfolderAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder1.path), Times.exactly(1));
        });

        it('should save the opened subfolder to the settings', async () => {
            // Arrange
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
    });
});
