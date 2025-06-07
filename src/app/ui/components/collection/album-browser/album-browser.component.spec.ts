import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { AlbumOrder, albumOrderKey } from '../album-order';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { AlbumBrowserComponent } from './album-browser.component';
import { AlbumRowsGetter } from './album-rows-getter';
import { ApplicationServiceBase } from '../../../../services/application/application.service.base';
import { NativeElementProxy } from '../../../../common/native-element-proxy';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { Logger } from '../../../../common/logger';
import { ContextMenuOpener } from '../../context-menu-opener';
import { AlbumData } from '../../../../data/entities/album-data';
import { AlbumModel } from '../../../../services/album/album-model';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { PlaybackService } from '../../../../services/playback/playback.service';

describe('AlbumBrowserComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let applicationServiceMock: IMock<ApplicationServiceBase>;
    let albumRowsGetterMock: IMock<AlbumRowsGetter>;
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let applicationPathsMock: IMock<ApplicationPaths>;
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
            loggerMock.object,
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        applicationServiceMock = Mock.ofType<ApplicationServiceBase>();
        albumRowsGetterMock = Mock.ofType<AlbumRowsGetter>();
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
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

        it('should define albumOrderKey', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumOrderKey).toEqual(albumOrderKey);
        });

        it('should define albumOrders', () => {
            // Arrange

            // Act
            const component: AlbumBrowserComponent = createComponent();

            // Assert
            expect(component.albumOrders).toEqual([
                AlbumOrder.byAlbumTitleAscending,
                AlbumOrder.byAlbumTitleDescending,
                AlbumOrder.byDateAdded,
                AlbumOrder.byDateCreated,
                AlbumOrder.byAlbumArtist,
                AlbumOrder.byYearAscending,
                AlbumOrder.byYearDescending,
                AlbumOrder.byLastPlayed,
                AlbumOrder.random,
            ]);
        });
    });

    describe('albums', () => {
        it('should set and get the albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.albums = albums;

            // Assert
            expect(component.albums).toBe(albums);
        });

        it('should initialize mouseSelectionWatcher using albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.albums = albums;

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(albums, false), Times.exactly(1));
        });
    });

    describe('ngOnChanges', () => {
        it('should not order the albums when give no changes for albumsPersister and albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.albums = albums;

            // Act
            component.ngOnChanges({});

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not order the albums given changes for albumsPersister and albumsPersister is undefined', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;

            const albumsPersisterChanges: any = { albumsPersister: { currentValue: albumsPersisterMock.object } };
            const albumsChanges: any = { albums: { currentValue: albums } };

            // Act
            component.ngOnChanges({ albumsPersister: albumsPersisterChanges, albums: albumsChanges });

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should order the albums given changes for albumsPersister and albums if albumsPersister is not undefined', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.albums = albums;

            const albumsPersisterChanges: any = { albumsPersister: { currentValue: albumsPersisterMock.object } };
            const albumsChanges: any = { albums: { currentValue: albums } };

            // Act
            component.ngOnChanges({ albumsPersister: albumsPersisterChanges, albums: albumsChanges });

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.albums = albums;

            const albumsPersisterChanges: any = { albumsPersister: { currentValue: albumsPersisterMock.object } };
            const albumsChanges: any = { albums: { currentValue: albums } };

            // Act
            component.ngOnChanges({ albumsPersister: albumsPersisterChanges, albums: albumsChanges });

            // Assert
            expect(albums[0].isSelected).toBeFalsy();
            expect(albums[1].isSelected).toBeTruthy();
        });
    });

    describe('ngAfterViewInit', () => {
        it('should fill the album rows on window size changed if the available width has changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            albumRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);

            // Act
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(600, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on window size changed if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            albumRowsGetterMock.reset();

            // Act
            jest.useFakeTimers();
            windowSizeChanged.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.never());
        });

        it('should fill the album rows on mouse button released if the available width has changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            albumRowsGetterMock.reset();
            nativeElementProxyMock.reset();
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);

            // Act
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(600, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on mouse button released if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            const component: AlbumBrowserComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            albumRowsGetterMock.reset();
            // Act
            jest.useFakeTimers();
            mouseButtonReleased.next();
            jest.runAllTimers();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.never());
        });
    });

    describe('setSelectedAlbums', () => {
        it('should set the selected items on mouseSelectionWatcher', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
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

    describe('applyAlbumOrder', () => {
        it('should fill the album rows', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.random;
            component.albumsPersister = albumsPersisterMock.object;

            component.albums = albums;
            albumRowsGetterMock.reset();

            // Act
            component.applyAlbumOrder(AlbumOrder.byYearAscending);

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byYearAscending), Times.exactly(1));
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            component.selectedAlbumOrder = AlbumOrder.random;
            component.albumsPersister = albumsPersisterMock.object;

            component.albums = albums;
            albums[0].isSelected = false;
            albums[1].isSelected = false;

            // Act
            component.applyAlbumOrder(AlbumOrder.byAlbumArtist);

            // Assert
            expect(albums[0].isSelected).toBeFalsy();
            expect(albums[1].isSelected).toBeTruthy();
        });

        it('should persist the selected album order', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            const component: AlbumBrowserComponent = createComponent();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.random;
            component.albumsPersister = albumsPersisterMock.object;

            component.albums = albums;
            albumRowsGetterMock.reset();

            // Act
            component.applyAlbumOrder(AlbumOrder.byAlbumArtist);

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(AlbumOrder.byAlbumArtist), Times.exactly(1));
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
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected album to the queue', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
            const component: AlbumBrowserComponent = createComponent();

            // Act
            await component.onAddToQueueAsync(album1);

            // Assert
            playbackServiceMock.verify((x) => x.addAlbumToQueueAsync(album1), Times.once());
        });
    });
});
