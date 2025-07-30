import { PlaylistBrowserComponent } from './playlist-browser.component';
import { PlaylistServiceBase } from '../../../../../services/playlist/playlist.service.base';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { IMock, It, Mock, Times } from 'typemoq';
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
import { MatMenuTrigger } from '@angular/material/menu';
import { ElementRef } from '@angular/core';

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
        return new PlaylistBrowserComponent(
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

    describe('playlistsPersister', () => {
        it('should return default playlistsPersister', () => {
            // Arrange
            const component = createComponent();

            // Act
            const result = component.playlistsPersister;

            // Assert
            expect(result).toBeUndefined();
        });

        it('should set playlistsPersister', () => {
            // Arrange
            const component = createComponent();

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);

            // Act
            component.playlistsPersister = playlistsPersisterMock.object;

            // Assert
            expect(component.playlistsPersister).toEqual(playlistsPersisterMock.object);
            playlistsPersisterMock.verify((x) => x.getSelectedPlaylistOrder(), Times.once());
            expect(component.selectedPlaylistOrder).toEqual(playlistOrder);
        });
    });

    describe('playlists', () => {
        it('should return default playlists', () => {
            // Arrange
            const component = createComponent();

            // Act
            const result = component.playlists;

            // Assert
            expect(result).toEqual([]);
            expect(component.hasPlaylists).toBeFalsy();
        });

        it('should set playlists', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];

            // Act
            component.playlists = playlists;

            // Assert
            expect(component.playlists).toEqual(playlists);
            expect(component.hasPlaylists).toBeTruthy();
            mouseSelectionWatcherMock.verify((x) => x.initialize(playlists, false), Times.once());
        });
    });

    describe('ngAfterViewInit', () => {
        it('should fill the playlist rows on window size changed if the available width has changed', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            const playlists = [playlistModel1, playlistModel2];
            component.playlists = playlists;

            const playlistBrowserElement: ElementRef = { nativeElement: {} };
            component.playlistBrowserElement = playlistBrowserElement;

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            playlistRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(playlistBrowserElement)).returns(() => 600);

            // Act
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(600, playlists, playlistOrder), Times.once());
        });

        it('should not fill the playlist rows on window size changed if the available width has not changed', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => PlaylistOrder.byPlaylistNameAscending);
            component.playlistsPersister = playlistsPersisterMock.object;

            component.playlists = [playlistModel1, playlistModel2];

            component.playlistBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            // Act
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not fill the playlist rows on window size changed if the available width has changed after ngOnDestroy invocation', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            component.playlists = [playlistModel1, playlistModel2];

            const playlistBrowserElement: ElementRef = { nativeElement: {} };
            component.playlistBrowserElement = playlistBrowserElement;

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            playlistRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(playlistBrowserElement)).returns(() => 600);

            // Act
            component.ngOnDestroy();
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should fill the playlist rows on mouse button released if the available width has changed', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            const playlists = [playlistModel1, playlistModel2];
            component.playlists = playlists;

            const playlistBrowserElement: ElementRef = { nativeElement: {} };
            component.playlistBrowserElement = playlistBrowserElement;

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            playlistRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(playlistBrowserElement)).returns(() => 600);

            // Act
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(600, playlists, playlistOrder), Times.once());
        });

        it('should not fill the playlist rows on mouse button released if the available width has changed after ngOnDestroy invocation', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            component.playlists = [playlistModel1, playlistModel2];

            const playlistBrowserElement: ElementRef = { nativeElement: {} };
            component.playlistBrowserElement = playlistBrowserElement;

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            playlistRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(playlistBrowserElement)).returns(() => 600);

            // Act
            component.ngOnDestroy();
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not fill the playlist rows on mouse button released if the available width has not changed', () => {
            // Arrange
            const component = createComponent();

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);

            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => PlaylistOrder.byPlaylistNameAscending);
            component.playlistsPersister = playlistsPersisterMock.object;

            component.playlists = [playlistModel1, playlistModel2];

            component.playlistBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            // Act
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });
    });

    describe('setSelectedPlaylists', () => {
        it('should set selected playlists', () => {
            // Arrange
            const component = createComponent();
            component.playlistsPersister = playlistsPersisterMock.object;

            const playlists = [playlistModel1, playlistModel2];
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => playlists);

            const mouseEvent = new MouseEvent('');

            // Act
            component.setSelectedPlaylists(mouseEvent, playlistModel2);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(mouseEvent, playlistModel2), Times.once());
            playlistsPersisterMock.verify((x) => x.setSelectedPlaylists(playlists), Times.once());
        });
    });

    describe('applyPlaylistOrder', () => {
        it('should apply playlist order', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];
            component.playlistsPersister = playlistsPersisterMock.object;
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

        it('should apply playlist order when playlistRowsGetter throws an exception', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];
            component.playlistsPersister = playlistsPersisterMock.object;
            component.playlists = playlists;

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            const error = new Error('An error occurred');
            playlistRowsGetterMock.setup((x) => x.getPlaylistRows(0, playlists, playlistOrder)).throws(error);

            // Act
            component.applyPlaylistOrder(playlistOrder);

            // Assert
            expect(component.selectedPlaylistOrder).toEqual(playlistOrder);
            playlistsPersisterMock.verify((x) => x.setSelectedPlaylistOrder(playlistOrder), Times.once());
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(0, playlists, playlistOrder), Times.once());
            playlistsPersisterMock.verify((x) => x.getSelectedPlaylists(It.isAny()), Times.never());
            expect(component.playlistRows).toEqual([]);
            expect(playlistModel1.isSelected).toBeFalsy();
            expect(playlistModel2.isSelected).toBeFalsy();
            loggerMock.verify(
                (x) => x.error(error, 'Could not order playlists', 'PlaylistBrowserComponent', 'orderPlaylists'),
                Times.once(),
            );
        });
    });

    describe('ngOnChanges', () => {
        it('should not order the playlists when no changes for playlists and playlistsPersister', () => {
            // Arrange
            const component = createComponent();

            // Act
            component.ngOnChanges({});

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not order the playlists when given changes for playlists and playlists is empty', () => {
            // Arrange
            const component = createComponent();

            const playlistsChanges: any = { playlists: { previousValue: [], currentValue: [playlistModel2] } };

            // Act
            component.ngOnChanges(playlistsChanges);

            // Assert
            playlistRowsGetterMock.verify((x) => x.getPlaylistRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should order the playlists when given changes for playlists', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];
            component.playlists = playlists;

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            playlistRowsGetterMock.setup((x) => x.getPlaylistRows(0, playlists, playlistOrder)).returns(() => playlistRows);
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylists(playlists)).returns(() => [playlistModel2]);

            const playlistsChanges: any = { playlists: { previousValue: [], currentValue: playlists } };

            // Act
            component.ngOnChanges(playlistsChanges);

            // Assert
            expect(component.selectedPlaylistOrder).toEqual(playlistOrder);
            expect(component.playlistRows).toEqual(playlistRows);
            expect(playlistModel1.isSelected).toBeFalsy();
            expect(playlistModel2.isSelected).toBeTruthy();
        });

        it('should order the playlists when given changes for playlistsPersister', () => {
            // Arrange
            const component = createComponent();
            const playlists = [playlistModel1, playlistModel2];
            component.playlists = playlists;

            const playlistOrder = PlaylistOrder.byPlaylistNameAscending;
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylistOrder()).returns(() => playlistOrder);
            component.playlistsPersister = playlistsPersisterMock.object;

            playlistRowsGetterMock.setup((x) => x.getPlaylistRows(0, playlists, playlistOrder)).returns(() => playlistRows);
            playlistsPersisterMock.setup((x) => x.getSelectedPlaylists(playlists)).returns(() => [playlistModel2]);

            const playlistsPersisterChanges: any = {
                playlistsPersister: { previousValue: undefined, currentValue: playlistsPersisterMock.object },
            };

            // Act
            component.ngOnChanges(playlistsPersisterChanges);

            // Assert
            expect(component.selectedPlaylistOrder).toEqual(playlistOrder);
            expect(component.playlistRows).toEqual(playlistRows);
            expect(playlistModel1.isSelected).toBeFalsy();
            expect(playlistModel2.isSelected).toBeTruthy();
        });
    });

    describe('onPlaylistContextMenu', () => {
        it('should open playlist context menu', () => {
            // Arrange
            const component = createComponent();
            const playlistContextMenu = Mock.ofType<MatMenuTrigger>().object;
            component.playlistContextMenu = playlistContextMenu;

            const mouseEvent = new MouseEvent('');

            // Act
            component.onPlaylistContextMenu(mouseEvent, playlistModel2);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(playlistContextMenu, mouseEvent, playlistModel2), Times.once());
        });
    });

    describe('onDeletePlaylistAsync', () => {
        it('should delete playlist when user has confirmed', async () => {
            // Arrange
            const component = createComponent();

            const dialogTitle = 'title';
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-playlist')).returns(() => Promise.resolve(dialogTitle));

            const dialogText = 'text';
            translatorServiceMock
                .setup((x) =>
                    x.getAsync('confirm-delete-playlist-long', {
                        playlistName: playlistModel2.name,
                    }),
                )
                .returns(() => Promise.resolve(dialogText));

            dialogServiceBaseMock.setup((x) => x.showConfirmationDialogAsync(dialogTitle, dialogText)).returns(() => Promise.resolve(true));

            // Act
            await component.onDeletePlaylistAsync(playlistModel2);

            // Assert
            playlistServiceMock.verify((x) => x.deletePlaylistAsync(playlistModel2), Times.once());

            loggerMock.verify((x) => x.error(It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.never());
            translatorServiceMock.verify((x) => x.getAsync('delete-playlist-error'), Times.never());
            dialogServiceBaseMock.verify((x) => x.showErrorDialog(It.isAny()), Times.never());
        });

        it('should show error dialog when playlistService throws an exception', async () => {
            // Arrange
            const component = createComponent();

            const dialogTitle = 'title';
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-playlist')).returns(() => Promise.resolve(dialogTitle));

            const dialogText = 'text';
            translatorServiceMock
                .setup((x) =>
                    x.getAsync('confirm-delete-playlist-long', {
                        playlistName: playlistModel2.name,
                    }),
                )
                .returns(() => Promise.resolve(dialogText));

            dialogServiceBaseMock.setup((x) => x.showConfirmationDialogAsync(dialogTitle, dialogText)).returns(() => Promise.resolve(true));

            const error = new Error('An error occurred');
            playlistServiceMock.setup((x) => x.deletePlaylistAsync(playlistModel2)).throws(error);

            const errorText = 'error text';
            translatorServiceMock.setup((x) => x.getAsync('delete-playlist-error')).returns(() => Promise.resolve(errorText));

            // Act
            await component.onDeletePlaylistAsync(playlistModel2);

            // Assert
            loggerMock.verify(
                (x) => x.error(error, 'Could not delete playlist', 'PlaylistBrowserComponent', 'onDeletePlaylistAsync'),
                Times.once(),
            );
            playlistServiceMock.verify((x) => x.deletePlaylistAsync(playlistModel2), Times.once());
            dialogServiceBaseMock.verify((x) => x.showErrorDialog(errorText), Times.once());
        });

        it('should not delete playlist when user has not confirmed', async () => {
            // Arrange
            const component = createComponent();

            const dialogTitle = 'title';
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-playlist')).returns(() => Promise.resolve(dialogTitle));

            const dialogText = 'text';
            translatorServiceMock
                .setup((x) =>
                    x.getAsync('confirm-delete-playlist-long', {
                        playlistName: playlistModel2.name,
                    }),
                )
                .returns(() => Promise.resolve(dialogText));

            dialogServiceBaseMock
                .setup((x) => x.showConfirmationDialogAsync(dialogTitle, dialogText))
                .returns(() => Promise.resolve(false));

            // Act
            await component.onDeletePlaylistAsync(playlistModel2);

            // Assert
            playlistServiceMock.verify((x) => x.deletePlaylistAsync(playlistModel2), Times.never());
        });
    });

    describe('onEditPlaylistAsync', () => {
        it('should show edit playlist dialog', async () => {
            // Arrange
            const component = createComponent();

            // Act
            await component.onEditPlaylistAsync(playlistModel2);

            // Assert
            dialogServiceBaseMock.verify((x) => x.showEditPlaylistDialogAsync(playlistModel2), Times.once());
        });
    });

    describe('createPlaylistAsync', () => {
        it('should show create playlist dialog', async () => {
            // Arrange
            const component = createComponent();

            // Act
            await component.createPlaylistAsync();

            // Assert
            dialogServiceBaseMock.verify((x) => x.showCreatePlaylistDialogAsync(), Times.once());
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should show create playlist dialog', async () => {
            // Arrange
            const component = createComponent();

            // Act
            await component.onAddToQueueAsync(playlistModel2);

            // Assert
            playbackServiceMock.verify((x) => x.addPlaylistToQueueAsync(playlistModel2), Times.once());
        });
    });
});
