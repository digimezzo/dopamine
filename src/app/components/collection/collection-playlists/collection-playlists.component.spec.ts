import { IMock, Mock, Times } from 'typemoq';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionPlaylistsComponent } from './collection-playlists.component';

describe('CollectionPlaylistsComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsStub: any;

    function createComponent(): CollectionPlaylistsComponent {
        return new CollectionPlaylistsComponent(
            playbackServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            settingsStub
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('create-playlist-folder')).returns(() => 'Create playlist folder');
        translatorServiceMock.setup((x) => x.get('playlist-folder-name')).returns(() => 'Playlist folder name');

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

        it('should define playbackService', async () => {
            // Arrange

            // Act
            const component: CollectionPlaylistsComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
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
    });
});
