import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Track } from '../../../../common/data/entities/track';
import { DateTime } from '../../../../common/date-time';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BaseDialogService } from '../../../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { BaseTracksColumnsService } from '../../../../services/track-columns/base-tracks-columns.service';
import { TracksColumnsOrder } from '../../../../services/track-columns/tracks-columns-order';
import { TracksColumnsOrderColumn } from '../../../../services/track-columns/tracks-columns-order-column';
import { TracksColumnsOrderDirection } from '../../../../services/track-columns/tracks-columns-order-direction';
import { TracksColumnsOrdering } from '../../../../services/track-columns/tracks-columns-ordering';
import { TracksColumnsVisibility } from '../../../../services/track-columns/tracks-columns-visibility';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { CollectionTracksTableComponent } from './collection-tracks-table.component';

describe('CollectionTracksTableComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let tracksColumnsServiceMock: IMock<BaseTracksColumnsService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let tracksColumnsOrderingMock: IMock<TracksColumnsOrdering>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

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
            metadataServiceMock.object,
            playbackIndicationServiceMock.object,
            tracksColumnsServiceMock.object,
            dialogServiceMock.object,
            tracksColumnsOrderingMock.object
        );

        return component;
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        tracksColumnsServiceMock = Mock.ofType<BaseTracksColumnsService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        tracksColumnsOrderingMock = Mock.ofType<TracksColumnsOrdering>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

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

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object);
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

        it('should define tracksColumnsVisibility', async () => {
            // Arrange

            // Act
            const component: CollectionTracksTableComponent = createComponent();

            // Assert
            expect(component.tracksColumnsVisibility).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should get tracksColumnsVisibility', async () => {
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
