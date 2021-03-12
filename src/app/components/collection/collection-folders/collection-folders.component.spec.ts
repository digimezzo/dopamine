import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Hacks } from '../../../core/hacks';
import { BaseSettings } from '../../../core/settings/base-settings';
import { SettingsStub } from '../../../core/settings/settings-stub';
import { Folder } from '../../../data/entities/folder';
import { Track } from '../../../data/entities/track';
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
import { CollectionFoldersComponent } from './collection-folders.component';

describe('CollectionFoldersComponent', () => {
    let settingsMock: BaseSettings;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let folderServiceMock: IMock<BaseFolderService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let hacksMock: IMock<Hacks>;

    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;

    let component: CollectionFoldersComponent;

    beforeEach(() => {
        settingsMock = new SettingsStub();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        hacksMock = Mock.ofType<Hacks>();

        settingsMock.foldersLeftPaneWithPercent = 30;

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();

        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        component = new CollectionFoldersComponent(
            playbackServiceMock.object,
            settingsMock,
            folderServiceMock.object,
            navigationServiceMock.object,
            trackServiceMock.object,
            playbackIndicationServiceMock.object,
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

        it('should set area1 size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.area1Size).toEqual(30);
        });

        it('should set area2 size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.area2Size).toEqual(70);
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

    describe('dragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            settingsMock.foldersLeftPaneWithPercent = 45;

            // Act
            component.dragEnd({ sizes: [30, 70] });

            // Assert
            expect(settingsMock.foldersLeftPaneWithPercent).toEqual(30);
        });
    });

    describe('getFoldersAsync', () => {
        it('should get the folders', async () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);

            // Act
            await component.getFoldersAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should get the folders', async () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);

            // Act
            component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should set the selected folder to the first folder if it is undefined', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedFolder).toEqual(folder1);
        });

        it('should not set the selected folder if it is not undefined', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            component.selectedFolder = folder2;

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedFolder).toEqual(folder2);
        });

        it('should get subfolders for an undefined subfolder', async () => {
            // Arrange
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = folder;

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), undefined), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are no subfolders', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, subfolder2.path), Times.exactly(1));
        });

        it('should get tracks for the selected folder if there are no subfolders', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(selectedFolder.path), Times.exactly(1));
        });

        it('should get tracks for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(selectedFolder.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder2.path), Times.exactly(1));
        });

        it('should set the playing subfolder', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            const subfolders: SubfolderModel[] = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            const track1: TrackModel = new TrackModel(new Track('dummy'));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should set the playing track', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            const subfolders: SubfolderModel[] = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            const tracks: TrackModels = new TrackModels();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => tracks);

            const track1: TrackModel = new TrackModel(new Track('dummy'));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);

            // Act
            await component.ngOnInit();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(tracks.tracks, track1), Times.exactly(1));
        });

        it('should set the playing subfolder on playback started', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            const subfolders: SubfolderModel[] = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            const track1: TrackModel = new TrackModel(new Track('dummy'));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingSubfolder(subfolders, track1), Times.exactly(1));
        });

        it('should set the playing track on playback started', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            const subfolders: SubfolderModel[] = [subfolder1, subfolder2];
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => subfolders);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            const tracks: TrackModels = new TrackModels();
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => tracks);

            const track1: TrackModel = new TrackModel(new Track('dummy'));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => track1);
            await component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(track1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(tracks.tracks, track1), Times.exactly(1));
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            component.selectedFolder = folder2;

            // Act
            component.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setSelectedFolderAsync', () => {
        it('should set the selected folder', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/user/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());
            component.selectedFolder = folder2;

            // Act
            await component.setSelectedFolderAsync(folder1);

            // Assert
            expect(component.selectedFolder).toEqual(folder1);
        });

        it('should get subfolders for an undefined subfolder', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = folder;
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.setSelectedFolderAsync(folder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), undefined), Times.exactly(1));
        });
    });

    describe('setSelectedSubfolder', () => {
        it('should set the selected subfolder', async () => {
            // Arrange
            component.selectedSubfolder = undefined;
            const newSelectedSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);

            // Act
            component.setSelectedSubfolder(newSelectedSubfolder);

            // Assert
            expect(component.selectedSubfolder).toBe(newSelectedSubfolder);
        });
    });

    describe('setSelectedTrack', () => {
        it('should set the selected track', async () => {
            // Arrange
            component.selectedTrack = undefined;
            const newSelectedTrack: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            // Act
            component.setSelectedTrack(newSelectedTrack);

            // Assert
            expect(component.selectedTrack).toBe(newSelectedTrack);
        });
    });

    describe('getSubfoldersAsync', () => {
        it('should not get subfolders if the selected folder is undefined', async () => {
            // Arrange
            component.selectedFolder = undefined;

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get subfolders for the given selected subfolder if the selected folder is not undefined', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const selectedSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            component.selectedFolder = folder;
            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(selectedSubfolder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder, selectedSubfolder), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, subfolder2.path), Times.exactly(1));
        });

        it('should get tracks for the selected folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(selectedFolder.path), Times.exactly(1));
        });

        it('should get tracks for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(selectedFolder.path), Times.exactly(1));
        });

        it('should get tracks for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            trackServiceMock.setup((x) => x.getTracksInSubfolderAsync(It.isAny())).returns(async () => new TrackModels());

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder2.path), Times.exactly(1));
        });
    });
});
