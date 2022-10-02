import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { Scheduler } from '../../common/scheduling/scheduler';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BasePlaybackInformationService } from '../../services/playback-information/base-playback-information.service';
import { PlaybackInformation } from '../../services/playback-information/playback-information';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackInformationComponent } from './playback-information.component';

describe('PlaybackInformationComponent', () => {
    let playbackInformationServiceMock: IMock<BasePlaybackInformationService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let settingsMock: IMock<BaseSettings>;
    let schedulerMock: IMock<Scheduler>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackInformationService_PlayingNextTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingPreviousTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingNoTrack: Subject<PlaybackInformation>;

    let metadataService_ratingSaved: Subject<TrackModel>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): PlaybackInformationComponent {
        return new PlaybackInformationComponent(
            playbackInformationServiceMock.object,
            metadataServiceMock.object,
            settingsMock.object,
            schedulerMock.object
        );
    }

    beforeEach(async () => {
        playbackInformationServiceMock = Mock.ofType<BasePlaybackInformationService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        settingsMock = Mock.ofType<BaseSettings>();
        schedulerMock = Mock.ofType<Scheduler>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        const component: PlaybackInformationComponent = createComponent();

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

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize contentAnimation as "down"', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.contentAnimation).toEqual('down');
        });

        it('should initialize topContentTrack as undefined', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.topContentTrack).toBeUndefined();
        });

        it('should initialize bottomContentTrack as undefined', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.bottomContentTrack).toBeUndefined();
        });

        it('should initialize height as 0', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.height).toEqual(0);
        });

        it('should largeFontSize height as 0', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.largeFontSize).toEqual(0);
        });

        it('should smallFontSize height as 0', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

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
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topContentTrack).toBe(trackModel1);
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
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();

            playbackInformationService_PlayingNextTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            await flushPromises();

            // Assert
            expect(component.bottomContentTrack).toEqual(trackModel1);
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
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();

            playbackInformationService_PlayingPreviousTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            await flushPromises();

            // Assert
            expect(component.topContentTrack).toEqual(trackModel1);
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
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            component.bottomContentTrack = trackModel1;

            playbackInformationService_PlayingNoTrack.next(new PlaybackInformation(undefined, ''));

            await flushPromises();

            // Assert
            expect(component.bottomContentTrack).toBeUndefined();
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should update the rating of the current track if rating is saved', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            track1.rating = 2;
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            const track2: Track = new Track('/home/user/Music/track2.mp3');
            track2.artists = 'My artist 2';
            track2.trackTitle = 'My title 2';
            track2.rating = 4;
            const trackModel2: TrackModel = new TrackModel(track2, translatorServiceMock.object);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(async () => new PlaybackInformation(trackModel1, 'image-url-mock'));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            metadataService_ratingSaved.next(trackModel2);

            // Assert
            expect(component.topContentTrack.rating).toEqual(4);
        });
    });
});
