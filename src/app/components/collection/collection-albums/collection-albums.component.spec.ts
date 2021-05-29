import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../../core/logger';
import { AlbumData } from '../../../data/album-data';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { AlbumsPersister } from './albums-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let albumServiceMock: IMock<BaseAlbumService>;
    let albumsPersisterMock: IMock<AlbumsPersister>;
    let settingsStub: any;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let component: CollectionAlbumsComponent;

    const albumData1: AlbumData = new AlbumData();
    const albumData2: AlbumData = new AlbumData();
    let album1: AlbumModel;
    let album2: AlbumModel;
    let albums: AlbumModel[];

    beforeEach(() => {
        albumsPersisterMock = Mock.ofType<AlbumsPersister>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        album1 = new AlbumModel(albumData1, translatorServiceMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object);
        albums = [album1, album2];

        albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
        albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

        component = new CollectionAlbumsComponent(albumsPersisterMock.object, albumServiceMock.object, settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set left pane size from settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.leftPaneSize).toEqual(70);
        });

        it('should set right pane size from settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.rightPaneSize).toEqual(30);
        });
    });

    describe('splitDragEnd', () => {
        it('should save the right pane width to the settings', () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [60, 40] });

            // Assert
            expect(settingsStub.albumsRightPaneWidthPercent).toEqual(40);
        });
    });

    describe('selectedAlbumOrder', () => {
        it('should return the selected album order', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should set the selected album order', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should persist the selected album order', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(selectedAlbumOrder), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            component = new CollectionAlbumsComponent(albumsPersisterMock.object, albumServiceMock.object, settingsStub, loggerMock.object);

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionAlbumsComponent(albumsPersisterMock.object, albumServiceMock.object, settingsStub, loggerMock.object);

            // Act
            component.ngOnInit();

            // Assert
            expect(component.albums).toEqual(albums);
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionAlbumsComponent(albumsPersisterMock.object, albumServiceMock.object, settingsStub, loggerMock.object);

            component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums).toEqual([]);
        });
    });
});
