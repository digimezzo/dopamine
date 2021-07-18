import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../common/data/entities/album-data';
import { Track } from '../../../common/data/entities/track';
import { FileSystem } from '../../../common/io/file-system';
import { Logger } from '../../../common/logger';
import { Scheduler } from '../../../common/scheduler/scheduler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BaseGenreService } from '../../../services/genre/base-genre.service';
import { GenreModel } from '../../../services/genre/genre-model';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { TrackOrder } from '../track-order';
import { CollectionGenresComponent } from './collection-genres.component';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { GenresPersister } from './genres-persister';
import { GenresTracksPersister } from './genres-tracks-persister';

describe('CollectionGenresComponent', () => {
    let genresPersisterMock: IMock<GenresPersister>;
    let albumsPersisterMock: IMock<GenresAlbumsPersister>;
    let tracksPersisterMock: IMock<GenresTracksPersister>;
    let genreServiceMock: IMock<BaseGenreService>;
    let albumServiceMock: IMock<BaseAlbumService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let fileSystemMock: IMock<FileSystem>;
    let settingsStub: any;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let selectedAlbumsChangedMock: Subject<string[]>;
    let selectedAlbumsChangedMock$: Observable<string[]>;

    let selectedGenresChangedMock: Subject<string[]>;
    let selectedGenresChangedMock$: Observable<string[]>;

    let indexingFinishedMock: Subject<void>;
    let indexingFinishedMock$: Observable<void>;

    let component: CollectionGenresComponent;

    let genre1: GenreModel;
    let genre2: GenreModel;
    let genre3: GenreModel;
    let genre4: GenreModel;
    let genres: GenreModel[];

    const albumData1: AlbumData = new AlbumData();
    albumData1.albumKey = 'albumKey1';
    const albumData2: AlbumData = new AlbumData();
    albumData2.albumKey = 'albumKey2';
    const albumData3: AlbumData = new AlbumData();
    albumData3.albumKey = 'albumKey3';
    const albumData4: AlbumData = new AlbumData();
    albumData4.albumKey = 'albumKey4';

    let album1: AlbumModel;
    let album2: AlbumModel;
    let album3: AlbumModel;
    let album4: AlbumModel;
    let albums: AlbumModel[];

    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let tracks: TrackModels;

    const track1: Track = new Track('Path1');
    track1.duration = 1;
    const track2: Track = new Track('Path2');
    track2.duration = 2;
    const track3: Track = new Track('Path3');
    track3.duration = 3;
    const track4: Track = new Track('Path4');
    track4.duration = 4;

    beforeEach(() => {
        genresPersisterMock = Mock.ofType<GenresPersister>();
        albumsPersisterMock = Mock.ofType<GenresAlbumsPersister>();
        tracksPersisterMock = Mock.ofType<GenresTracksPersister>();
        genreServiceMock = Mock.ofType<BaseGenreService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        fileSystemMock = Mock.ofType<FileSystem>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { genresLeftPaneWidthPercent: 25, genresRightPaneWidthPercent: 25 };
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        genre1 = new GenreModel('genre1', translatorServiceMock.object);
        genre2 = new GenreModel('genre2', translatorServiceMock.object);
        genre3 = new GenreModel('genre3', translatorServiceMock.object);
        genre4 = new GenreModel('genre4', translatorServiceMock.object);
        genres = [genre1, genre2, genre3, genre4];

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileSystemMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, fileSystemMock.object);
        album3 = new AlbumModel(albumData3, translatorServiceMock.object, fileSystemMock.object);
        album4 = new AlbumModel(albumData4, translatorServiceMock.object, fileSystemMock.object);
        albums = [album1, album2, album3, album4];

        trackModel1 = new TrackModel(track1, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, translatorServiceMock.object);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);

        selectedAlbumsChangedMock = new Subject();
        selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();

        selectedGenresChangedMock = new Subject();
        selectedGenresChangedMock$ = selectedGenresChangedMock.asObservable();

        indexingFinishedMock = new Subject();
        indexingFinishedMock$ = indexingFinishedMock.asObservable();

        albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
        albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
        albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

        genresPersisterMock.setup((x) => x.selectedGenresChanged$).returns(() => selectedGenresChangedMock$);

        albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);
        trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);
        trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingFinishedMock$);

        component = new CollectionGenresComponent(
            genresPersisterMock.object,
            albumsPersisterMock.object,
            tracksPersisterMock.object,
            indexingServiceMock.object,
            genreServiceMock.object,
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
        it('should save the left pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresRightPaneWidthPercent).toEqual(15);
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
        it('should set the album order', () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
        });

        it('should get all genres', async () => {
            // Arrange
            const selectedGenres: GenreModel[] = [genre1];

            genreServiceMock.setup((x) => x.getGenres()).returns(() => genres);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.genres.length).toEqual(4);
            expect(component.genres[0]).toEqual(genres[0]);
            expect(component.genres[1]).toEqual(genres[1]);
            expect(component.genres[2]).toEqual(genres[2]);
            expect(component.genres[3]).toEqual(genres[3]);
        });

        it('should get all albums if there are no selected genres', async () => {
            // Arrange
            genreServiceMock.setup((x) => x.getGenres()).returns(() => []);
            genresPersisterMock.setup((x) => x.getSelectedGenres([])).returns(() => []);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums.length).toEqual(4);
            expect(component.albums[0]).toEqual(albums[0]);
            expect(component.albums[1]).toEqual(albums[1]);
            expect(component.albums[2]).toEqual(albums[2]);
            expect(component.albums[3]).toEqual(albums[3]);
        });

        it('should get albums for the selected genres if there are selected genres', async () => {
            // Arrange
            const selectedGenres: GenreModel[] = [genre1];

            genreServiceMock.setup((x) => x.getGenres()).returns(() => genres);
            genresPersisterMock.setup((x) => x.getSelectedGenres([])).returns(() => selectedGenres);
            albumServiceMock.setup((x) => x.getAlbumsForGenres(['genre1'])).returns(() => [album1, album2]);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.albums.length).toEqual(2);
            expect(component.albums[0]).toEqual(albums[0]);
            expect(component.albums[1]).toEqual(albums[1]);
        });

        it('should get all tracks if there are no selected genres and no selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenres(genres)).returns(() => []);
            genresPersisterMock.setup((x) => x.selectedGenresChanged$).returns(() => selectedGenresChangedMock$);

            trackServiceMock.reset();
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            genreServiceMock.setup((x) => x.getGenres()).returns(() => genres);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.tracks.tracks.length).toEqual(4);
            expect(component.tracks.tracks[0]).toBe(tracks.tracks[0]);
            expect(component.tracks.tracks[1]).toBe(tracks.tracks[1]);
            expect(component.tracks.tracks[2]).toBe(tracks.tracks[2]);
            expect(component.tracks.tracks[3]).toBe(tracks.tracks[3]);
        });

        it('should get tracks for the selected genres if there are selected genres', async () => {
            throw new Error();
            // // Arrange
            // albumsPersisterMock.reset();
            // albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            // albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            // albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            // tracksPersisterMock.reset();
            // tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            // component = new CollectionGenresComponent(
            //     genresPersisterMock.object,
            //     albumsPersisterMock.object,
            //     tracksPersisterMock.object,
            //     genreServiceMock.object,
            //     albumServiceMock.object,
            //     trackServiceMock.object,
            //     settingsStub,
            //     schedulerMock.object,
            //     loggerMock.object
            // );

            // component.albums = albums;
            // component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // // Act
            // await component.ngOnInit();

            // // Assert
            // trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
            // expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if there are selected albums', async () => {
            throw new Error();
            // // Arrange
            // albumsPersisterMock.reset();
            // albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            // albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            // albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            // tracksPersisterMock.reset();
            // tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            // component = new CollectionGenresComponent(
            //     genresPersisterMock.object,
            //     albumsPersisterMock.object,
            //     tracksPersisterMock.object,
            //     genreServiceMock.object,
            //     albumServiceMock.object,
            //     trackServiceMock.object,
            //     settingsStub,
            //     schedulerMock.object,
            //     loggerMock.object
            // );

            // component.albums = albums;
            // component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

            // // Act
            // await component.ngOnInit();

            // // Assert
            // trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
            // expect(component.tracks).toBe(tracks);
        });

        it('should get tracks for the selected albums if the selected albums have changed and there are selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

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

        it('should get all tracks if the selected albums have changed and there are no selected albums', async () => {
            // Arrange
            albumsPersisterMock.reset();
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
            albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
                settingsStub,
                schedulerMock.object,
                loggerMock.object
            );

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

        it('should reset the selected albums if the selected genres have changed and there are selected genres', async () => {
            throw new Error();
        });

        it('should reset the selected albums if the selected genres have changed and there are no selected genres', async () => {
            throw new Error();
        });

        it('should get albums for the selected genres if the selected genres have changed and there are selected genres', async () => {
            throw new Error();
        });

        it('should get all albums if the selected genres have changed and there are no selected genres', async () => {
            throw new Error();
        });

        it('should get tracks for the selected genres if the selected genres have changed and there are selected genres', async () => {
            throw new Error();
        });

        it('should get all tracks if the selected genres have changed and there are no selected genres', async () => {
            throw new Error();
        });

        it('should refresh the lists when indexing is finished', async () => {
            throw new Error();
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the albums', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
                albumServiceMock.object,
                trackServiceMock.object,
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

        it('should clear the tracks', async () => {
            // Arrange
            component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
            albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            component = new CollectionGenresComponent(
                genresPersisterMock.object,
                albumsPersisterMock.object,
                tracksPersisterMock.object,
                indexingServiceMock.object,
                genreServiceMock.object,
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
