import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { PlaybackQueueComponent } from './playback-queue.component';
import { PlaybackService } from '../../../services/playback/playback.service';
import { ContextMenuOpener } from '../context-menu-opener';
import { MouseSelectionWatcher } from '../mouse-selection-watcher';
import { PlaybackIndicationServiceBase } from '../../../services/playback-indication/playback-indication.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { DateTime } from '../../../common/date-time';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { TrackModels } from '../../../services/track/track-models';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { Track } from '../../../data/entities/track';
import { SettingsMock } from '../../../testing/settings-mock';

describe('PlaybackQueueComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let playbackIndicationServiceMock: IMock<PlaybackIndicationServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let playbackQueue: TrackModels;
    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;
    let navigationServiceShowPlaybackQueueRequested: Subject<void>;
    let refreshPlaybackQueueListRequested: Subject<void>;
    let settingsMock: any;

    function createComponent(): PlaybackQueueComponent {
        return new PlaybackQueueComponent(
            playbackServiceMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            playbackIndicationServiceMock.object,
            navigationServiceMock.object,
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        playbackIndicationServiceMock = Mock.ofType<PlaybackIndicationServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        playbackQueue = new TrackModels();
        playbackQueue.addTrack(new TrackModel(new Track('DummyPath'), dateTimeMock.object, translatorServiceMock.object, settingsMock));

        playbackServiceMock.setup((x) => x.playbackQueue).returns(() => playbackQueue);

        navigationServiceShowPlaybackQueueRequested = new Subject();
        const navigationServiceShowPlaybackQueueRequested$: Observable<void> = navigationServiceShowPlaybackQueueRequested.asObservable();
        navigationServiceMock.setup((x) => x.showPlaybackQueueRequested$).returns(() => navigationServiceShowPlaybackQueueRequested$);

        refreshPlaybackQueueListRequested = new Subject();
        const refreshPlaybackQueueListRequested$: Observable<void> = refreshPlaybackQueueListRequested.asObservable();
        navigationServiceMock.setup((x) => x.refreshPlaybackQueueListRequested$).returns(() => refreshPlaybackQueueListRequested$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component.contextMenuOpener).toBeDefined();
        });

        it('should declare trackContextMenu', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component.trackContextMenu).toBeUndefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component.mouseSelectionWatcher).toBeDefined();
        });

        it('should initialize shouldShowList as false', () => {
            // Arrange

            // Act
            const component: PlaybackQueueComponent = createComponent();

            // Assert
            expect(component.shouldShowList).toBeFalsy();
        });
    });

    describe('ngOnInit', () => {
        it('should set the playing track when playback starts', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(
                new Track('DummyPath'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel, false);
            const component: PlaybackQueueComponent = createComponent();

            // Act
            component.ngOnInit();
            playbackServicePlaybackStarted.next(playbackStarted);

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(playbackQueue.tracks, trackModel), Times.once());
        });

        it('should initialize mouseSelectionWatcher using the tracks in the queue when the playback queue is shown', () => {
            // Arrange
            const component: PlaybackQueueComponent = createComponent();

            // Act
            component.ngOnInit();
            refreshPlaybackQueueListRequested.next();

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(playbackQueue.tracks), Times.once());
        });

        it('should set shouldShowList to true the playback queue is shown', () => {
            // Arrange
            const component: PlaybackQueueComponent = createComponent();

            // Act
            component.ngOnInit();
            const shouldShowListBefore: boolean = component.shouldShowList;
            jest.useFakeTimers();
            refreshPlaybackQueueListRequested.next();
            jest.runAllTimers();
            const shouldShowListAfter: boolean = component.shouldShowList;

            // Assert
            expect(shouldShowListBefore).toBeFalsy();
            expect(shouldShowListAfter).toBeTruthy();
        });
    });

    describe('onTrackContextMenu', () => {
        it('should open the track context menu', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(
                new Track('DummyPath'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );
            const component: PlaybackQueueComponent = createComponent();
            const event: any = {};

            // Act
            component.onTrackContextMenu(event, trackModel);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(component.trackContextMenu, event, trackModel), Times.once());
        });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: PlaybackQueueComponent = createComponent();
            const event: any = {};
            const trackModel: TrackModel = new TrackModel(
                new Track('Path 1'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );

            // Act
            component.setSelectedTracks(event, trackModel);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel), Times.once());
        });
    });

    describe('onRemoveFromQueue', () => {
        it('should remove selected tracks from the queue', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(
                new Track('Path 1'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel]);
            const component: PlaybackQueueComponent = createComponent();

            // Act
            component.onRemoveFromQueue();

            // Assert
            playbackServiceMock.verify((x) => x.removeFromQueue([trackModel]), Times.once());
        });
    });
});
