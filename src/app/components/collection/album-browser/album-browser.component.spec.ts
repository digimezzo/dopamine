import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../common/data/album-data';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { NativeElementProxy } from '../../../common/native-element-proxy';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { AlbumBrowserComponent } from './album-browser.component';
import { AlbumRowsGetter } from './album-rows-getter';

describe('AlbumBrowserComponent', () => {
    let applicationServiceMock: IMock<BaseApplicationService>;
    let albumRowsGetterMock: IMock<AlbumRowsGetter>;
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let loggerMock: IMock<Logger>;
    let albumsPersisterMock: IMock<BaseAlbumsPersister>;
    let component: AlbumBrowserComponent;
    let windowSizeChanged: Subject<void>;
    let mouseButtonReleased: Subject<void>;
    let windowSizeChanged$: Observable<void>;
    let mouseButtonReleased$: Observable<void>;

    beforeEach(() => {
        applicationServiceMock = Mock.ofType<BaseApplicationService>();
        albumRowsGetterMock = Mock.ofType<AlbumRowsGetter>();
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        loggerMock = Mock.ofType<Logger>();
        albumsPersisterMock = Mock.ofType<BaseAlbumsPersister>();
        windowSizeChanged = new Subject();
        mouseButtonReleased = new Subject();
        windowSizeChanged$ = windowSizeChanged.asObservable();
        mouseButtonReleased$ = mouseButtonReleased.asObservable();
        applicationServiceMock.setup((x) => x.windowSizeChanged$).returns(() => windowSizeChanged$);
        applicationServiceMock.setup((x) => x.mouseButtonReleased$).returns(() => mouseButtonReleased$);
        component = new AlbumBrowserComponent(
            applicationServiceMock.object,
            albumRowsGetterMock.object,
            nativeElementProxyMock.object,
            mouseSelectionWatcherMock.object,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define albumOrderEnum', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albumOrderEnum).toBeDefined();
        });

        it('should define albumRows as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albumRows).toBeDefined();
            expect(component.albumRows.length).toEqual(0);
        });

        it('should declare albumBrowserElement', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albumBrowserElement).toBeUndefined();
        });

        it('should declare selectedAlbumOrder', () => {
            // Arrange

            // Act

            // Assert
            expect(component.selectedAlbumOrder).toBeUndefined();
        });

        it('should declare albumsPersister', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albumsPersister).toBeUndefined();
        });
    });

    describe('albums', () => {
        it('should set and get the albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();

            // Act
            component.albums = albums;

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(albums, false), Times.exactly(1));
        });

        it('should order the albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;
            component.ngOnInit();

            // Act
            component.albums = albums;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should apply the selected albums', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
        it('should fill the album rows using the current element width is 500', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();

            // Act
            windowSizeChanged.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on window size changed if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
            component.albumsPersister = albumsPersisterMock.object;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };
            component.ngOnInit();
            albumRowsGetterMock.reset();

            // Act
            mouseButtonReleased.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on mouse button released if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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

        it('should get the selected album order from the persister', () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byDateCreated);

            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );

            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.ngOnInit();

            // Assert
            albumsPersisterMock.verify((x) => x.getSelectedAlbumOrder(), Times.exactly(1));
            component.selectedAlbumOrder = AlbumOrder.byDateCreated;
        });
    });

    describe('setSelectedAlbums', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const event: any = {};
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            const event: any = {};
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => albums);
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
            component.selectedAlbumOrder = AlbumOrder.byAlbumTitleAscending;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumTitleDescending);
        });

        it('should change AlbumOrder from byAlbumTitleDescending to byDateAdded', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumTitleDescending;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byDateAdded);
        });

        it('should change AlbumOrder from byDateAdded to byDateCreated', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byDateAdded;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byDateCreated);
        });

        it('should change AlbumOrder from byDateCreated to byAlbumArtist', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byDateCreated;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byAlbumArtist);
        });

        it('should change AlbumOrder from byAlbumArtist to byYearAscending', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should change AlbumOrder from byYearAscending to byYearDescending', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearDescending);
        });

        it('should change AlbumOrder from byYearDescending to byLastPlayed', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byYearDescending;
            component.albumsPersister = albumsPersisterMock.object;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byLastPlayed);
        });

        it('should change AlbumOrder from byLastPlayed to byAlbumTitleAscending', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byLastPlayed;
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                mouseSelectionWatcherMock.object,
                loggerMock.object
            );
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
    });

    it('should persist the selected album order', () => {
        // Arrange
        const albumData1: AlbumData = new AlbumData();
        const albumData2: AlbumData = new AlbumData();
        const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
        const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
        const albums: AlbumModel[] = [album1, album2];
        nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
        component = new AlbumBrowserComponent(
            applicationServiceMock.object,
            albumRowsGetterMock.object,
            nativeElementProxyMock.object,
            mouseSelectionWatcherMock.object,
            loggerMock.object
        );
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
