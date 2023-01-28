import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Constants } from '../../../common/application/constants';
import { AlbumData } from '../../../common/data/entities/album-data';
import { Track } from '../../../common/data/entities/track';
import { DateTime } from '../../../common/date-time';
import { FileAccess } from '../../../common/io/file-access';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { ArtistModel } from '../../../services/artist/artist-model';
import { ArtistType } from '../../../services/artist/artist-type';
import { BaseArtistService } from '../../../services/artist/base-artist.service';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { ArtistsAlbumsPersister } from './artists-albums-persister';
import { ArtistsPersister } from './artists-persister';
import { ArtistsTracksPersister } from './artists-tracks-persister';
import { CollectionArtistsComponent } from './collection-artists.component';

describe('CollectionArtistsComponent', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let artistsPersisterMock: IMock<ArtistsPersister>;
    let albumsPersisterMock: IMock<ArtistsAlbumsPersister>;
    let tracksPersisterMock: IMock<ArtistsTracksPersister>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let collectionServiceMock: IMock<BaseCollectionService>;
    let artistServiceMock: IMock<BaseArtistService>;
    let albumServiceMock: IMock<BaseAlbumService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<FileAccess>;

    let selectedArtistsChangedMock: Subject<string[]>;
    let selectedArtistsChangedMock$: Observable<string[]>;

    let selectedArtistTypeChangedMock: Subject<ArtistType>;
    let selectedArtistTypeChangedMock$: Observable<ArtistType>;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let indexingFinishedMock: Subject<void>;
    let indexingFinishedMock$: Observable<void>;

    let collectionChangedMock: Subject<void>;
    let collectionChangedMock$: Observable<void>;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionArtistsComponent {
        const component: CollectionArtistsComponent = new CollectionArtistsComponent(
            searchServiceMock.object,
            artistsPersisterMock.object,
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            collectionPersisterMock.object,
            indexingServiceMock.object,
            collectionServiceMock.object,
            artistServiceMock.object,
            albumServiceMock.object,
            trackServiceMock.object,
            settingsStub,
            schedulerMock.object,
            loggerMock.object
        );

        return component;
    }

    function createArtistModel(artistName: string): ArtistModel {
        const artistModel: ArtistModel = new ArtistModel(artistName, translatorServiceMock.object);

        return artistModel;
    }

    function createAlbumModel(albumKey: string): AlbumModel {
        const albumData: AlbumData = new AlbumData();
        albumData.albumKey = albumKey;
        const albumModel: AlbumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

        return albumModel;
    }

    function createTrackModel(path: string): TrackModel {
        const track: Track = new Track(path);
        const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

        return trackModel;
    }

    function createTrackModels(tracks: TrackModel[]): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            trackModels.addTrack(track);
        }

        return trackModels;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        artistsPersisterMock = Mock.ofType<ArtistsPersister>();
        albumsPersisterMock = Mock.ofType<ArtistsAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<ArtistsTracksPersister>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        collectionServiceMock = Mock.ofType<BaseCollectionService>();
        artistServiceMock = Mock.ofType<BaseArtistService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        settingsStub = { artistsLeftPaneWidthPercent: 25, artistsRightPaneWidthPercent: 25 };
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<FileAccess>();

        selectedArtistsChangedMock = new Subject();
        selectedArtistsChangedMock$ = selectedArtistsChangedMock.asObservable();
        artistsPersisterMock.setup((x) => x.selectedArtistsChanged$).returns(() => selectedArtistsChangedMock$);

        selectedArtistTypeChangedMock = new Subject();
        selectedArtistTypeChangedMock$ = selectedArtistTypeChangedMock.asObservable();
        artistsPersisterMock.setup((x) => x.selectedArtistTypeChanged$).returns(() => selectedArtistTypeChangedMock$);

        selectedAlbumsChangedMock = new Subject();
        selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();
        albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

        indexingFinishedMock = new Subject();
        indexingFinishedMock$ = indexingFinishedMock.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingFinishedMock$);

        collectionChangedMock = new Subject();
        collectionChangedMock$ = collectionChangedMock.asObservable();
        collectionServiceMock.setup((x) => x.collectionChanged$).returns(() => collectionChangedMock$);

        selectedTabChangedMock = new Subject();
        selectedTabChangedMock$ = selectedTabChangedMock.asObservable();
        collectionPersisterMock.setup((x) => x.selectedTabChanged$).returns(() => selectedTabChangedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should set left pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(25);
        });

        it('should set center pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.centerPaneSize).toEqual(50);
        });

        it('should set right pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(25);
        });

        it('should define artists as empty', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.artists.length).toEqual(0);
        });

        it('should define albums as empty', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionArtistsComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('selectedAlbumOrder', () => {
        it('should return the selected album order', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should set the selected album order', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should persist the selected album order', () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();

            // Act
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(component.selectedAlbumOrder), Times.once());
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the artists', () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            const artist: ArtistModel = createArtistModel('artist1');
            component.artists = [artist];

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.artists.length).toEqual(0);
        });

        it('should clear the albums', () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            const album: AlbumModel = createAlbumModel('albumKey1');
            component.albums = [album];

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should clear the tracks', () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            const track: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track]);
            component.tracks = trackModels;

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.artistsLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.artistsRightPaneWidthPercent).toEqual(15);
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all artists if artists type is allArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.once());
            expect(component.artists.length).toEqual(2);
            expect(component.artists[0]).toEqual(artist1);
            expect(component.artists[1]).toEqual(artist2);
        });

        it('should get all track artists if artists type is trackArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.trackArtists)).returns(() => [artist1]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.trackArtists);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.trackArtists), Times.once());
            expect(component.artists.length).toEqual(1);
            expect(component.artists[0]).toEqual(artist1);
        });

        it('should get all album artists if artists type is albumArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.albumArtists)).returns(() => [artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.albumArtists);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.albumArtists), Times.once());
            expect(component.artists.length).toEqual(1);
            expect(component.artists[0]).toEqual(artist2);
        });

        it('should not get artists if the selected tab is not artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(It.isAny()), Times.never());
            expect(component.artists.length).toEqual(0);
        });

        it('should get all albums if there are no selected artists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.trackArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.trackArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists(It.isAny(), It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get albums for all selected artists if there are selected artists and artists type is allArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => [album1, album2]);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get albums for selected track artists if there are selected artists and artists type is trackArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.trackArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.trackArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.trackArtists))
                .returns(() => [album1]);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.trackArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album1);
        });

        it('should get albums for selected album artists if there are selected artists and artists type is albumArtists and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.albumArtists);
            artistServiceMock.setup((x) => x.getArtists(ArtistType.albumArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.albumArtists))
                .returns(() => [album2]);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.albumArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album2);
        });

        it('should not get albums if the selected tab is not artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.albumArtists);
            artistServiceMock.setup((x) => x.getArtists(ArtistType.albumArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.albumArtists))
                .returns(() => [album2]);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists(It.isAny(), It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(0);
        });

        it('should get all tracks if there are no selected artists and no selected albums and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), ArtistType.allArtists), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected artists if there are selected artists but no selected albums and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock
                .setup((x) => x.getTracksForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists([artist1.name, artist2.name], ArtistType.allArtists), Times.once());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if there are no selected artists but there are selected albums and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if there are selected genres and there are selected albums and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not get tracks if the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should reset the selected albums if the selected artists have changed and there are no selected artists', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();
            selectedArtistsChangedMock.next([]);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should reset the selected albums if the selected artists have changed and there are selected artists', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            const component: CollectionArtistsComponent = createComponent();

            // Act
            await component.ngOnInit();
            selectedArtistsChangedMock.next([artist1.name, artist2.name]);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should get all albums if the selected artists have changed and there are no selected artists', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            // Act
            selectedArtistsChangedMock.next([]);

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists(It.isAny(), It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get albums for the selected artists if the selected artists have changed and there are selected artists', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => [album1, album2]);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();
            albumServiceMock.reset();
            albumServiceMock
                .setup((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => [album1, album2]);

            // Act
            selectedArtistsChangedMock.next([artist1.name, artist2.name]);

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForArtists([artist1.name, artist2.name], ArtistType.allArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get all tracks if the selected artists have changed and there are no selected artists', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedArtistsChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected artists if the selected artists have changed and there are selected artists', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock
                .setup((x) => x.getTracksForArtists([artist1.name, artist2.name], ArtistType.allArtists))
                .returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedArtistsChangedMock.next([artist1.name, artist2.name]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists([artist1.name, artist2.name], ArtistType.allArtists), Times.once());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should reset the selected albums if the selected artist type has changed to allArtists', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            // Act

            selectedArtistTypeChangedMock.next(ArtistType.allArtists);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should reset the selected albums if the selected artist type has changed to trackArtists', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            // Act

            selectedArtistTypeChangedMock.next(ArtistType.trackArtists);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should reset the selected albums if the selected artist type has changed to albumArtists', async () => {
            // Arrange
            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            // Act

            selectedArtistTypeChangedMock.next(ArtistType.albumArtists);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should get all tracks if the selected albums have changed and there are no selected albums', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedAlbumsChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if the selected albums have changed and there are selected albums', async () => {
            // Arrange
            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist1, artist2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedAlbumsChangedMock.next([album1.albumKey, album2.albumKey]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should fill the lists when indexing is finished and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            artistServiceMock.reset();
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            component.artists = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.artists.length).toEqual(2);
            expect(component.artists[0]).toEqual(artist1);
            expect(component.artists[1]).toEqual(artist2);
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not fill the lists when indexing is finished and the selected tab is not artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            component.artists = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.artists.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should fill the lists if the selected tab has changed to artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.albumsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track1]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.artists.length).toEqual(1);
            expect(component.artists[0]).toEqual(artist1);
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album1);
            expect(component.tracks.tracks.length).toEqual(1);
            expect(component.tracks.tracks[0]).toEqual(track1);
        });

        it('should clear the lists if the selected tab has changed to not artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track1]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            artistServiceMock.reset();
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1]);
            albumServiceMock.reset();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);
            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.albumsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.artists.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should fill the lists when collection has changed and the selected tab is artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const artist1: ArtistModel = createArtistModel('artist1');
            const artist2: ArtistModel = createArtistModel('artist2');
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            artistsPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.allArtists);
            artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionArtistsComponent = createComponent();

            await component.ngOnInit();

            artistServiceMock.reset();
            artistServiceMock.setup((x) => x.getArtists(ArtistType.allArtists)).returns(() => [artist1, artist2]);
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            component.artists = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.artists.length).toEqual(2);
            expect(component.artists[0]).toEqual(artist1);
            expect(component.artists[1]).toEqual(artist2);
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not fill the lists when collection has changed and the selected tab is not artists', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const component: CollectionArtistsComponent = createComponent();
            await component.ngOnInit();

            component.artists = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            artistServiceMock.verify((x) => x.getArtists(ArtistType.allArtists), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.artists.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });
});
