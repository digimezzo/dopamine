import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock } from 'typemoq';
import { Scheduler } from '../../core/scheduler/scheduler';
import { Track } from '../../data/entities/track';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackInformationComponent } from './playback-information.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackInformationComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let schedulerMock: IMock<Scheduler>;

    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        schedulerMock = Mock.ofType<Scheduler>();

        translatorServiceMock.setup((x) => x.get(It.isAny())).returns(() => '');

        component = new PlaybackInformationComponent(playbackServiceMock.object, translatorServiceMock.object, schedulerMock.object);

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();

        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        await component.ngOnInit();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize contentAnimation as "down"', () => {
            // Arrange

            // Act

            // Assert
            expect(component.contentAnimation).toEqual('down');
        });

        it('should initialize topContentArtist as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topContentArtist).toEqual('');
        });

        it('should initialize topContentTitle as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topContentTitle).toEqual('');
        });

        it('should initialize bottomContentArtist as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomContentArtist).toEqual('');
        });

        it('should initialize bottomContentTitle as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomContentTitle).toEqual('');
        });
    });

    describe('ngOnInit', () => {
        it('should subscribe to playbackService.playbackStarted, set bottom content items and animate up when playing a next track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1);
            const scheduler: Scheduler = new Scheduler();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, false));

            while (component.bottomContentArtist === '' || component.bottomContentTitle === '' || component.contentAnimation === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomContentArtist).toEqual('My artist');
            expect(component.bottomContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackService.playbackStarted, set top content items and animate down when playing a previous track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1);
            const scheduler: Scheduler = new Scheduler();

            // Act
            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, true));

            while (component.topContentArtist === '' || component.topContentTitle === '' || component.contentAnimation === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-down');
        });
    });
});
