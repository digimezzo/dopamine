import { IOutputData } from 'angular-split';
import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumOrder } from '../album-order';
import { AlbumsAlbumsPersister } from './albums-albums-persister';
import { AlbumsTracksPersister } from './albums-tracks-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';
import { SearchServiceBase } from '../../../../services/search/search.service.base';
import { AlbumServiceBase } from '../../../../services/album/album-service.base';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { Logger } from '../../../../common/logger';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { DateTime } from '../../../../common/date-time';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { AlbumData } from '../../../../data/entities/album-data';
import { AlbumModel } from '../../../../services/album/album-model';
import { Track } from '../../../../data/entities/track';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { SettingsMock } from '../../../../testing/settings-mock';

describe('CollectionAlbumsComponent', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let albumServiceMock: IMock<AlbumServiceBase>;
    let trackServiceMock: IMock<TrackServiceBase>;
    let albumsPersisterMock: IMock<AlbumsAlbumsPersister>;
    let tracksPersisterMock: IMock<AlbumsTracksPersister>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let indexingServiceMock: IMock<IndexingService>;
    let collectionServiceMock: IMock<CollectionServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let indexingFinishedMock: Subject<void>;
    let indexingFinishedMock$: Observable<void>;

    let collectionChangedMock: Subject<void>;
    let collectionChangedMock$: Observable<void>;

    const albumData1: AlbumData = new AlbumData();
    albumData1.albumKey = 'albumKey1';
    const albumData2: AlbumData = new AlbumData();
    albumData2.albumKey = 'albumKey2';
    let album1: AlbumModel;
    let album2: AlbumModel;
    let albums: AlbumModel[];

    let track1: Track;
    let track2: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let tracks: TrackModels;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionAlbumsComponent {
        return new CollectionAlbumsComponent(
            searchServiceMock.object,
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            indexingServiceMock.object,
            collectionServiceMock.object,
            albumServiceMock.object,
            trackServiceMock.object,
            settingsStub,
            schedulerMock.object,
            loggerMock.object,
        );
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        albumsPersisterMock = Mock.ofType<AlbumsAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<AlbumsTracksPersister>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        albumServiceMock = Mock.ofType<AlbumServiceBase>();
        trackServiceMock = Mock.ofType<TrackServiceBase>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();

        selectedAlbumsChangedMock = new Subject();
        selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();

        indexingFinishedMock = new Subject();
        indexingFinishedMock$ = indexingFinishedMock.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingFinishedMock$);

        collectionChangedMock = new Subject();
        collectionChangedMock$ = collectionChangedMock.asObservable();
        collectionServiceMock.setup((x) => x.collectionChanged$).returns(() => collectionChangedMock$);

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
        albums = [album1, album2];

        track1 = new Track('Path1');
        track1.duration = 1;
        track2 = new Track('Path2');
        track2.duration = 2;
        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);

        albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
        albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
        albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);
        trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);
        trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should set left pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(70);
        });

        it('should set right pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(30);
        });

        it('should define albums as empty', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionAlbumsComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('splitDragEnd', () => {
        it('should save the right pane width to the settings', () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [60, 40] } as IOutputData);

            // Assert
            expect(settingsStub.albumsRightPaneWidthPercent).toEqual(40);
        });
    });

    describe('selectedAlbumOrder', () => {
        it('should return the selected album order', () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should set the selected album order', () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should persist the selected album order', () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(selectedAlbumOrder), Times.exactly(1));
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the albums', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            await component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums).toEqual([]);
        });

        it('should clear the tracks', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            await component.ngOnInit();

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.tracks.tracks).toEqual([]);
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all albums', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums).toEqual(albums);
        });

        it('should get all tracks if there are no selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

            const component: CollectionAlbumsComponent = createComponent();

            component.albums = albums;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if there are selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            const component: CollectionAlbumsComponent = createComponent();

            component.albums = albums;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if the selected albums have changed and there are selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            const component: CollectionAlbumsComponent = createComponent();

            component.albums = albums;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

            // Act
            selectedAlbumsChangedMock.next([album2.albumKey]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if the selected albums have changed and there are no selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            const component: CollectionAlbumsComponent = createComponent();

            component.albums = albums;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            await component.ngOnInit();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);

            // Act
            selectedAlbumsChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should fill the lists when indexing is finished', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);
            trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();
            component.albums = [];
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            expect(component.albums).toBe(albums);
            expect(component.tracks).toBe(tracks);
        });

        it('should fill the lists when collection has changed', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);
            trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();
            component.albums = [];
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            expect(component.albums).toBe(albums);
            expect(component.tracks).toBe(tracks);
        });
    });
});
