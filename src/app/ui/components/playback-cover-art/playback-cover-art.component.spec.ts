import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { PlaybackCoverArtComponent } from './playback-cover-art.component';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { DateTime } from '../../../common/date-time';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { TrackModel } from '../../../services/track/track-model';
import { Track } from '../../../data/entities/track';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { Constants } from '../../../common/application/constants';
import { SettingsMock } from '../../../testing/settings-mock';
import { PlaybackInformationService } from '../../../services/playback-information/playback-information.service';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackCoverArtComponent;
    let playbackInformationServiceMock: IMock<PlaybackInformationService>;
    let schedulerMock: IMock<Scheduler>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    let playbackInformationService_PlayingNextTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingPreviousTrack: Subject<PlaybackInformation>;
    let playbackInformationService_PlayingNoTrack: Subject<PlaybackInformation>;

    const track1: Track = new Track('/home/user/Music/track1.mp3');
    track1.artists = 'My artist';
    track1.trackTitle = 'My title';

    let trackModel1: TrackModel;

    beforeEach(() => {
        playbackInformationServiceMock = Mock.ofType<PlaybackInformationService>();
        schedulerMock = Mock.ofType<Scheduler>();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);

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

        component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);
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

        it('should initialize topImageUrl as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topImageUrl).toEqual('');
        });

        it('should initialize bottomImageUrl as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomImageUrl).toEqual('');
        });

        it('should initialize size as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.size).toEqual(0);
        });
    });

    describe('ngOnInit', () => {
        it('should set top image URL and go down without animation if there is a current track playing', async () => {
            // Arrange
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('down');
        });

        it('should subscribe to playbackInformationService.playingNextTrack, set bottom image URL and animate up when playing a next track', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.bottomImageUrl = '';
            playbackInformationService_PlayingNextTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            while (component.bottomImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackInformationService.playingPreviousTrack, set top image URL and animate down when playing a previous track', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.topImageUrl = '';
            playbackInformationService_PlayingPreviousTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

            while (component.topImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should subscribe to playbackInformationService.playingNoTrack, set bottom image URL and animate up when playing no track', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.bottomImageUrl = 'image-url-mock';
            playbackInformationService_PlayingNoTrack.next(new PlaybackInformation(undefined, ''));

            while (component.bottomImageUrl === 'image-url-mock') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomImageUrl).toEqual('');
            expect(component.contentAnimation).toEqual('animated-up');
        });
    });

    describe('topImageBackgroundClass', () => {
        it('should return "app-playback-cover-art__content-background" when topImageUrl is not empty', async () => {
            // Arrange
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);
            await component.ngOnInit();
            component.topImageUrl = 'image url';

            // Act, Assert
            expect(component.topImageBackgroundClass).toEqual('app-playback-cover-art__content-background');
        });

        it('should return empty string when topImageUrl is empty', async () => {
            // Arrange
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);
            await component.ngOnInit();
            component.topImageUrl = Constants.emptyImage;

            // Act, Assert
            expect(component.topImageBackgroundClass).toEqual('');
        });
    });

    describe('bottomImageBackgroundClass', () => {
        it('should return "app-playback-cover-art__content-background" when topImageUrl is not empty', async () => {
            // Arrange
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);
            await component.ngOnInit();
            component.bottomImageUrl = 'image url';

            // Act, Assert
            expect(component.bottomImageBackgroundClass).toEqual('app-playback-cover-art__content-background');
        });

        it('should return empty string when topImageUrl is empty', async () => {
            // Arrange
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            component = new PlaybackCoverArtComponent(playbackInformationServiceMock.object, schedulerMock.object);
            await component.ngOnInit();
            component.bottomImageUrl = Constants.emptyImage;

            // Act, Assert
            expect(component.bottomImageBackgroundClass).toEqual('');
        });
    });
});
