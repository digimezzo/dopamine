import { IMock, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../common/data/album-data';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { ArtistsAlbumsPersister } from './artists-albums-persister';
import { CollectionArtistsComponent } from './collection-artists.component';

describe('CollectionArtistsComponent', () => {
    let albumServiceMock: IMock<BaseAlbumService>;
    let artistsPersisterMock: IMock<ArtistsAlbumsPersister>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let component: CollectionArtistsComponent;

    const albumData1: AlbumData = new AlbumData();
    const albumData2: AlbumData = new AlbumData();
    let album1: AlbumModel;
    let album2: AlbumModel;
    let albums: AlbumModel[];

    beforeEach(() => {
        artistsPersisterMock = Mock.ofType<ArtistsAlbumsPersister>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { artistsLeftPaneWidthPercent: 25, artistsRightPaneWidthPercent: 25 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        album1 = new AlbumModel(albumData1, translatorServiceMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object);
        albums = [album1, album2];

        artistsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
        artistsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

        component = new CollectionArtistsComponent(
            artistsPersisterMock.object,
            albumServiceMock.object,
            settingsStub,
            schedulerMock.object,
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

        it('should set left pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.leftPaneSize).toEqual(25);
        });

        it('should set center pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.centerPaneSize).toEqual(50);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.rightPaneSize).toEqual(25);
        });

        it('should define albums as empty', () => {
            throw new Error();
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.artistsLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.artistsRightPaneWidthPercent).toEqual(15);
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
            artistsPersisterMock.verify((x) => x.setSelectedAlbumOrder(selectedAlbumOrder), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            artistsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            component = new CollectionArtistsComponent(
                artistsPersisterMock.object,
                albumServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            artistsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionArtistsComponent(
                artistsPersisterMock.object,
                albumServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums).toEqual(albums);
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            artistsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionArtistsComponent(
                artistsPersisterMock.object,
                albumServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums).toEqual([]);
        });
    });
});
