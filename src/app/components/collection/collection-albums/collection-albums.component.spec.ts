import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../common/data/album-data';
import { Track } from '../../../common/data/entities/track';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { TrackOrder } from '../track-order';
import { AlbumsAlbumsPersister } from './albums-albums-persister';
import { AlbumsTracksPersister } from './albums-tracks-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let albumServiceMock: IMock<BaseAlbumService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let albumsPersisterMock: IMock<AlbumsAlbumsPersister>;
    let tracksPersisterMock: IMock<AlbumsTracksPersister>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let component: CollectionAlbumsComponent;

    const albumData1: AlbumData = new AlbumData();
    const albumData2: AlbumData = new AlbumData();
    let album1: AlbumModel;
    let album2: AlbumModel;
    let albums: AlbumModel[];

    let track1: Track;
    let track2: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let tracks: TrackModels;

    beforeEach(() => {
        albumsPersisterMock = Mock.ofType<AlbumsAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<AlbumsTracksPersister>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        selectedAlbumsChangedMock = new Subject();
        selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();

        album1 = new AlbumModel(albumData1, translatorServiceMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object);
        albums = [album1, album2];

        track1 = new Track('Path1');
        track1.duration = 1;
        track2 = new Track('Path2');
        track2.duration = 2;
        trackModel1 = new TrackModel(track1, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, translatorServiceMock.object);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);

        albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
        albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
        albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);
        trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);
        trackServiceMock.setup((x) => x.getAlbumTracks(It.isAny())).returns(() => tracks);

        component = new CollectionAlbumsComponent(
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            albumServiceMock.object,
            trackServiceMock.object,
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

        it('should define albums as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
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

            component = new CollectionAlbumsComponent(
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionAlbumsComponent(
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums).toEqual(albums);
        });

        it('should get all tracks if there are no selected albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);

            component = new CollectionAlbumsComponent(
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            component.albums = albums;

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums when the selected albums have changed', async () => {
            throw new Error();
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            component = new CollectionAlbumsComponent(
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            await component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums).toEqual([]);
        });

        it('should clear the tracks', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            component = new CollectionAlbumsComponent(
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            await component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.tracks.tracks).toEqual([]);
        });
    });
});
