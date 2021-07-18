// import { Observable, Subject } from 'rxjs';
// import { IMock, It, Mock, Times } from 'typemoq';
// import { AlbumData } from '../../../common/data/entities/album-data';
// import { Track } from '../../../common/data/entities/track';
// import { FileSystem } from '../../../common/io/file-system';
// import { Logger } from '../../../common/logger';
// import { Scheduler } from '../../../common/scheduler/scheduler';
// import { AlbumModel } from '../../../services/album/album-model';
// import { BaseAlbumService } from '../../../services/album/base-album-service';
// import { ArtistModel } from '../../../services/artist/artist-model';
// import { ArtistType } from '../../../services/artist/artist-type';
// import { BaseArtistService } from '../../../services/artist/base-artist.service';
// import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
// import { BaseTrackService } from '../../../services/track/base-track.service';
// import { TrackModel } from '../../../services/track/track-model';
// import { TrackModels } from '../../../services/track/track-models';
// import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
// import { AlbumOrder } from '../album-order';
// import { TrackOrder } from '../track-order';
// import { ArtistsAlbumsPersister } from './artists-albums-persister';
// import { ArtistsPersister } from './artists-persister';
// import { ArtistsTracksPersister } from './artists-tracks-persister';
// import { CollectionArtistsComponent } from './collection-artists.component';

// describe('CollectionArtistsComponent', () => {
//     let artistServiceMock: IMock<BaseArtistService>;
//     let albumServiceMock: IMock<BaseAlbumService>;
//     let trackServiceMock: IMock<BaseTrackService>;
//     let artistPersisterMock: IMock<ArtistsPersister>;
//     let albumsPersisterMock: IMock<ArtistsAlbumsPersister>;
//     let tracksPersisterMock: IMock<ArtistsTracksPersister>;
//     let settingsStub: any;
//     let schedulerMock: IMock<Scheduler>;
//     let loggerMock: IMock<Logger>;
//     let fileSystemMock: IMock<FileSystem>;
//     let indexingServiceMock: IMock<BaseIndexingService>;
//     let translatorServiceMock: IMock<BaseTranslatorService>;

//     let selectedAlbumsChangedMock: Subject<string[]>;
//     let selectedAlbumsChangedMock$: Observable<string[]>;

//     let selectedArtistsChangedMock: Subject<string[]>;
//     let selectedArtistsChangedMock$: Observable<string[]>;

//     let selectedArtistTypeChangedMock: Subject<ArtistType>;
//     let selectedArtistTypeChangedMock$: Observable<ArtistType>;

//     let indexingFinishedMock: Subject<void>;
//     let indexingFinishedMock$: Observable<void>;

//     let component: CollectionArtistsComponent;

//     let artist1: ArtistModel;
//     let artist2: ArtistModel;
//     let artists: ArtistModel[];

//     const albumData1: AlbumData = new AlbumData();
//     albumData1.albumKey = 'albumKey1';
//     const albumData2: AlbumData = new AlbumData();
//     albumData2.albumKey = 'albumKey2';
//     let album1: AlbumModel;
//     let album2: AlbumModel;
//     let albums: AlbumModel[];

//     let track1: Track;
//     let track2: Track;
//     let trackModel1: TrackModel;
//     let trackModel2: TrackModel;
//     let tracks: TrackModels;

//     beforeEach(() => {
//         artistPersisterMock = Mock.ofType<ArtistsPersister>();
//         albumsPersisterMock = Mock.ofType<ArtistsAlbumsPersister>();
//         tracksPersisterMock = Mock.ofType<ArtistsTracksPersister>();
//         artistServiceMock = Mock.ofType<BaseArtistService>();
//         albumServiceMock = Mock.ofType<BaseAlbumService>();
//         trackServiceMock = Mock.ofType<BaseTrackService>();
//         schedulerMock = Mock.ofType<Scheduler>();
//         loggerMock = Mock.ofType<Logger>();
//         fileSystemMock = Mock.ofType<FileSystem>();
//         settingsStub = { artistsLeftPaneWidthPercent: 25, artistsRightPaneWidthPercent: 25 };
//         indexingServiceMock = Mock.ofType<BaseIndexingService>();
//         translatorServiceMock = Mock.ofType<BaseTranslatorService>();

//         selectedAlbumsChangedMock = new Subject();
//         selectedAlbumsChangedMock$ = selectedAlbumsChangedMock.asObservable();

//         indexingFinishedMock = new Subject();
//         indexingFinishedMock$ = indexingFinishedMock.asObservable();

//         selectedArtistsChangedMock = new Subject();
//         selectedArtistsChangedMock$ = selectedArtistsChangedMock.asObservable();

//         selectedArtistTypeChangedMock = new Subject();
//         selectedArtistTypeChangedMock$ = selectedArtistTypeChangedMock.asObservable();

//         artist1 = new ArtistModel('Artist 1', translatorServiceMock.object);
//         artist2 = new ArtistModel('Artist 2', translatorServiceMock.object);

//         artists = [artist1, artist2];

//         album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileSystemMock.object);
//         album2 = new AlbumModel(albumData2, translatorServiceMock.object, fileSystemMock.object);
//         albums = [album1, album2];

//         track1 = new Track('Path1');
//         track1.duration = 1;
//         track2 = new Track('Path2');
//         track2.duration = 2;
//         trackModel1 = new TrackModel(track1, translatorServiceMock.object);
//         trackModel2 = new TrackModel(track2, translatorServiceMock.object);
//         tracks = new TrackModels();
//         tracks.addTrack(trackModel1);
//         tracks.addTrack(trackModel2);

//         artistPersisterMock.setup((x) => x.getSelectedArtistType()).returns(() => ArtistType.trackArtists);
//         artistPersisterMock.setup((x) => x.selectedArtistsChanged$).returns(() => selectedArtistsChangedMock$);
//         artistPersisterMock.setup((x) => x.selectedArtistTypeChanged$).returns(() => selectedArtistTypeChangedMock$);

//         artistServiceMock.setup((x) => x.getArtists(ArtistType.trackArtists)).returns(() => artists);

//         indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingFinishedMock$);

//         albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//         albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
//         albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

//         albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);
//         trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);
//         trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

//         component = new CollectionArtistsComponent(
//             artistPersisterMock.object,
//             albumsPersisterMock.object,
//             tracksPersisterMock.object,
//             indexingServiceMock.object,
//             artistServiceMock.object,
//             albumServiceMock.object,
//             trackServiceMock.object,
//             settingsStub,
//             schedulerMock.object,
//             loggerMock.object
//         );
//     });

//     describe('constructor', () => {
//         it('should create', () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component).toBeDefined();
//         });

//         it('should set left pane size from settings', async () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component.leftPaneSize).toEqual(25);
//         });

//         it('should set center pane size from settings', async () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component.centerPaneSize).toEqual(50);
//         });

//         it('should set right pane size from settings', async () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component.rightPaneSize).toEqual(25);
//         });

//         it('should define albums as empty', () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component.albums.length).toEqual(0);
//         });

//         it('should define tracks as empty', () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(component.tracks.tracks.length).toEqual(0);
//         });
//     });

//     describe('splitDragEnd', () => {
//         it('should save the left pane width to the settings', async () => {
//             // Arrange

//             // Act
//             component.splitDragEnd({ sizes: [30, 55, 15] });

//             // Assert
//             expect(settingsStub.artistsLeftPaneWidthPercent).toEqual(30);
//         });

//         it('should save the right pane width to the settings', async () => {
//             // Arrange

//             // Act
//             component.splitDragEnd({ sizes: [30, 55, 15] });

//             // Assert
//             expect(settingsStub.artistsRightPaneWidthPercent).toEqual(15);
//         });
//     });

//     describe('selectedAlbumOrder', () => {
//         it('should return the selected album order', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byYearAscending;

//             // Act
//             const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

//             // Assert
//             expect(selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
//         });

//         it('should set the selected album order', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

//             // Act
//             component.selectedAlbumOrder = AlbumOrder.byYearAscending;

//             // Assert
//             expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
//         });

//         it('should persist the selected album order', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

//             // Act
//             const selectedAlbumOrder: AlbumOrder = component.selectedAlbumOrder;

//             // Assert
//             albumsPersisterMock.verify((x) => x.setSelectedAlbumOrder(selectedAlbumOrder), Times.exactly(1));
//         });
//     });

//     describe('ngOnInit', () => {
//         it('should get all artists', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             // Act
//             await component.ngOnInit();

//             // Assert
//             expect(component.artists).toEqual(artists);
//         });

//         it('should set the album order', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             // Act
//             component.ngOnInit();

//             // Assert
//             expect(component.selectedAlbumOrder).toEqual(AlbumOrder.byYearAscending);
//         });

//         it('should get all albums', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             // Act
//             await component.ngOnInit();

//             // Assert
//             expect(component.albums).toEqual(albums);
//         });

//         it('should get all tracks if there are no selected albums', async () => {
//             // Arrange
//             albumsPersisterMock.reset();
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
//             albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

//             tracksPersisterMock.reset();
//             tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

//             trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             component.albums = albums;
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

//             // Act
//             await component.ngOnInit();

//             // Assert
//             trackServiceMock.verify((x) => x.getAllTracks(), Times.exactly(1));
//             expect(component.tracks).toBe(tracks);
//         });

//         it('should get tracks for the selected albums if there are selected albums', async () => {
//             // Arrange
//             albumsPersisterMock.reset();
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
//             albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

//             tracksPersisterMock.reset();
//             tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             component.albums = albums;
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;

//             // Act
//             await component.ngOnInit();

//             // Assert
//             trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
//             expect(component.tracks).toBe(tracks);
//         });

//         it('should get tracks for the selected albums if the selected albums have changed and there are selected albums', async () => {
//             // Arrange
//             albumsPersisterMock.reset();
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => [album2]);
//             albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

//             tracksPersisterMock.reset();
//             tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             component.albums = albums;
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             await component.ngOnInit();
//             trackServiceMock.reset();
//             trackServiceMock.setup((x) => x.getTracksForAlbums(It.isAny())).returns(() => tracks);

//             // Act
//             selectedAlbumsChangedMock.next([album2.albumKey]);

//             // Assert
//             trackServiceMock.verify((x) => x.getTracksForAlbums(['albumKey2']), Times.exactly(1));
//             expect(component.tracks).toBe(tracks);
//         });

//         it('should get tracks for the selected albums if the selected albums have changed and there are no selected albums', async () => {
//             // Arrange
//             albumsPersisterMock.reset();
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumsPersisterMock.setup((x) => x.getSelectedAlbums(albums)).returns(() => []);
//             albumsPersisterMock.setup((x) => x.selectedAlbumsChanged$).returns(() => selectedAlbumsChangedMock$);

//             tracksPersisterMock.reset();
//             tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             component.albums = albums;
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             await component.ngOnInit();
//             trackServiceMock.reset();
//             trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

//             // Act
//             selectedAlbumsChangedMock.next([]);

//             // Assert
//             trackServiceMock.verify((x) => x.getAllTracks(), Times.exactly(1));
//             expect(component.tracks).toBe(tracks);
//         });

//         it('should reset the selected albums if the selected artists have changed and there are selected artists', async () => {
//             throw new Error();
//         });

//         it('should reset the selected albums if the selected artists have changed and there are no selected artists', async () => {
//             throw new Error();
//         });

//         it('should get albums for the selected artists if the selected artists have changed and there are selected artists', async () => {
//             throw new Error();
//         });

//         it('should get all albums if the selected artists have changed and there are no selected artists', async () => {
//             throw new Error();
//         });

//         it('should get tracks for the selected artists if the selected artists have changed and there are selected artists', async () => {
//             throw new Error();
//         });

//         it('should get all tracks if the selected artists have changed and there are no selected artists', async () => {
//             throw new Error();
//         });

//         it('should refresh the lists when indexing is finished', async () => {
//             throw new Error();
//         });
//     });

//     describe('ngOnDestroy', () => {
//         it('should clear the albums', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             albumServiceMock.setup((x) => x.getAllAlbums()).returns(() => albums);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             component.ngOnInit();

//             // Act
//             component.ngOnDestroy();

//             // Assert
//             expect(component.albums).toEqual([]);
//         });

//         it('should clear the tracks', async () => {
//             // Arrange
//             component.selectedAlbumOrder = AlbumOrder.byAlbumArtist;
//             albumsPersisterMock.setup((x) => x.getSelectedAlbumOrder()).returns(() => AlbumOrder.byYearAscending);
//             tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

//             component = new CollectionArtistsComponent(
//                 artistPersisterMock.object,
//                 albumsPersisterMock.object,
//                 tracksPersisterMock.object,
//                 indexingServiceMock.object,
//                 artistServiceMock.object,
//                 albumServiceMock.object,
//                 trackServiceMock.object,
//                 settingsStub,
//                 schedulerMock.object,
//                 loggerMock.object
//             );

//             await component.ngOnInit();

//             // Act
//             component.ngOnDestroy();

//             // Assert
//             expect(component.tracks.tracks).toEqual([]);
//         });
//     });
// });
