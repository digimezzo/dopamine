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
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseGenreService } from '../../../services/genre/base-genre.service';
import { GenreModel } from '../../../services/genre/genre-model';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { CollectionPersister } from '../collection-persister';
import { CollectionGenresComponent } from './collection-genres.component';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresPersister } from './genres-persister';
import { GenresTracksPersister } from './genres-tracks-persister';

describe('CollectionGenresComponent', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let genresPersisterMock: IMock<GenresPersister>;
    let albumsPersisterMock: IMock<GenresAlbumsPersister>;
    let tracksPersisterMock: IMock<GenresTracksPersister>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let collectionServiceMock: IMock<BaseCollectionService>;
    let genreServiceMock: IMock<BaseGenreService>;
    let albumServiceMock: IMock<BaseAlbumService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<FileAccess>;

    let selectedGenresChangedMock: Subject<string[]>;
    let selectedGenresChangedMock$: Observable<string[]>;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let indexingFinishedMock: Subject<void>;
    let indexingFinishedMock$: Observable<void>;

    let collectionChangedMock: Subject<void>;
    let collectionChangedMock$: Observable<void>;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionGenresComponent {
        const component: CollectionGenresComponent = new CollectionGenresComponent(
            searchServiceMock.object,
            genresPersisterMock.object,
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            collectionPersisterMock.object,
            indexingServiceMock.object,
            collectionServiceMock.object,
            genreServiceMock.object,
            albumServiceMock.object,
            trackServiceMock.object,
            settingsStub,
            schedulerMock.object,
            loggerMock.object
        );

        return component;
    }

    function createGenreModel(genreName: string): GenreModel {
        const genreModel: GenreModel = new GenreModel(genreName, translatorServiceMock.object);

        return genreModel;
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
        genresPersisterMock = Mock.ofType<GenresPersister>();
        albumsPersisterMock = Mock.ofType<GenresAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<GenresTracksPersister>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        collectionServiceMock = Mock.ofType<BaseCollectionService>();
        genreServiceMock = Mock.ofType<BaseGenreService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        settingsStub = { genresLeftPaneWidthPercent: 25, genresRightPaneWidthPercent: 25 };
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<FileAccess>();

        selectedGenresChangedMock = new Subject();
        selectedGenresChangedMock$ = selectedGenresChangedMock.asObservable();
        genresPersisterMock.setup((x) => x.selectedGenresChanged$).returns(() => selectedGenresChangedMock$);

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
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should set left pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.leftPaneSize).toEqual(25);
        });

        it('should set center pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.centerPaneSize).toEqual(50);
        });

        it('should set right pane size from settings', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.rightPaneSize).toEqual(25);
        });

        it('should define genres as empty', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.genres.length).toEqual(0);
        });

        it('should define albums as empty', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionGenresComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('selectedAlbumOrder', () => {
        it('should return the selected album order', async () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Act
            const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

            // Assert
            expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should set the selected album order', async () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            component.selectedAlbumOrder = AlbumOrder.byYearAscending;

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should persist the selected album order', () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();

            // Act
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // Assert
            albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(component.selectedAlbumOrder), Times.once());
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the genres', () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
            const genre: GenreModel = createGenreModel('genre1');
            component.genres = [genre];

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.genres.length).toEqual(0);
        });

        it('should clear the albums', () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
            const album: AlbumModel = createAlbumModel('albumKey1');
            component.albums = [album];

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.albums.length).toEqual(0);
        });

        it('should clear the tracks', () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
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
            const component: CollectionGenresComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresRightPaneWidthPercent).toEqual(15);
        });
    });

    describe('ngOnInit', () => {
        it('should set the album order', async () => {
            // Arrange
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all genres if the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.once());
            expect(component.genres.length).toEqual(2);
            expect(component.genres[0]).toEqual(genre1);
            expect(component.genres[1]).toEqual(genre2);
        });

        it('should not get all genres if the selected tab is not genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.never());
            expect(component.genres.length).toEqual(0);
        });

        it('should get all albums if there are no selected genres and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForGenres(It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get albums for the selected genres if there are selected genres and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            albumServiceMock.setup((x) => x.getAlbumsForGenres([genre1.name])).returns(() => [album1]);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForGenres([genre1.name]), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album1);
        });

        it('should not get albums if the selected tab is not genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForGenres(It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(0);
        });

        it('should get all tracks if there are no selected genres and no selected albums and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected genres if there are selected genres but no selected albums and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1, genre2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAlbumsForGenres([genre1.name, genre2.name])).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForGenres([genre1.name, genre2.name])).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres([genre1.name, genre2.name]), Times.once());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if there are no selected genres but there are selected albums and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if there are selected genres and there are selected albums and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1, genre2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAlbumsForGenres([genre1.name, genre2.name])).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not get tracks if the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const component: CollectionGenresComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should reset the selected albums if the selected genres have changed and there are no selected genres', async () => {
            // Arrange
            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            // Act
            selectedGenresChangedMock.next([]);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should reset the selected albums if the selected genres have changed and there are selected genres', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            // Act
            selectedGenresChangedMock.next([genre1.name, genre2.name]);

            // Assert
            albumsPersisterMock.verify((x) => x.resetSelectedAlbums(), Times.once());
        });

        it('should get all albums if the selected genres have changed and there are no selected genres', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            // Act
            selectedGenresChangedMock.next([]);

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForGenres(It.isAny()), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get albums for the selected genres if the selected genres have changed and there are selected genres', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1, genre2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAlbumsForGenres([genre1.name, genre2.name])).returns(() => [album1, album2]);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAlbumsForGenres([genre1.name, genre2.name])).returns(() => [album1, album2]);

            // Act
            selectedGenresChangedMock.next([genre1.name, genre2.name]);

            // Assert
            albumServiceMock.verify((x) => x.getAlbumsForGenres([genre1.name, genre2.name]), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
        });

        it('should get all tracks if the selected genres have changed and there are no selected genres', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedGenresChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected genres if the selected genres have changed and there are selected genres', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1, genre2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForGenres([genre1.name, genre2.name])).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedGenresChangedMock.next([genre1.name, genre2.name]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres([genre1.name, genre2.name]), Times.once());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get all tracks if the selected albums have changed and there are no selected albums', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedAlbumsChangedMock.next([]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should get tracks for the selected albums if the selected albums have changed and there are selected albums', async () => {
            // Arrange
            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre1, genre2]);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey])).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            // Act
            selectedAlbumsChangedMock.next([album1.albumKey, album2.albumKey]);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres(It.isAny()), Times.never());
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey, album2.albumKey]), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should fill the lists when indexing is finished and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            genreServiceMock.reset();
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            component.genres = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.genres.length).toEqual(2);
            expect(component.genres[0]).toEqual(genre1);
            expect(component.genres[1]).toEqual(genre2);
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not fill the lists when indexing is finished and the selected tab is not genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            component.genres = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            indexingFinishedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.genres.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should fill the lists if the selected tab has changed to genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track1]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.genres.length).toEqual(1);
            expect(component.genres[0]).toEqual(genre1);
            expect(component.albums.length).toEqual(1);
            expect(component.albums[0]).toEqual(album1);
            expect(component.tracks.tracks.length).toEqual(1);
            expect(component.tracks.tracks[0]).toEqual(track1);
        });

        it('should clear the lists if the selected tab has changed to not genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track1]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            genreServiceMock.reset();
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1]);
            albumServiceMock.reset();
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);
            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.albumsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.genres.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should fill the lists when collection has changed and the selected tab is genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.genresTabLabel);

            const genre1: GenreModel = createGenreModel('genre1');
            const genre2: GenreModel = createGenreModel('genre2');
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => []);

            const album1: AlbumModel = createAlbumModel('albumKey1');
            const album2: AlbumModel = createAlbumModel('albumKey2');
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums([album1, album2])).returns(() => []);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            const component: CollectionGenresComponent = createComponent();

            await component.ngOnInit();

            genreServiceMock.reset();
            genreServiceMock.setup((x) => x.getGenres()).returns(() => [genre1, genre2]);
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => [album1, album2]);
            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => trackModels);

            component.genres = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.once());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.once());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            expect(component.genres.length).toEqual(2);
            expect(component.genres[0]).toEqual(genre1);
            expect(component.genres[1]).toEqual(genre2);
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(album1);
            expect(component.albums[1]).toEqual(album2);
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not fill the lists when collection has changed and the selected tab is not genres', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const component: CollectionGenresComponent = createComponent();
            await component.ngOnInit();

            component.genres = [];
            component.albums = [];
            component.tracks = new TrackModels();

            // Act
            collectionChangedMock.next();
            await flushPromises();

            // Assert
            genreServiceMock.verify((x) => x.getGenres(), Times.never());
            albumServiceMock.verify((x) => x.getAllAlbums(), Times.never());
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.never());
            expect(component.genres.length).toEqual(0);
            expect(component.albums.length).toEqual(0);
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });
});
