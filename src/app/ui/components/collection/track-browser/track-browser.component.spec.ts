import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../../../data/entities/track';
import { TrackModel } from '../../../../services/track/track-model';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { BaseTracksPersister } from '../base-tracks-persister';
import { TrackOrder, trackOrderKey } from '../track-order';
import { TrackBrowserComponent } from './track-browser.component';
import { TrackModels } from '../../../../services/track/track-models';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { ContextMenuOpener } from '../../context-menu-opener';
import { PlaybackIndicationServiceBase } from '../../../../services/playback-indication/playback-indication.service.base';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { Logger } from '../../../../common/logger';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { DateTime } from '../../../../common/date-time';
import { GuidFactory } from '../../../../common/guid.factory';
import { TrackSorter } from '../../../../common/sorting/track-sorter';
import { SettingsMock } from '../../../../testing/settings-mock';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { MetadataService } from '../../../../services/metadata/metadata.service';

describe('TrackBrowserComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let playbackIndicationServiceMock: IMock<PlaybackIndicationServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let trackSorterMock: IMock<TrackSorter>;
    let desktopMock: IMock<DesktopBase>;
    let loggerMock: IMock<Logger>;
    let tracksPersisterMock: IMock<BaseTracksPersister>;
    let collectionServiceMock: IMock<CollectionServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let guidFactoryMock: IMock<GuidFactory>;
    let settingsMock: any;

    let playbackStartedMock: Subject<PlaybackStarted>;
    let playbackStartedMock$: Observable<PlaybackStarted>;

    let playbackStoppedMock: Subject<void>;
    let playbackStoppedMock$: Observable<void>;

    let metadataService_ratingSaved: Subject<TrackModel>;
    let metadataService_loveSaved: Subject<TrackModel>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let tracks: TrackModels;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        playbackIndicationServiceMock = Mock.ofType<PlaybackIndicationServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        trackSorterMock = Mock.ofType<TrackSorter>();
        desktopMock = Mock.ofType<DesktopBase>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        tracksPersisterMock = Mock.ofType<BaseTracksPersister>();
        dateTimeMock = Mock.ofType<DateTime>();
        guidFactoryMock = Mock.ofType<GuidFactory>();
        settingsMock = new SettingsMock();

        playbackStartedMock = new Subject();
        playbackStartedMock$ = playbackStartedMock.asObservable();
        playbackStoppedMock = new Subject();
        playbackStoppedMock$ = playbackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackStartedMock$);
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackStoppedMock$);
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
        tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleDescending);

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);

        metadataService_loveSaved = new Subject();
        const metadataService_loveSaved$: Observable<TrackModel> = metadataService_loveSaved.asObservable();
        metadataServiceMock.setup((x) => x.loveSaved$).returns(() => metadataService_loveSaved$);

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;
        track1.rating = 1;
        track1.love = 0;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;
        track2.rating = 2;
        track2.love = 0;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'Album title 2';
        track3.trackNumber = 1;
        track3.discNumber = 1;
        track3.rating = 3;
        track3.love = 0;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;
        track4.rating = 4;
        track4.love = 0;

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);

        trackSorterMock
            .setup((x) => x.sortByTitleAscending(It.isAny()))
            .returns(() => [trackModel1, trackModel2, trackModel3, trackModel4]);
        trackSorterMock
            .setup((x) => x.sortByTitleDescending(It.isAny()))
            .returns(() => [trackModel4, trackModel3, trackModel2, trackModel1]);
        trackSorterMock.setup((x) => x.sortByAlbum(It.isAny())).returns(() => [trackModel1, trackModel2, trackModel3, trackModel4]);
    });

    function createComponent(): TrackBrowserComponent {
        return new TrackBrowserComponent(
            playbackServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            metadataServiceMock.object,
            playbackIndicationServiceMock.object,
            guidFactoryMock.object,
            trackSorterMock.object,
            collectionServiceMock.object,
            translatorServiceMock.object,
            dialogServiceMock.object,
            desktopMock.object,
            loggerMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.tracks).toBeDefined();
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should declare selectedTrackOrder', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.selectedTrackOrder).toBeUndefined();
        });

        it('should declare tracksPersister', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.tracksPersister).toBeUndefined();
        });

        it('should declare trackContextMenu', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.trackContextMenu).toBeUndefined();
        });

        it('should define trackOrders', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.trackOrders).toEqual([
                TrackOrder.byTrackTitleAscending,
                TrackOrder.byTrackTitleDescending,
                TrackOrder.byAlbum,
            ]);
        });

        it('should define trackOrderKey', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.trackOrderKey).toEqual(trackOrderKey);
        });
    });

    describe('tracks', () => {
        it('should set and get the tracks', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            expect(component.tracks).toBe(tracks);
        });

        it('should initialize mouseSelectionWatcher using tracks', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            // TODO: TypeMoq does not consider the call with track.track to have been performed (The reference to tracks.tracks seems lost).
            // So we use a workaround to ensure that the correct call occurs.
            // mouseSelectionWatcherMock.verify((x) => x.initialize(tracks.tracks, false), Times.exactly(1));
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 4 &&
                                trackModels[0].path === trackModel1.path &&
                                trackModels[1].path === trackModel2.path &&
                                trackModels[2].path === trackModel3.path &&
                                trackModels[3].path === trackModel4.path,
                        ),
                        false,
                    ),
                Times.exactly(1),
            );
        });

        it('should order the tracks by the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[3]).toBe(trackModel1);
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            component.tracks = tracks;

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set the playing track on playback started', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            playbackIndicationServiceMock.reset();

            // Act
            component.ngOnInit();
            playbackStartedMock.next(new PlaybackStarted(trackModel1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });

        it('should clear the playing track on playback stopped', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;

            // Act
            component.ngOnInit();
            playbackStoppedMock.next();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.clearPlayingTrack(component.orderedTracks), Times.exactly(1));
        });

        it('should update the rating for a track that has the same path as the track for which rating was saved', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;

            const track5 = new Track('Path 1');
            track5.rating = 5;

            const trackModel5: TrackModel = new TrackModel(track5, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            // Act
            component.ngOnInit();
            metadataService_ratingSaved.next(trackModel5);

            // Assert
            expect(track1.rating).toEqual(5);
            expect(track2.rating).toEqual(2);
            expect(track3.rating).toEqual(3);
            expect(track4.rating).toEqual(4);
        });

        it('should update the love for a track that has the same path as the track for which love was saved', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;

            const track5 = new Track('Path 1');
            track5.love = 1;

            const trackModel5: TrackModel = new TrackModel(track5, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            // Act
            component.ngOnInit();
            metadataService_loveSaved.next(trackModel5);

            // Assert
            expect(track1.love).toEqual(1);
            expect(track2.love).toEqual(0);
            expect(track3.love).toEqual(0);
            expect(track4.love).toEqual(0);
        });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            const event: any = {};

            // Act
            component.setSelectedTracks(event, trackModel2);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel2), Times.exactly(1));
        });
    });

    describe('applyTrackOrder', () => {
        it('should apply track order by track title ascending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracks = tracks;

            const trackOrder = TrackOrder.byTrackTitleAscending;

            // Act
            component.applyTrackOrder(trackOrder);

            // Assert
            expect(component.selectedTrackOrder).toEqual(trackOrder);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should apply track order by track title descending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            component.tracks = tracks;

            const trackOrder = TrackOrder.byTrackTitleDescending;

            // Act
            component.applyTrackOrder(trackOrder);

            // Assert
            expect(component.selectedTrackOrder).toEqual(trackOrder);
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel1);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should apply track order by album', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracks = tracks;

            const trackOrder = TrackOrder.byAlbum;

            // Act
            component.applyTrackOrder(trackOrder);

            // Assert
            expect(component.selectedTrackOrder).toEqual(trackOrder);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeTruthy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeTruthy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeTruthy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should apply track order by album and override showHeader', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracks = tracks;
            track1.albumKey = 'albumKey1';
            track1.discNumber = 1;
            trackModel1.showHeader = false;
            track2.albumKey = 'albumKey1';
            track2.discNumber = 1;
            trackModel2.showHeader = true;

            track3.albumKey = 'albumKey2';
            track3.discNumber = 1;
            trackModel3.showHeader = false;
            track4.albumKey = 'albumKey2';
            track4.discNumber = 2;
            trackModel4.showHeader = false;

            const trackOrder = TrackOrder.byAlbum;

            // Act
            component.applyTrackOrder(trackOrder);

            // Assert
            expect(component.selectedTrackOrder).toEqual(trackOrder);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeTruthy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeTruthy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeTruthy();
        });

        it('should persist the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byAlbum;

            const trackOrder = TrackOrder.byTrackTitleAscending;

            // Act
            component.applyTrackOrder(trackOrder);

            // Assert
            tracksPersisterMock.verify((x) => x.setSelectedTrackOrder(trackOrder), Times.exactly(1));
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;

            // Act
            component.applyTrackOrder(TrackOrder.byAlbum);

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });

    describe('tracksPersister', () => {
        it('should set and return tracksPersister', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;

            // Act
            const persister: BaseTracksPersister = component.tracksPersister;

            // Assert
            expect(persister).toBe(tracksPersisterMock.object);
        });

        it('should set the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byAlbum);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byAlbum);
        });

        it('should change TrackOrder from byTrackTitleAscending to byTrackTitleDescending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleDescending);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleDescending);
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel1);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byTrackTitleDescending to byAlbum', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byAlbum);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byAlbum);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeTruthy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeTruthy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeTruthy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byAlbum to byTrackTitleAscending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleAscending);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });
});
