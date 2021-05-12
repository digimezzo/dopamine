import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../../core/logger';
import { AlbumData } from '../../../data/album-data';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { AlbumsPersister } from './albums-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
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

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        albumsPersisterMock = Mock.ofType<AlbumsPersister>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        album1 = new AlbumModel(albumData1, translatorServiceMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object);
        const albums: AlbumModel[] = [album1, album2];

        albumsPersisterMock.setup((x) => x.getSelectedAlbumOrderFromSettings()).returns(() => AlbumOrder.byYearAscending);
        albumsPersisterMock.setup((x) => x.getSelectedAlbumsFromSettings(albums)).returns(() => album2);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

        component = new CollectionAlbumsComponent(
            playbackServiceMock.object,
            albumServiceMock.object,
            albumsPersisterMock.object,
            settingsStub,
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

        it('should define playbackService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
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
            albumsPersisterMock.verify((x) => x.saveSelectedAlbumOrderToSettings(selectedAlbumOrder), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order from the settings', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should fill the albums list if it is empty', () => {
            // Arrange
            component.albums = [];

            // Act
            component.ngOnInit();

            // Assert
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should not fill the albums list if it is not empty', () => {
            // Arrange
            component.albums = [album1];

            // Act
            component.ngOnInit();

            // Assert
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album1);
        });

        it('should set the selected album from the settings', () => {
            // Arrange
            component.selectedAlbum = undefined;

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedAlbum).toEqual(album2);
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
});
