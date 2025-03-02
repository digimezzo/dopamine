import { Subject, Subscription } from 'rxjs';
import { NowPlayingNavigationService } from './now-playing-navigation.service';
import { NowPlayingPage } from './now-playing-page';
import { NowPlayingNavigationServiceBase } from './now-playing-navigation.service.base';
import { IMock, Mock } from 'typemoq';
import { PlaybackInformation } from '../playback-information/playback-information';
import { TrackModel } from '../track/track-model';
import { MockCreator } from '../../testing/mock-creator';
import { PlaybackInformationService } from '../playback-information/playback-information.service';

describe('NowPlayingNavigationService', () => {
    let playbackInformationServiceMock: IMock<PlaybackInformationService>;

    let playingNextTrackMock: Subject<PlaybackInformation>;
    let playingPreviousTrackMock: Subject<PlaybackInformation>;
    let playingNoTrackMock: Subject<PlaybackInformation>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        playbackInformationServiceMock = Mock.ofType<PlaybackInformationService>();

        playingNextTrackMock = new Subject();
        playbackInformationServiceMock.setup((x) => x.playingNextTrack$).returns(() => playingNextTrackMock.asObservable());

        playingPreviousTrackMock = new Subject();
        playbackInformationServiceMock.setup((x) => x.playingPreviousTrack$).returns(() => playingPreviousTrackMock.asObservable());

        playingNoTrackMock = new Subject();
        playbackInformationServiceMock.setup((x) => x.playingNoTrack$).returns(() => playingNoTrackMock.asObservable());
    });

    function createSut(): NowPlayingNavigationServiceBase {
        return new NowPlayingNavigationService(playbackInformationServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: NowPlayingNavigationServiceBase = createSut();

            // Assert
            expect(service).toBeDefined();
        });

        it('should define navigated$', () => {
            // Arrange

            // Act
            const service: NowPlayingNavigationServiceBase = createSut();

            // Assert
            expect(service.navigated$).toBeDefined();
        });

        it('should set current now playing page to nothingPlaying if nothing is playing', async () => {
            // Arrange
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            // Act
            const service: NowPlayingNavigationServiceBase = createSut();
            await flushPromises();

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.nothingPlaying);
        });

        it('should set current now playing page to showcase if something is playing', async () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title1', 'artists1');
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            // Act
            const service: NowPlayingNavigationServiceBase = createSut();
            await flushPromises();

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.showcase);
        });

        it('should navigate to showcase if current now playing page is nothingPlaying when playing next track', () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title1', 'artists1');
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            const service: NowPlayingNavigationServiceBase = createSut();
            service.navigate(NowPlayingPage.nothingPlaying);

            // Act
            playingNextTrackMock.next(currentPlaybackInformation);

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.showcase);
        });

        it('should not navigate to showcase if current now playing page is not nothingPlaying when playing next track', () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title1', 'artists1');
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            const service: NowPlayingNavigationServiceBase = createSut();
            service.navigate(NowPlayingPage.artistInformation);

            // Act
            playingNextTrackMock.next(currentPlaybackInformation);

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });

        it('should navigate to showcase if current now playing page is nothingPlaying when playing previous track', () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title1', 'artists1');
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            const service: NowPlayingNavigationServiceBase = createSut();
            service.navigate(NowPlayingPage.nothingPlaying);

            // Act
            playingPreviousTrackMock.next(currentPlaybackInformation);

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.showcase);
        });

        it('should not navigate to showcase if current now playing page is not nothingPlaying when playing previous track', () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title1', 'artists1');
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            const service: NowPlayingNavigationServiceBase = createSut();
            service.navigate(NowPlayingPage.artistInformation);

            // Act
            playingPreviousTrackMock.next(currentPlaybackInformation);

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });

        it('should navigate to nothingPlaying when playing no track', () => {
            // Arrange
            const currentPlaybackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(currentPlaybackInformation));

            const service: NowPlayingNavigationServiceBase = createSut();
            service.navigate(NowPlayingPage.nothingPlaying);

            // Act
            playingNoTrackMock.next(currentPlaybackInformation);

            // Assert
            expect(service.currentNowPlayingPage).toEqual(NowPlayingPage.nothingPlaying);
        });
    });

    describe('navigate', () => {
        it('should trigger navigation', () => {
            // Arrange
            const service: NowPlayingNavigationServiceBase = createSut();

            let currentNowPlayingPage: NowPlayingPage = NowPlayingPage.showcase;

            const subscription: Subscription = service.navigated$.subscribe((nowPlayingPage: NowPlayingPage) => {
                currentNowPlayingPage = nowPlayingPage;
            });

            // Act
            service.navigate(NowPlayingPage.artistInformation);
            subscription.unsubscribe();

            // Assert
            expect(currentNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });

        it('should set currentNowPlayingPage', () => {
            // Arrange
            const service: NowPlayingNavigationServiceBase = createSut();

            // Act
            const previousNowPlayingPage: NowPlayingPage = service.currentNowPlayingPage;
            service.navigate(NowPlayingPage.artistInformation);
            const newNowPlayingPage: NowPlayingPage = service.currentNowPlayingPage;

            // Assert
            expect(previousNowPlayingPage).toEqual(NowPlayingPage.nothingPlaying);
            expect(newNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });
    });
});
