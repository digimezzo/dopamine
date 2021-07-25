import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { Scheduler } from '../../common/scheduler/scheduler';
import { FormatTrackArtistsPipe } from '../../pipes/format-track-artists.pipe';
import { FormatTrackTitlePipe } from '../../pipes/format-track-title.pipe';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackInformationComponent } from './playback-information.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackInformationComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let formatTrackArtistsPipeMock: IMock<FormatTrackArtistsPipe>;
    let formatTrackTitlePipeMock: IMock<FormatTrackTitlePipe>;
    let schedulerMock: IMock<Scheduler>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;

    const flushPromises = () => new Promise(setImmediate);

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        formatTrackArtistsPipeMock = Mock.ofType<FormatTrackArtistsPipe>();
        formatTrackTitlePipeMock = Mock.ofType<FormatTrackTitlePipe>();
        schedulerMock = Mock.ofType<Scheduler>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        component = new PlaybackInformationComponent(
            playbackServiceMock.object,
            formatTrackArtistsPipeMock.object,
            formatTrackTitlePipeMock.object,
            schedulerMock.object
        );

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);

        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStoppedMock$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStoppedMock$);
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

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('down');
        });

        it('should set bottom content items and animate up when playing a next track on playbackStarted', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel1, false));

            await flushPromises();

            // Assert
            expect(component.bottomContentArtist).toEqual('My artist');
            expect(component.bottomContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should set top content items and animate down when playing a previous track on playbackStarted', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel1, true));

            await flushPromises();

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should set bottom content items and animate up when playing a next track on playbackStopped', async () => {
            // Arrange

            // Act
            await component.ngOnInit();
            component.bottomContentArtist = 'My artist';
            component.bottomContentTitle = 'My title';

            playbackServicePlaybackStoppedMock.next();

            await flushPromises();

            // Assert
            expect(component.bottomContentArtist).toEqual('');
            expect(component.bottomContentTitle).toEqual('');
            expect(component.contentAnimation).toEqual('animated-up');
        });
    });
});
