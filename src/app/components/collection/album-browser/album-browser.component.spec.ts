import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { AlbumData } from '../../../common/data/entities/album-data';
import { FileAccess } from '../../../common/io/file-access';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { NativeElementProxy } from '../../../common/native-element-proxy';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { AlbumOrder } from '../album-order';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { AlbumBrowserComponent } from './album-browser.component';
import { AlbumRowsGetter } from './album-rows-getter';

describe('AlbumBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let applicationServiceMock: IMock<BaseApplicationService>;
    let albumRowsGetterMock: IMock<AlbumRowsGetter>;
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let fileAccessMock: IMock<FileAccess>;
    let loggerMock: IMock<Logger>;
    let albumsPersisterMock: IMock<BaseAlbumsPersister>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let windowSizeChanged: Subject<void>;
    let mouseButtonReleased: Subject<void>;
    let windowSizeChanged$: Observable<void>;
    let mouseButtonReleased$: Observable<void>;

    function createComponent(): AlbumBrowserComponent {
        return new AlbumBrowserComponent(
            playbackServiceMock.object,
            applicationServiceMock.object,
            albumRowsGetterMock.object,
            nativeElementProxyMock.object,
            mouseSelectionWatcherMock.object,
            contextMenuOpenerMock.object,
            addToPlaylistMenuMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        applicationServiceMock = Mock.ofType<BaseApplicationService>();
        albumRowsGetterMock = Mock.ofType<AlbumRowsGetter>();
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        fileAccessMock = Mock.ofType<FileAccess>();
        loggerMock = Mock.ofType<Logger>();
        albumsPersisterMock = Mock.ofType<BaseAlbumsPersister>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        windowSizeChanged = new Subject();
        mouseButtonReleased = new Subject();
        windowSizeChanged$ = windowSizeChanged.asObservable();
        mouseButtonReleased$ = mouseButtonReleased.asObservable();
        applicationServiceMock.setup((x) => x.windowSizeChanged$).returns(() => windowSizeChanged$);
        applicationServiceMock.setup((x) => x.mouseButtonReleased$).returns(() => mouseButtonReleased$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define albumOrderEnum', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumOrderEnum).toBeDefined();
        });

        it('should define albumRows as empty', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumRows).toBeDefined();
            expect(component.albumRows.length).toEqual(0);
        });

        it('should declare albumBrowserElement', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumBrowserElement).toBeUndefined();
        });

        it('should declare selectedAlbumOrder', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.selectedAlbumOrder).toBeUndefined();
        });

        it('should declare albumsPersister', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumsPersister).toBeUndefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.mouseSelectionWatcher).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.contextMenuOpener).toBeDefined();
        });

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.addToPlaylistMenu).toBeDefined();
        });
    });

    describe('albums', () => {
        it('should set and get the albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();

            // Act
            component.albums = albums;

            // Assert
            expect(component.albums).toBe(albums);
        });

        it('should initialize mouseSelectionWatcher using albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();

            // Act
            component.albums = albums;

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(albums, false), Times.exactly(1));
        });

        it('should order the albums if albumsPersister is not undefined', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.albums = albums;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not order the albums if albumsPersister is undefined', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.albums = albums;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();

            // Act
            component.albums = albums;

            // Assert
            expect(albums[0].isSelected).toBeFalsy();
            expect(albums[1].isSelected).toBeTruthy();
        });
    });

    describe('ngAfterViewInit', () => {
        it('should fill the album rows using the current element width', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            albumRowsGetterMock.reset();

            // Act
            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should fill the album rows on window size changed if the available width has changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();

            // Act
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on window size changed if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();

            // Act
            windowSizeChanged.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.never());
        });

        it('should fill the album rows on mouse button released if the available width has changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();

            // Act
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on mouse button released if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();
            // Act
            mouseButtonReleased.next();
            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.never());
        });
    });

    describe('setSelectedAlbums', () => {
        it('should set the selected items on mouseSelectionWatcher', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const event: any = {};
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.setSelectedAlbums(event, album1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, album1), Times.exactly(1));
        });

        it('should persist the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            const event: any = {};
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => albums);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.setSelectedAlbums(event, album1);

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbums(albums), Times.exactly(1));
        });
    });

    describe('toggleAlbumOrder', () => {
        it('should change AlbumOrder from byAlbumTitleAscending to byAlbumTitleDescending', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumTitleAscending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumTitleDescending);
        });

        it('should change AlbumOrder from byAlbumTitleDescending to byDateAdded', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumTitleDescending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byDateAdded);
        });

        it('should change AlbumOrder from byDateAdded to byDateCreated', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byDateAdded;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byDateCreated);
        });

        it('should change AlbumOrder from byDateCreated to byAlbumArtist', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byDateCreated;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumArtist);
        });

        it('should change AlbumOrder from byAlbumArtist to byYearAscending', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should change AlbumOrder from byYearAscending to byYearDescending', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearDescending);
        });

        it('should change AlbumOrder from byYearDescending to byLastPlayed', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byYearDescending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byLastPlayed);
        });

        it('should change AlbumOrder from byLastPlayed to random', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byLastPlayed;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.random);
        });

        it('should change AlbumOrder from random to byAlbumTitleAscending', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.random;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should fill the album rows', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();
            component.albums = albums;
            albumRowsGetterMock.reset();

            // Act
            component.toggleAlbumOrder();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byYearAscending), Times.exactly(1));
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();
            component.albums = albums;
            albums[0].isSelected = false;
            albums[1].isSelected = false;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(albums[0].isSelected).toBeFalsy();
            expect(albums[1].isSelected).toBeTruthy();
        });

        it('should persist the selected album order', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();
            component.albums = albums;
            albumRowsGetterMock.reset();

            // Act
            component.toggleAlbumOrder();

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(AlbumOrder.byYearAscending), Times.exactly(1));
        });
    });

    describe('albumsPersister', () => {
        it('should set and return albumsPersister', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            const persister: BaseAlbumsPersister = component.albumsPersister;

            // Assert
            expect(persister).toBe(albumsPersisterMock.object);
        });

        it('should set the selected album order', () => {
            // Arrange
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumTitleAscending);

            // Act
            component.albumsPersister = albumsPersisterMock.object;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should fill the album rows using the current element width', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumTitleAscending);
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            albumRowsGetterMock.reset();

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            // Act
            component.albumsPersister = albumsPersisterMock.object;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumTitleAscending), Times.exactly(1));
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.ngOnInit();
            component.albums = albums;
            albums[0].isSelected = false;
            albums[1].isSelected = false;

            // Act
            component.albumsPersister = albumsPersisterMock.object;

            // Assert
            expect(albums[0].isSelected).toBeFalsy();
            expect(albums[1].isSelected).toBeTruthy();
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected album to the queue', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
            const component: AlbumBrowserComponent = createComponent();

            // Act
            await component.onAddToQueueAsync(album1);

            // Assert
            playbackServiceMock.verify((x) => x.addAlbumToQueueAsync(album1), Times.once());
        });
    });
});
