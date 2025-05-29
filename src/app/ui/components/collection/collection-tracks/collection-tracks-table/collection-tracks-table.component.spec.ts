import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { CollectionTracksTableComponent } from './collection-tracks-table.component';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { TracksColumnsOrdering } from '../../../../../services/track-columns/tracks-columns-ordering';
import { DateTime } from '../../../../../common/date-time';
import { Logger } from '../../../../../common/logger';
import { PlaybackStarted } from '../../../../../services/playback/playback-started';
import { TrackModel } from '../../../../../services/track/track-model';
import { TracksColumnsVisibility } from '../../../../../services/track-columns/tracks-columns-visibility';
import { TracksColumnsOrder } from '../../../../../services/track-columns/tracks-columns-order';
import { Track } from '../../../../../data/entities/track';
import { TrackModels } from '../../../../../services/track/track-models';
import { TracksColumnsOrderColumn } from '../../../../../services/track-columns/tracks-columns-order-column';
import { TracksColumnsOrderDirection } from '../../../../../services/track-columns/tracks-columns-order-direction';
import { PlaybackIndicationServiceBase } from '../../../../../services/playback-indication/playback-indication.service.base';
import { TracksColumnsServiceBase } from '../../../../../services/track-columns/tracks-columns.service.base';
import { DesktopBase } from '../../../../../common/io/desktop.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { DialogServiceBase } from '../../../../../services/dialog/dialog.service.base';
import { CollectionServiceBase } from '../../../../../services/collection/collection.service.base';
import { SettingsMock } from '../../../../../testing/settings-mock';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { MetadataService } from '../../../../../services/metadata/metadata.service';

describe('CollectionTracksTableComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let metadataServiceMock: IMock<MetadataService>;
    let playbackIndicationServiceMock: IMock<PlaybackIndicationServiceBase>;
    let tracksColumnsServiceMock: IMock<TracksColumnsServiceBase>;
    let tracksColumnsOrderingMock: IMock<TracksColumnsOrdering>;
    let dateTimeMock: IMock<DateTime>;

    let collectionServiceMock: IMock<CollectionServiceBase>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let desktopMock: IMock<DesktopBase>;
    let loggerMock: IMock<Logger>;
    let settingsMock: any;

    let playbackStartedMock: Subject<PlaybackStarted>;
    let playbackStartedMock$: Observable<PlaybackStarted>;

    let playbackStoppedMock: Subject<void>;
    let playbackStoppedMock$: Observable<void>;

    let metadataService_ratingSaved: Subject<TrackModel>;
    let tracksColumnsService_tracksColumnsVisibilityChanged: Subject<TracksColumnsVisibility>;
    let tracksColumnsService_tracksColumnsOrderChanged: Subject<TracksColumnsOrder>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let tracks: TrackModels;

    function createComponent(): CollectionTracksTableComponent {
        const component: CollectionTracksTableComponent = new CollectionTracksTableComponent(
            playbackServiceMock.object,
            mouseSelectionWatcherMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            metadataServiceMock.object,
            playbackIndicationServiceMock.object,
            tracksColumnsServiceMock.object,
            tracksColumnsOrderingMock.object,
            collectionServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            desktopMock.object,
            loggerMock.object,
        );

        return component;
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        playbackIndicationServiceMock = Mock.ofType<PlaybackIndicationServiceBase>();
        tracksColumnsServiceMock = Mock.ofType<TracksColumnsServiceBase>();
        tracksColumnsOrderingMock = Mock.ofType<TracksColumnsOrdering>();
        dateTimeMock = Mock.ofType<DateTime>();

        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = new SettingsMock();

        playbackStartedMock = new Subject();
        playbackStartedMock$ = playbackStartedMock.asObservable();
        playbackStoppedMock = new Subject();
        playbackStoppedMock$ = playbackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackStartedMock$);
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackStoppedMock$);
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);

        tracksColumnsService_tracksColumnsVisibilityChanged = new Subject();
        const tracksColumnsService_tracksColumnsVisibilityChanged$: Observable<TracksColumnsVisibility> =
            tracksColumnsService_tracksColumnsVisibilityChanged.asObservable();
        tracksColumnsServiceMock
            .setup((x) => x.tracksColumnsVisibilityChanged$)
            .returns(() => tracksColumnsService_tracksColumnsVisibilityChanged$);

        tracksColumnsService_tracksColumnsOrderChanged = new Subject();
        const tracksColumnsService_tracksColumnsOrderChanged$: Observable<TracksColumnsOrder> =
            tracksColumnsService_tracksColumnsOrderChanged.asObservable();
        tracksColumnsServiceMock.setup((x) => x.tracksColumnsOrderChanged$).returns(() => tracksColumnsService_tracksColumnsOrderChanged$);

        const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();
        tracksColumnsVisibility.showAlbum = true;
        tracksColumnsServiceMock.setup((x) => x.getTracksColumnsVisibility()).returns(() => tracksColumnsVisibility);
        tracksColumnsServiceMock
            .setup((x) => x.getTracksColumnsOrder())
            .returns(() => new TracksColumnsOrder(TracksColumnsOrderColumn.trackTitle, TracksColumnsOrderDirection.ascending));

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;
        track1.rating = 1;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;
        track2.rating = 2;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'Album title 2';
        track3.trackNumber = 1;
        track3.discNumber = 1;
        track3.rating = 3;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;
        track4.rating = 4;

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionTracksTableComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define tracksColumnsVisibility', () => {
            // Arrange

            // Act
            const component: CollectionTracksTableComponent = createComponent();

            // Assert
            expect(component.tracksColumnsVisibility).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should get tracksColumnsVisibility', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();

            // Act
            const tracksColumnsVisibilityBeforeInit: TracksColumnsVisibility = component.tracksColumnsVisibility;
            component.ngOnInit();
            const tracksColumnsVisibilityAfterInit: TracksColumnsVisibility = component.tracksColumnsVisibility;

            // Assert
            expect(tracksColumnsVisibilityBeforeInit.showAlbum).toBeFalsy();
            expect(tracksColumnsVisibilityAfterInit.showAlbum).toBeTruthy();
        });

        it('should set the playing track on playback started', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            playbackIndicationServiceMock.reset();

            // Act
            component.ngOnInit();
            playbackStartedMock.next(new PlaybackStarted(trackModel1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });

        it('should clear the playing track on playback stopped', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();

            // Act
            component.ngOnInit();
            playbackStoppedMock.next();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.clearPlayingTrack(component.orderedTracks), Times.exactly(1));
        });

        // TODO: restore this test
        // it('should update the rating for a track that has the same path as the track for which rating was saved', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.tracks = tracks;

        //     const track5 = new Track('Path 1');
        //     track5.rating = 5;

        //     const trackModel5: TrackModel = new TrackModel(track5, translatorServiceMock.object);

        //     // Act
        //     component.ngOnInit();
        //     metadataService_ratingSaved.next(trackModel5);

        //     // Assert
        //     expect(track1.rating).toEqual(5);
        //     expect(track2.rating).toEqual(2);
        //     expect(track3.rating).toEqual(3);
        //     expect(track4.rating).toEqual(4);
        // });

        it('should update tracksColumnsVisibility when tracks columns visibility has changed', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            component.ngOnInit();
            tracksColumnsService_tracksColumnsVisibilityChanged.next(tracksColumnsVisibility);

            // Assert
            expect(component.tracksColumnsVisibility).toBe(tracksColumnsVisibility);
        });
    });

    describe('tracks', () => {
        // TODO: restore this test
        // it('should set and get the tracks', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.ngOnInit();
        //     // Act
        //     component.tracks = tracks;
        //     // Assert
        //     expect(component.tracks).toBe(tracks);
        // });
        // it('should initialize mouseSelectionWatcher using tracks', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.ngOnInit();
        //     // Act
        //     component.tracks = tracks;
        //     // Assert
        //     // TODO: TypeMoq does not consider the call with track.track to have been performed (The reference to tracks.tracks seems lost).
        //     // So we use a workaround to ensure that the correct call occurs.
        //     // mouseSelectionWatcherMock.verify((x) => x.initialize(tracks.tracks, false), Times.exactly(1));
        //     mouseSelectionWatcherMock.verify(
        //         (x) =>
        //             x.initialize(
        //                 It.is(
        //                     (trackModels: TrackModel[]) =>
        //                         trackModels.length === 4 &&
        //                         trackModels[0].path === trackModel1.path &&
        //                         trackModels[1].path === trackModel2.path &&
        //                         trackModels[2].path === trackModel3.path &&
        //                         trackModels[3].path === trackModel4.path
        //                 ),
        //                 false
        //             ),
        //         Times.exactly(1)
        //     );
        // });
        // it('should set the playing track', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.ngOnInit();
        //     playbackIndicationServiceMock.reset();
        //     // Act
        //     component.tracks = tracks;
        //     // Assert
        //     playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        // });
        // it('should order the tracks', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.ngOnInit();
        //     // Act
        //     component.tracks = tracks;
        //     // Assert
        //     expect(component.orderedTracks[0]).toBe(trackModel4);
        //     expect(component.orderedTracks[1]).toBe(trackModel3);
        //     expect(component.orderedTracks[2]).toBe(trackModel2);
        //     expect(component.orderedTracks[3]).toBe(trackModel1);
        // });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            const event: any = {};

            // Act
            component.setSelectedTracks(event, trackModel2);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel2), Times.once());
        });
    });

    describe('showEditColumnsDialogAsync', () => {
        it('should show the edit columns dialog', async () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();

            // Act
            await component.showEditColumnsDialogAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showEditColumnsDialogAsync(), Times.once());
        });
    });

    describe('Missing tests', () => {
        test.todo('should write tests');
    });
});
