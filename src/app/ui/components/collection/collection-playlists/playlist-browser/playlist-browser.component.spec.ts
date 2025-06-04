import { PlaylistBrowserComponent } from './playlist-browser.component';
import { PlaylistServiceBase } from '../../../../../services/playlist/playlist.service.base';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { IMock, Mock, Times } from 'typemoq';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { DialogServiceBase } from '../../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { PlaylistRowsGetter } from '../playlist-folder-browser/playlist-rows-getter';
import { NativeElementProxy } from '../../../../../common/native-element-proxy';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { Logger } from '../../../../../common/logger';
import { Observable, Subject } from 'rxjs';
import { PlaylistOrder, playlistOrderKey } from '../playlist-order';
import { PlaylistsPersister } from '../playlists-persister';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';
import { PlaylistRow } from './playlist-row';

describe('PlaylistBrowserComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let playlistServiceMock: IMock<PlaylistServiceBase>;
    let applicationServiceMock: IMock<ApplicationServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let dialogServiceBaseMock: IMock<DialogServiceBase>;
    let playlistRowsGetterMock: IMock<PlaylistRowsGetter>;
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let loggerMock: IMock<Logger>;

    let playlistsPersisterMock: IMock<PlaylistsPersister>;

    let windowSizeChanged: Subject<void>;
    let mouseButtonReleased: Subject<void>;
    let windowSizeChanged$: Observable<void>;
    let mouseButtonReleased$: Observable<void>;

    let playlistModel1: PlaylistModel;
    let playlistModel2: PlaylistModel;
    let playlistRow: PlaylistRow;
    let playlistRows: PlaylistRow[];

    function createComponent(): PlaylistBrowserComponent {
        const result = new PlaylistBrowserComponent(
            playbackServiceMock.object,
            playlistServiceMock.object,
            applicationServiceMock.object,
            translatorServiceMock.object,
            dialogServiceBaseMock.object,
            playlistRowsGetterMock.object,
            nativeElementProxyMock.object,
            mouseSelectionWatcherMock.object,
            contextMenuOpenerMock.object,
            loggerMock.object,
        );

        result.playlistsPersister = playlistsPersisterMock.object;

        return result;
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        playlistServiceMock = Mock.ofType<PlaylistServiceBase>();
        applicationServiceMock = Mock.ofType<ApplicationServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        dialogServiceBaseMock = Mock.ofType<DialogServiceBase>();
        playlistRowsGetterMock = Mock.ofType<PlaylistRowsGetter>();
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        loggerMock = Mock.ofType<Logger>();

        playlistsPersisterMock = Mock.ofType<PlaylistsPersister>();

        windowSizeChanged = new Subject();
        mouseButtonReleased = new Subject();
        windowSizeChanged$ = windowSizeChanged.asObservable();
        mouseButtonReleased$ = mouseButtonReleased.asObservable();
        applicationServiceMock.setup((x) => x.windowSizeChanged$).returns(() => windowSizeChanged$);
        applicationServiceMock.setup((x) => x.mouseButtonReleased$).returns(() => mouseButtonReleased$);

        playlistModel1 = new PlaylistModel('Playlist 1', 'Folder', 'Path 1', 'Image path 1');
        playlistModel2 = new PlaylistModel('Playlist 2', 'Folder', 'Path 2', 'Image path 2');

        playlistRow = new PlaylistRow();
        playlistRow.playlists = [playlistModel1, playlistModel2];

        playlistRows = [playlistRow];
    });

    describe('constructor', () => {
        it('should define playlistOrders', () => {
            // Arrange

            // Act
            const component = createComponent();

            // Assert
            expect(component.playlistOrders).toEqual([PlaylistOrder.byPlaylistNameAscending, PlaylistOrder.byPlaylistNameDescending]);
        });

        it('should define playlistOrderKey', () => {
            // Arrange

            // Act
            const component = createComponent();

            // Assert
            expect(component.playlistOrderKey).toEqual(playlistOrderKey);
        });
    });

    describe('applyPlaylistOrder', () => {
        it('should apply playlist order', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];
            component.playlists = playlists;

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistRowsGetterMock.setup((x) => x.getPlaylistRows(0, playlists, playlistOrder)).returns(() => playlistRows);

            playlistsPersisterMock.setup((x) => x.getSelectedPlaylists(playlists)).returns(() => [playlistModel2]);

            // Act
            component.applyPlaylistOrder(playlistOrder);

            // Assert
            expect(component.selectedPlaylistOrder).toEqual(playlistOrder);
            playlistsPersisterMock.verify((x) => x.setSelectedPlaylistOrder(playlistOrder), Times.once());
            expect(component.playlistRows).toEqual(playlistRows);
            expect(playlistModel1.isSelected).toBeFalsy();
            expect(playlistModel2.isSelected).toBeTruthy();
        });
    });

    test.todo('should write more tests');
});
