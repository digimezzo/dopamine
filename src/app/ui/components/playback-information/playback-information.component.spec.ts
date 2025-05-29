import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { PlaybackInformationComponent } from './playback-information.component';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { DateTime } from '../../../common/date-time';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { TrackModel } from '../../../services/track/track-model';
import { Track } from '../../../data/entities/track';
import { SettingsMock } from '../../../testing/settings-mock';
import { PlaybackInformationService } from '../../../services/playback-information/playback-information.service';
import { MetadataService } from '../../../services/metadata/metadata.service';
import { IndexingService } from '../../../services/indexing/indexing.service';

describe('PlaybackInformationComponent', () => {
    let playbackInformationServiceMock: IMock<PlaybackInformationService>;
    let metadataServiceMock: IMock<MetadataService>;
    let indexingServiceMock: IMock<IndexingService>;
    let schedulerMock: IMock<Scheduler>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    let playbackInformationService_playingNextTrack: Subject<PlaybackInformation>;
    let playbackInformationService_playingPreviousTrack: Subject<PlaybackInformation>;
    let playbackInformationService_playingNoTrack: Subject<PlaybackInformation>;
    let indexingService_indexingFinished: Subject<void>;

    let metadataService_ratingSaved: Subject<TrackModel>;
    let metadataService_loveSaved: Subject<TrackModel>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): PlaybackInformationComponent {
        return new PlaybackInformationComponent(
            playbackInformationServiceMock.object,
            indexingServiceMock.object,
            metadataServiceMock.object,
            schedulerMock.object,
        );
    }

    function createTrackModel(path: string, artists: string, title: string, rating: number, love: number): TrackModel {
        const track: Track = new Track(path);
        track.artists = artists;
        track.trackTitle = title;
        track.rating = rating;
        track.love = love;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    beforeEach(() => {
        playbackInformationServiceMock = Mock.ofType<PlaybackInformationService>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        schedulerMock = Mock.ofType<Scheduler>();
        settingsMock = new SettingsMock();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        createComponent();

        playbackInformationService_playingNextTrack = new Subject();
        const playbackInformationService_PlayingNextTrack$: Observable<PlaybackInformation> =
            playbackInformationService_playingNextTrack.asObservable();
        playbackInformationServiceMock.setup((x) => x.playingNextTrack$).returns(() => playbackInformationService_PlayingNextTrack$);

        playbackInformationService_playingPreviousTrack = new Subject();
        const playbackInformationService_PlayingPreviousTrack$: Observable<PlaybackInformation> =
            playbackInformationService_playingPreviousTrack.asObservable();
        playbackInformationServiceMock
            .setup((x) => x.playingPreviousTrack$)
            .returns(() => playbackInformationService_PlayingPreviousTrack$);

        playbackInformationService_playingNoTrack = new Subject();
        const playbackInformationService_PlayingNoTrack$: Observable<PlaybackInformation> =
            playbackInformationService_playingNoTrack.asObservable();
        playbackInformationServiceMock.setup((x) => x.playingNoTrack$).returns(() => playbackInformationService_PlayingNoTrack$);

        indexingService_indexingFinished = new Subject();
        const indexingService_indexingFinished$: Observable<void> = indexingService_indexingFinished.asObservable();
        indexingServiceMock.setup((x) => x.indexingFinished$).returns(() => indexingService_indexingFinished$);

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);

        metadataService_loveSaved = new Subject();
        const metadataService_loveSaved$: Observable<TrackModel> = metadataService_loveSaved.asObservable();
        metadataServiceMock.setup((x) => x.loveSaved$).returns(() => metadataService_loveSaved$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize position as bottom', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.position).toEqual('bottom');
        });

        it('should initialize showRating as false', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.showRating).toBeFalsy();
        });

        it('should initialize showLove as false', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.showLove).toBeFalsy();
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

        it('should initialize largeFontSize height as 0', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.largeFontSize).toEqual(0);
        });

        it('should initialize smallFontSize height as 0', () => {
            // Arrange

            // Act
            const component: PlaybackInformationComponent = createComponent();

            // Assert
            expect(component.smallFontSize).toEqual(0);
        });
    });

    describe('flexJustifyClass', () => {
        it('should be justify-content-flex-start when position is top', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'top';

            // Act, Assert
            expect(component.flexJustifyClass).toEqual('justify-content-flex-start');
        });

        it('should be justify-content-center when position is center', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'center';

            // Act, Assert
            expect(component.flexJustifyClass).toEqual('justify-content-center');
        });

        it('should be justify-content-flex-end when position is bottom', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'bottom';

            // Act, Assert
            expect(component.flexJustifyClass).toEqual('justify-content-flex-end');
        });

        it('should be justify-content-flex-end when position is empty', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = '';

            // Act, Assert
            expect(component.flexJustifyClass).toEqual('justify-content-flex-end');
        });
    });

    describe('largeFontClasses', () => {
        it('should be "ellipsis-two-lines" when position is top and largeFontSize is smaller than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'top';
            component.largeFontSize = 19;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis-two-lines');
        });

        it('should be "ellipsis" when position is center and largeFontSize is smaller than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'center';
            component.largeFontSize = 19;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis');
        });

        it('should be "ellipsis-two-lines" when position is bottom and largeFontSize is smaller than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'bottom';
            component.largeFontSize = 19;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis-two-lines');
        });

        it('should be "ellipsis" when position is empty and largeFontSize is smaller than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = '';
            component.largeFontSize = 19;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis');
        });

        // YO

        it('should be "ellipsis-two-lines thinner" when position is top and largeFontSize is larger than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'top';
            component.largeFontSize = 21;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis-two-lines thinner');
        });

        it('should be "ellipsis thinner" when position is center and largeFontSize is larger than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'center';
            component.largeFontSize = 21;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis thinner');
        });

        it('should be "ellipsis-two-lines thinner" when position is bottom and largeFontSize is larger than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = 'bottom';
            component.largeFontSize = 21;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis-two-lines thinner');
        });

        it('should be "ellipsis thinner" when position is empty and largeFontSize is larger than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.position = '';
            component.largeFontSize = 21;

            // Act, Assert
            expect(component.largeFontClasses).toEqual('ellipsis thinner');
        });
    });

    describe('smallFontClasses', () => {
        it('should be "" when smallFontSize is smaller than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.smallFontSize = 19;

            // Act, Assert
            expect(component.smallFontClasses).toEqual('');
        });

        it('should be "thinner" when smallFontSize is larger than 20', () => {
            // Arrange
            const component: PlaybackInformationComponent = createComponent();
            component.smallFontSize = 21;

            // Act, Assert
            expect(component.smallFontClasses).toEqual('thinner');
        });
    });

    describe('ngOnInit', () => {
        it('should set top content items and go down without animation if there is a current track playing', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
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
            const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();

            playbackInformationService_playingNextTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

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
            const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();

            playbackInformationService_playingPreviousTrack.next(new PlaybackInformation(trackModel1, 'image-url-mock'));

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
            const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            component.bottomContentTrack = trackModel1;

            playbackInformationService_playingNoTrack.next(new PlaybackInformation(undefined, ''));

            await flushPromises();

            // Assert
            expect(component.bottomContentTrack).toBeUndefined();
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should update the rating of the current track when the rating is saved of a track with the same path', async () => {
            // Arrange
            const trackModel1: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 2, 0);
            const trackModel2: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 4, 0);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            metadataService_ratingSaved.next(trackModel2);

            // Assert
            expect(component.topContentTrack!.rating).toEqual(4);
        });

        it('should not update the rating of the current track when the rating is saved of a track with a different path', async () => {
            // Arrange
            const trackModel1: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 2, 0);
            const trackModel2: TrackModel = createTrackModel('/home/user/Music/track2.mp3', 'My artist 2', 'My title 2', 4, 0);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            metadataService_ratingSaved.next(trackModel2);

            // Assert
            expect(component.topContentTrack!.rating).toEqual(2);
        });

        it('should update the love of the current track when the love is saved of a track with the same path', async () => {
            // Arrange
            const trackModel1: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 2, -1);
            const trackModel2: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 4, 1);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            metadataService_loveSaved.next(trackModel2);

            // Assert
            expect(component.topContentTrack!.love).toEqual(1);
        });

        it('should not update the love of the current track when the love is saved of a track with a different path', async () => {
            // Arrange
            const trackModel1: TrackModel = createTrackModel('/home/user/Music/track1.mp3', 'My artist', 'My title', 2, -1);
            const trackModel2: TrackModel = createTrackModel('/home/user/Music/track2.mp3', 'My artist 2', 'My title 2', 4, 1);

            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(new PlaybackInformation(trackModel1, 'image-url-mock')));
            const component: PlaybackInformationComponent = createComponent();

            // Act
            await component.ngOnInit();
            metadataService_loveSaved.next(trackModel2);

            // Assert
            expect(component.topContentTrack!.love).toEqual(-1);
        });
    });
});
