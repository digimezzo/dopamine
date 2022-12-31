import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../common/context-menu-opener';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { MouseSelectionWatcher } from '../../common/mouse-selection-watcher';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackIndicationService } from '../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { TrackModels } from '../../services/track/track-models';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackQueueComponent } from './playback-queue.component';

describe('PlaybackQueueComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let playbackQueue: TrackModels;
    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;
    let navigationServiceShowPlaybackQueueRequested: Subject<void>;

    function createComponent(): PlaybackQueueComponent {
        return new PlaybackQueueComponent(
            playbackServiceMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            playbackIndicationServiceMock.object,
            navigationServiceMock.object
        );
    }

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        playbackQueue = new TrackModels();
        playbackQueue.addTrack(new TrackModel(new Track('DummyPath'), dateTimeMock.object, translatorServiceMock.object));

        playbackServiceMock.setup((x) => x.playbackQueue).returns(() => playbackQueue);

        navigationServiceShowPlaybackQueueRequested = new Subject();
        const navigationServiceShowPlaybackQueueRequested$: Observable<void> = navigationServiceShowPlaybackQueueRequested.asObservable();
        navigationServiceMock.setup((x) => x.showPlaybackQueueRequested$).returns(() => navigationServiceShowPlaybackQueueRequested$);
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
    });

    describe('ngOnInit', () => {
        it('should set the playing track when playback starts', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(new Track('DummyPath'), dateTimeMock.object, translatorServiceMock.object);
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
            navigationServiceShowPlaybackQueueRequested.next();

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.initialize(playbackQueue.tracks), Times.once());
        });
    });

    describe('onTrackContextMenu', () => {
        it('should open the track context menu', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(new Track('DummyPath'), dateTimeMock.object, translatorServiceMock.object);
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
            const trackModel: TrackModel = new TrackModel(new Track('Path 1'), dateTimeMock.object, translatorServiceMock.object);

            // Act
            component.setSelectedTracks(event, trackModel);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel), Times.once());
        });
    });

    describe('onRemoveFromQueue', () => {
        it('should remove selected tracks from the queue', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(new Track('Path 1'), dateTimeMock.object, translatorServiceMock.object);
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel]);
            const component: PlaybackQueueComponent = createComponent();

            // Act
            component.onRemoveFromQueue();

            // Assert
            playbackServiceMock.verify((x) => x.removeFromQueue([trackModel]), Times.once());
        });
    });
});
