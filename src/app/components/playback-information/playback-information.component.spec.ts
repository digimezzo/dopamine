import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { Scheduler } from '../../common/scheduling/scheduler';
import { BasePlaybackInformationService } from '../../services/playback-information/base-playback-information.service';
import { PlaybackInformation } from '../../services/playback-information/playback-information';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackInformationComponent } from './playback-information.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackInformationComponent;
    let playbackInformationServiceMock: IMock<BasePlaybackInformationService>;
    let schedulerMock: IMock<Scheduler>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackInformationService_PlayingNextTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingPreviousTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingNoTrack: Subject<PlaybackInformation>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(async () => {
        playbackInformationServiceMock = Mock.ofType<BasePlaybackInformationService>();
        schedulerMock = Mock.ofType<Scheduler>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        component = new PlaybackInformationComponent(playbackInformationServiceMock.object, schedulerMock.object);

        playbackInformationService_PlayingNextTrack = new Subject();
        const playbackInformationService_PlayingNextTrack$: Observable<PlaybackInformation> =
            playbackInformationService_PlayingNextTrack.asObservable();
        playbackInformationServiceMock.setup((x) => x.playingNextTrack$).returns(() => playbackInformationService_PlayingNextTrack$);

        playbackInformationService_PlayingPreviousTrack = new Subject();
        const playbackInformationService_PlayingPreviousTrack$: Observable<PlaybackInformation> =
            playbackInformationService_PlayingPreviousTrack.asObservable();
        playbackInformationServiceMock
            .setup((x) => x.playingPreviousTrack$)
            .returns(() => playbackInformationService_PlayingPreviousTrack$);

        playbackInformationService_PlayingNoTrack = new Subject();
        const playbackInformationService_PlayingNoTrack$: Observable<PlaybackInformation> =
            playbackInformationService_PlayingNoTrack.asObservable();
        playbackInformationServiceMock.setup((x) => x.playingNoTrack$).returns(() => playbackInformationService_PlayingNoTrack$);
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

        it('should initialize height as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.height).toEqual(0);
        });

        it('should largeFontSize height as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.largeFontSize).toEqual(0);
        });

        it('should smallFontSize height as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.smallFontSize).toEqual(0);
        });
    });

    describe('ngOnInit', () => {
        it('should set top content items and go down without animation if there is a current track playing', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(async () => new PlaybackInformation(trackModel1, 'image-url-mock'));
            component = new PlaybackInformationComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('down');
        });

        it('should subscribe to playbackInformationService.playingNextTrack, set bottom content and animate up when playing a next track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(async () => new PlaybackInformation(trackModel1, 'image-url-mock'));
            component = new PlaybackInformationComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();

            playbackInformationService_PlayingNextTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            await flushPromises();

            // Assert
            expect(component.bottomContentArtist).toEqual('My artist');
            expect(component.bottomContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackInformationService.playingPreviousTrack, set bottom content and animate down when playing a next track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(async () => new PlaybackInformation(trackModel1, 'image-url-mock'));
            component = new PlaybackInformationComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();

            playbackInformationService_PlayingPreviousTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            await flushPromises();

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should subscribe to playbackInformationService.playingNoTrack, set bottom content and animate up when playing no track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(async () => new PlaybackInformation(trackModel1, 'image-url-mock'));
            component = new PlaybackInformationComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.bottomContentArtist = 'My artist';
            component.bottomContentTitle = 'My title';

            playbackInformationService_PlayingNoTrack.next(new PlaybackInformation(undefined, ''));

            await flushPromises();

            // Assert
            expect(component.bottomContentArtist).toEqual('');
            expect(component.bottomContentTitle).toEqual('');
            expect(component.contentAnimation).toEqual('animated-up');
        });
    });
});
