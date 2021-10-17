import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../../common/logger';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionPlaylistsComponent } from './collection-playlists.component';

describe('CollectionPlaylistsComponent', () => {
    let playlistServiceMock: IMock<BasePlaylistService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    function createComponent(): CollectionPlaylistsComponent {
        return new CollectionPlaylistsComponent(
            playlistServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            settingsStub,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playlistServiceMock = Mock.ofType<BasePlaylistService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock.setup((x) => x.get('create-playlist-folder')).returns(() => 'Create playlist folder');
        translatorServiceMock.setup((x) => x.get('playlist-folder-name')).returns(() => 'Playlist folder name');
        translatorServiceMock.setup((x) => x.get('create-playlist-folder-error')).returns(() => 'Create playlist folder error');

        settingsStub = { playlistsLeftPaneWidthPercent: 25, playlistsRightPaneWidthPercent: 25 };
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playlistService', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.playlistService).toBeDefined();
        });

        it('should set left pane size from settings', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(25);
        });

        it('should set center pane size from settings', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.centerPaneSize).toEqual(50);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(25);
        });

        it('should initialize playlistFolders as empty', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.playlistFolders.length).toEqual(0);
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            const component: CollectionPlaylistsComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.playlistsLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange
            const component: CollectionPlaylistsComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.playlistsRightPaneWidthPercent).toEqual(15);
        });
    });

    describe('createPlaylistFolderAsync', () => {
        it('should open an input dialog', async () => {
            // Arrange
            const component: CollectionPlaylistsComponent = createComponent();

            // Act
            await component.createPlaylistFolderAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showInputDialogAsync('Create playlist folder', 'Playlist folder name'), Times.once());
        });

        it('should create the playlists folder', async () => {
            // Arrange
            dialogServiceMock
                .setup((x) => x.showInputDialogAsync('Create playlist folder', 'Playlist folder name'))
                .returns(async () => 'My playlist folder');

            const component: CollectionPlaylistsComponent = createComponent();

            // Act
            await component.createPlaylistFolderAsync();

            // Assert
            playlistServiceMock.verify((x) => x.createPlaylistFolder('My playlist folder'), Times.once());
        });

        it('should show an error dialog if creation of the playlist folder fails', async () => {
            // Arrange
            dialogServiceMock
                .setup((x) => x.showInputDialogAsync('Create playlist folder', 'Playlist folder name'))
                .returns(async () => 'My playlist folder');

            playlistServiceMock.setup((x) => x.createPlaylistFolder('My playlist folder')).throws(new Error('An error occurred'));

            const component: CollectionPlaylistsComponent = createComponent();

            // Act
            await component.createPlaylistFolderAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('Create playlist folder error'), Times.once());
        });
    });
});
