import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BasePlaybackIndicationService } from '../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { TrackModels } from '../../services/track/track-models';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackQueueComponent } from './playback-queue.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackQueueComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let playbackQueue: TrackModels;
    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        playbackQueue = new TrackModels();
        playbackQueue.addTrack(new TrackModel(new Track('DummyPath'), translatorServiceMock.object));

        playbackServiceMock.setup((x) => x.playbackQueue).returns(() => playbackQueue);

        component = new PlaybackQueueComponent(playbackServiceMock.object, playbackIndicationServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should set the playing track when playback starts', () => {
            // Arrange
            const trackModel: TrackModel = new TrackModel(new Track('DummyPath'), translatorServiceMock.object);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel, false);

            // Act
            component.ngOnInit();
            playbackServicePlaybackStarted.next(playbackStarted);

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(playbackQueue.tracks, trackModel), Times.exactly(1));
        });
    });
});
