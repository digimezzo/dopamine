import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../common/data/entities/album-data';
import { Track } from '../../../common/data/entities/track';
import { FileSystem } from '../../../common/io/file-system';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { CollectionTab } from '../collection-tab';
import { AlbumsAlbumsPersister } from './albums-albums-persister';
import { AlbumsTracksPersister } from './albums-tracks-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let albumServiceMock: IMock<BaseAlbumService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let albumsPersisterMock: IMock<AlbumsAlbumsPersister>;
    let tracksPersisterMock: IMock<AlbumsTracksPersister>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let fileSystemMock: IMock<FileSystem>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let indexingFinishedMock: Subject<void>;
    let indexingFinishedMock$: Observable<void>;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

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

    const flushPromises = () => new Promise(setImmediate);

    function createComponent(): CollectionAlbumsComponent {
        const component: CollectionAlbumsComponent = new CollectionAlbumsComponent(
            searchServiceMock.object,
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            collectionPersisterMock.object,
            indexingServiceMock.object,
            albumServiceMock.object,
            trackServiceMock.object,
            settingsStub,
            schedulerMock.object,
            loggerMock.object
        );

        return component;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        albumsPersisterMock = Mock.ofType<AlbumsAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<AlbumsTracksPersister>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        fileSystemMock = Mock.ofType<FileSystem>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        selectedAlbumsChangedMock = new Subject();
        selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();

        indexingFinishedMock = new Subject();
        indexingFinishedMock$ = indexingFinishedMock.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingFinishedMock$);

        selectedTabChangedMock = new Subject();
        selectedTabChangedMock$ = selectedTabChangedMock.asObservable();
        collectionPersisterMock.setup((x) => x.selectedTabChanged$).returns(() => selectedTabChangedMock$);

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileSystemMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, fileSystemMock.object);
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
            component.splitDragEnd({ sizes: [60, 40] });

            // Assert
            expect(settingsStub.albumsRightPaneWidthPercent).toEqual(40);
        });
    });

    describe('selectedAlbumOrder', () => {
        it('should return the selected album order', async () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should set the selected album order', async () => {
            // Arrange
            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should persist the selected album order', async () => {
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

        it('should get all albums and the selected tab is albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums).toEqual(albums);
        });

        it('should not get all albums and the selected tab is not albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionAlbumsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should get all tracks if there are no selected albums and the selected tab is albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

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
            trackServiceMock.verify((x) => x.getAllTracks(), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if there are selected albums and the selected tab is albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

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

        it('should not get tracks if the selected tab is not albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            const component: CollectionAlbumsComponent = createComponent();

            component.albums = albums;
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            expect(component.tracks.tracks.length).toEqual(0);
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
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            // Act
            selectedAlbumsChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.exactly(1));
            expect(component.tracks).toBe(tracks);
        });

        it('should fill the lists when indexing is finished and the selected tab is albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);
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

        it('should not fill the lists when indexing is finished and the selected tab is not albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumArtist);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);
            trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

            const component: CollectionAlbumsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            await component.ngOnInit();
            component.albums = [];
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should fill the lists if the selected tab has changed to albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumTitleAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            const component: CollectionAlbumsComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getAllTracks(), Times.once());
            expect(component.albums.length).toEqual(2);
            expect(component.tracks.tracks.length).toEqual(2);
        });

        it('should clear the lists if the selected tab has changed to not albums', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.albums);

            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byAlbumTitleAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            const component: CollectionAlbumsComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => CollectionTab.artists);

            albumServiceMock.reset();
            trackServiceMock.reset();

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getAllTracks(), Times.never());
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });
});
