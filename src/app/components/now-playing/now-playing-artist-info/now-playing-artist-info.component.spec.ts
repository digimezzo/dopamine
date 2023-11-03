import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { ArtistInformation } from '../../../services/artist-information/artist-information';
import { BaseArtistInformationService } from '../../../services/artist-information/base-artist-information.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { MockCreator } from '../../../testing/mock-creator';
import { NowPlayingArtistInfoComponent } from './now-playing-artist-info.component';
import { BaseScheduler } from '../../../common/scheduling/base-scheduler';

describe('NowPlayingArtistInfoComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let artistInformationServiceMock: IMock<BaseArtistInformationService>;
    let settingsMock: IMock<BaseSettings>;
    let schedulerMock: IMock<BaseScheduler>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): NowPlayingArtistInfoComponent {
        return new NowPlayingArtistInfoComponent(
            playbackServiceMock.object,
            artistInformationServiceMock.object,
            schedulerMock.object,
            settingsMock.object,
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        artistInformationServiceMock = Mock.ofType<BaseArtistInformationService>();
        schedulerMock = Mock.ofType<BaseScheduler>();
        settingsMock = Mock.ofType<BaseSettings>();

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });

        it('should set contentAnimation to fade-in', () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Act, Assert
            expect(component.contentAnimation).toEqual('fade-in');
        });
    });

    describe('imageIsLoaded', () => {
        it('should set contentAnimation to fade-in', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Act
            await component.imageIsLoadedAsync();

            // Assert
            expect(component.contentAnimation).toEqual('fade-in');
        });
    });

    describe('ngOnInit', () => {
        it('should show empty artist information if current track is undefined', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.artist.isEmpty).toBeTruthy();
        });

        it('should show non-empty artist information if current track is not undefined', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const artistInformation: ArtistInformation = MockCreator.createArtistInformation('artist1', '', '', '');

            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel))
                .returns(() => Promise.resolve(artistInformation));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

            // Act
            await component.ngOnInit();
            await flushPromises();

            // Assert
            expect(component.artist.isEmpty).toBeFalsy();
            expect(component.artist.name).toEqual('artist1');
        });

        it('should change artist information when playback starts if artist changes', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel1: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const artistInformation1: ArtistInformation = MockCreator.createArtistInformation('artist1', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel1))
                .returns(() => Promise.resolve(artistInformation1));

            const trackModel2: TrackModel = MockCreator.createTrackModel('path2', 'title', ';artist2;');
            const artistInformation2: ArtistInformation = MockCreator.createArtistInformation('artist2', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel2))
                .returns(() => Promise.resolve(artistInformation2));

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel2, false);

            // Act
            await component.ngOnInit();
            await flushPromises();
            const artistNameBeforePlaybackStarted: string = component.artist.name;

            playbackServicePlaybackStartedMock.next(playbackStarted);
            await flushPromises();
            const artistNameAfterPlaybackStarted: string = component.artist.name;

            // Assert
            expect(artistNameBeforePlaybackStarted).toEqual('artist1');
            expect(artistNameAfterPlaybackStarted).toEqual('artist2');
        });

        it('should not change artist information when playback starts if artist remains the same', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel1: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const artistInformation1: ArtistInformation = MockCreator.createArtistInformation('artist1', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel1))
                .returns(() => Promise.resolve(artistInformation1));

            const trackModel2: TrackModel = MockCreator.createTrackModel('path2', 'title', ';artist1;');
            const artistInformation2: ArtistInformation = MockCreator.createArtistInformation('artist1', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel2))
                .returns(() => Promise.resolve(artistInformation2));

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel2, false);

            // Act
            await component.ngOnInit();
            await flushPromises();
            const artistNameBeforePlaybackStarted: string = component.artist.name;

            playbackServicePlaybackStartedMock.next(playbackStarted);
            await flushPromises();
            const artistNameAfterPlaybackStarted: string = component.artist.name;

            // Assert
            expect(artistNameBeforePlaybackStarted).toEqual('artist1');
            expect(artistNameAfterPlaybackStarted).toEqual('artist1');
        });
    });
});
