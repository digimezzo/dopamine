import { Observable, Subject, Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../../core/logger';
import { NativeElementProxy } from '../../../core/native-element-proxy';
import { AlbumData } from '../../../data/album-data';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseApplicationService } from '../../../services/application/base-application.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { AlbumBrowserComponent } from './album-browser.component';
import { AlbumRowsGetter } from './album-rows-getter';

describe('AlbumBrowserComponent', () => {
    let applicationServiceMock: IMock<BaseApplicationService>;
    let albumRowsGetterMock: IMock<AlbumRowsGetter>;
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let loggerMock: IMock<Logger>;
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
        loggerMock = Mock.ofType<Logger>();

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

        it('should declare activeAlbumOrder', () => {
            // Arrange

            // Act

            // Assert
            expect(component.activeAlbumOrder).toBeUndefined();
        });

        it('should define activeAlbumOrderChange', () => {
            // Arrange

            // Act

            // Assert
            expect(component.activeAlbumOrderChange).toBeDefined();
        });

        it('should declare activeAlbum', () => {
            // Arrange

            // Act

            // Assert
            expect(component.activeAlbum).toBeUndefined();
        });

        it('should define activeAlbumChange', () => {
            // Arrange

            // Act

            // Assert
            expect(component.activeAlbumChange).toBeDefined();
        });

        it('should define albums as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albums).toBeDefined();
            expect(component.albums.length).toEqual(0);
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
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.albums = albums;

            // Assert
            expect(component.albums).toBe(albums);
        });

        it('should not fill the album rows if the element width is 0', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.albums = albums;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should fill the album rows if the element width is 500', () => {
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
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.albums = albums;

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });
    });

    describe('ngAfterViewInit', () => {
        it('should not fill the album rows if the element width is 0', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            albumRowsGetterMock.reset();

            // Act
            component.ngAfterViewInit();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should fill the album rows if the element width is 500', () => {
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
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
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
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            windowSizeChanged.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(600, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on window size changed if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            windowSizeChanged.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.never());
        });

        it('should not fill the album rows on window size changed if the available width is 0', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            windowSizeChanged.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.never());
        });

        it('should fill the album rows on mouse button released if the available width has changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            mouseButtonReleased.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(600, albums, AlbumOrder.byAlbumArtist), Times.exactly(1));
        });

        it('should not fill the album rows on mouse button released if the available width is 0', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            mouseButtonReleased.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.never());
        });

        it('should not fill the album rows on mouse button released if the available width has not changed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const albums: AlbumModel[] = [album1, album2];

            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 500);
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 600);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;
            component.albums = albums;
            component.albumBrowserElement = { nativeElement: {} };

            component.ngOnInit();

            albumRowsGetterMock.reset();

            // Act
            mouseButtonReleased.next();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byAlbumArtist), Times.never());
        });
    });

    describe('setActiveAlbum', () => {
        it('should unset the active album if the control key is pressed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);

            component.activeAlbum = album1;
            const event: any = { ctrlKey: true };

            // Act
            component.setActiveAlbum(event, album2);

            // Assert
            expect(component.activeAlbum).toBeUndefined();
        });

        it('should set the active album if the control key is not pressed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);

            component.activeAlbum = album1;
            const event: any = { ctrlKey: false };

            // Act
            component.setActiveAlbum(event, album2);

            // Assert
            expect(component.activeAlbum).toBe(album2);
        });

        it('should emit that the active album has changed and is undefined if the control key is pressed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);

            component.activeAlbum = album1;
            const event: any = { ctrlKey: true };

            const subscription: Subscription = new Subscription();
            let changedAlbum: AlbumModel = album1;

            subscription.add(
                component.activeAlbumChange.subscribe((album: AlbumModel) => {
                    changedAlbum = album;
                })
            );

            // Act
            component.setActiveAlbum(event, album2);
            subscription.unsubscribe();

            // Assert
            expect(changedAlbum).toBeUndefined();
        });

        it('should emit that the active album has changed and is the changed album if the control key is not pressed', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);

            component.activeAlbum = album1;
            const event: any = { ctrlKey: false };

            const subscription: Subscription = new Subscription();
            let changedAlbum: AlbumModel = album1;

            subscription.add(
                component.activeAlbumChange.subscribe((album: AlbumModel) => {
                    changedAlbum = album;
                })
            );

            // Act
            component.setActiveAlbum(event, album2);
            subscription.unsubscribe();

            // Assert
            expect(changedAlbum).toBe(album2);
        });
    });

    describe('toggleAlbumOrder', () => {
        it('should change AlbumOrder from byAlbumTitleAscending to byAlbumTitleDescending', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byAlbumTitleAscending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byAlbumTitleDescending);
        });

        it('should change AlbumOrder from byAlbumTitleDescending to byDateAdded', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byAlbumTitleDescending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byDateAdded);
        });

        it('should change AlbumOrder from byDateAdded to byDateCreated', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byDateAdded;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byDateCreated);
        });

        it('should change AlbumOrder from byDateCreated to byAlbumArtist', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byDateCreated;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byAlbumArtist);
        });

        it('should change AlbumOrder from byAlbumArtist to byYearAscending', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should change AlbumOrder from byYearAscending to byYearDescending', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byYearDescending);
        });

        it('should change AlbumOrder from byYearDescending to byLastPlayed', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byYearDescending;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byLastPlayed);
        });

        it('should change AlbumOrder from byLastPlayed to byAlbumTitleAscending', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byLastPlayed;

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(component.activeAlbumOrder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should emit that the active album order has changed', () => {
            // Arrange
            component.activeAlbumOrder = AlbumOrder.byLastPlayed;

            const subscription: Subscription = new Subscription();
            let changedAlbumOrder: AlbumOrder = component.activeAlbumOrder;

            subscription.add(
                component.activeAlbumOrderChange.subscribe((albumOrder: AlbumOrder) => {
                    changedAlbumOrder = albumOrder;
                })
            );

            // Act
            component.toggleAlbumOrder();

            // Assert
            expect(changedAlbumOrder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should not fill the album rows if the element width is 0', () => {
            // Arrange
            nativeElementProxyMock.setup((x) => x.getElementWidth(It.isAny())).returns(() => 0);
            component = new AlbumBrowserComponent(
                applicationServiceMock.object,
                albumRowsGetterMock.object,
                nativeElementProxyMock.object,
                loggerMock.object
            );

            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.toggleAlbumOrder();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should fill the album rows using the new album order if the element width is 500', () => {
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
                loggerMock.object
            );

            component.albums = albums;
            component.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.toggleAlbumOrder();

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(500, albums, AlbumOrder.byYearAscending), Times.exactly(1));
        });
    });
});
