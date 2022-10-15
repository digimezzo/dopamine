import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Constants } from '../../../common/application/constants';
import { Track } from '../../../common/data/entities/track';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseSearchService } from '../../../services/search/base-search.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { CollectionPersister } from '../collection-persister';
import { CollectionTracksComponent } from './collection-tracks.component';

describe('CollectionTracksComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let searchServiceMock: IMock<BaseSearchService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let trackServiceMock: IMock<BaseTrackService>;
    let collectionPersisterMock: IMock<CollectionPersister>;
    let schedulerMock: IMock<Scheduler>;
    let loggerMock: IMock<Logger>;

    let translatorServiceMock: IMock<BaseTranslatorService>;

    let selectedTabChangedMock: Subject<void>;
    let selectedTabChangedMock$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): CollectionTracksComponent {
        const component: CollectionTracksComponent = new CollectionTracksComponent(
            playbackServiceMock.object,
            searchServiceMock.object,
            mouseSelectionWatcherMock.object,
            trackServiceMock.object,
            collectionPersisterMock.object,
            schedulerMock.object,
            loggerMock.object
        );

        return component;
    }

    function createTrackModel(path: string): TrackModel {
        const track: Track = new Track(path);
        const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);

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
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();
        schedulerMock = Mock.ofType<Scheduler>();
        loggerMock = Mock.ofType<Logger>();

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        selectedTabChangedMock = new Subject();
        selectedTabChangedMock$ = selectedTabChangedMock.asObservable();
        collectionPersisterMock.setup((x) => x.selectedTabChanged$).returns(() => selectedTabChangedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define searchService', () => {
            // Arrange

            // Act
            const component: CollectionTracksComponent = createComponent();

            // Assert
            expect(component.searchService).toBeDefined();
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear the tracks', () => {
            // Arrange
            const component: CollectionTracksComponent = createComponent();
            const track: TrackModel = createTrackModel('path1');
            const trackModels: TrackModels = createTrackModels([track]);
            component.tracks = trackModels;

            // Act
            component.ngOnDestroy();

            // Assert
            expect(component.tracks.tracks.length).toEqual(0);
        });
    });

    describe('ngOnInit', () => {
        it('should get all tracks if the selected tab is tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.tracksTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not get all tracks if the selected tab is not tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should get all tracks if the selected tab has changed to tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.tracksTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.once());
            expect(component.tracks.tracks.length).toEqual(2);
            expect(component.tracks.tracks[0]).toEqual(track1);
            expect(component.tracks.tracks[1]).toEqual(track2);
        });

        it('should not get all tracks if the selected tab has changed to not tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const trackModels: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => trackModels);

            const component: CollectionTracksComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.albumsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            trackServiceMock.verify((x) => x.getAllTracks(), Times.never());
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should initialize mouseSelectionWatcher using tracks if the selected tab is tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.tracksTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const tracks: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            const component: CollectionTracksComponent = createComponent();

            // Act
            await component.ngOnInit();
            await flushPromises();

            // Assert
            // TODO: TypeMoq does not consider the call with track.track to have been performed (The reference to tracks.tracks seems lost).
            // So we use a workaround to ensure that the correct call occurs.
            // mouseSelectionWatcherMock.verify((x) => x.initialize(tracks.tracks, false), Times.exactly(1));
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 && trackModels[0].path === track1.path && trackModels[1].path === track2.path
                        ),
                        false
                    ),
                Times.once()
            );
        });

        it('should not initialize mouseSelectionWatcher using tracks if the selected tab is not tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const tracks: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            const component: CollectionTracksComponent = createComponent();

            // Act
            await component.ngOnInit();
            await flushPromises();

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(It.isAny(), false), Times.never());
        });

        it('should initialize mouseSelectionWatcher using tracks if the selected tab has changed to tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const tracks: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            const component: CollectionTracksComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.tracksTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            // TODO: TypeMoq does not consider the call with track.track to have been performed (The reference to tracks.tracks seems lost).
            // So we use a workaround to ensure that the correct call occurs.
            // mouseSelectionWatcherMock.verify((x) => x.initialize(tracks.tracks, false), Times.exactly(1));
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 && trackModels[0].path === track1.path && trackModels[1].path === track2.path
                        ),
                        false
                    ),
                Times.once()
            );
        });

        it('should not initialize mouseSelectionWatcher using tracks if the selected tab has changed to not tracks', async () => {
            // Arrange
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.artistsTabLabel);

            const track1: TrackModel = createTrackModel('path1');
            const track2: TrackModel = createTrackModel('path2');
            const tracks: TrackModels = createTrackModels([track1, track2]);
            trackServiceMock.setup((x) => x.getAllTracks()).returns(() => tracks);

            const component: CollectionTracksComponent = createComponent();
            await component.ngOnInit();

            collectionPersisterMock.reset();
            collectionPersisterMock.setup((x) => x.selectedTab).returns(() => Constants.albumsTabLabel);

            // Act
            selectedTabChangedMock.next();
            await flushPromises();

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(It.isAny(), false), Times.never());
        });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: CollectionTracksComponent = createComponent();
            const event: any = {};
            const trackModel: TrackModel = new TrackModel(new Track('Path 1'), translatorServiceMock.object);

            // Act
            component.setSelectedTracks(event, trackModel);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel), Times.once());
        });
    });
});
