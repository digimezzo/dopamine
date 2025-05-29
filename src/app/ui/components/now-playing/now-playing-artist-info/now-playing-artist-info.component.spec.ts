import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { NowPlayingArtistInfoComponent } from './now-playing-artist-info.component';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { ArtistInformationServiceBase } from '../../../../services/artist-information/artist-information.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { MockCreator } from '../../../../testing/mock-creator';
import { TrackModel } from '../../../../services/track/track-model';
import { ArtistInformation } from '../../../../services/artist-information/artist-information';

describe('NowPlayingArtistInfoComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let artistInformationServiceMock: IMock<ArtistInformationServiceBase>;
    let settingsMock: IMock<SettingsBase>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): NowPlayingArtistInfoComponent {
        return new NowPlayingArtistInfoComponent(playbackServiceMock.object, artistInformationServiceMock.object, settingsMock.object);
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        artistInformationServiceMock = Mock.ofType<ArtistInformationServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();

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
    });

    describe('ngOnInit', () => {
        it('should show empty artist information if current track is undefined', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.artist.name).toEqual('');
            expect(component.artist.url).toEqual('');
            expect(component.artist.imageUrl).toEqual('');
            expect(component.artist.biography).toEqual('');
            expect(component.artist.hasBiography).toBeFalsy();
            expect(component.artist.hasSimilarArtists).toBeFalsy();
        });

        it('should show non-empty artist information if current track is not undefined', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const artistInformation: ArtistInformation = MockCreator.createArtistInformation('artist1', 'url1', 'imageUrl1', 'biography1');

            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel))
                .returns(() => Promise.resolve(artistInformation));
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

            // Act
            await component.ngOnInit();
            await flushPromises();

            // Assert

            expect(component.artist.name).toEqual('artist1');
            expect(component.artist.url).toEqual('url1');
            expect(component.artist.imageUrl).toEqual('imageUrl1');
            expect(component.artist.biography).toEqual('biography1');
            expect(component.artist.hasBiography).toBeTruthy();
            expect(component.artist.hasSimilarArtists).toBeFalsy();
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
            artistInformationServiceMock.verify((x) => x.getQuickArtistInformation(trackModel2), Times.once());
            artistInformationServiceMock.verify((x) => x.getArtistInformationAsync(trackModel2), Times.once());
            expect(artistNameBeforePlaybackStarted).toEqual('artist1');
            expect(artistNameAfterPlaybackStarted).toEqual('artist2');
        });

        it('should not change artist information when playback starts if artist remains the same and not empty', async () => {
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
            artistInformationServiceMock.verify((x) => x.getQuickArtistInformation(trackModel2), Times.never());
            artistInformationServiceMock.verify((x) => x.getArtistInformationAsync(trackModel2), Times.never());
            expect(artistNameBeforePlaybackStarted).toEqual('artist1');
            expect(artistNameAfterPlaybackStarted).toEqual('artist1');
        });

        it('should change artist information when playback starts if artist changes and is empty', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel1: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const artistInformation1: ArtistInformation = MockCreator.createArtistInformation('artist1', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel1))
                .returns(() => Promise.resolve(artistInformation1));

            const trackModel2: TrackModel = MockCreator.createTrackModel('path2', 'title', ';;');
            const artistInformation2: ArtistInformation = MockCreator.createArtistInformation('', '', '', '');
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
            artistInformationServiceMock.verify((x) => x.getQuickArtistInformation(trackModel2), Times.once());
            artistInformationServiceMock.verify((x) => x.getArtistInformationAsync(trackModel2), Times.once());
            expect(artistNameBeforePlaybackStarted).toEqual('artist1');
            expect(artistNameAfterPlaybackStarted).toEqual('');
        });

        it('should change artist information when playback starts if artist changes and is empty and previous artist is also empty', async () => {
            // Arrange
            const component: NowPlayingArtistInfoComponent = createComponent();

            const trackModel1: TrackModel = MockCreator.createTrackModel('path1', 'title', ';;');
            const artistInformation1: ArtistInformation = MockCreator.createArtistInformation('', '', '', '');
            artistInformationServiceMock
                .setup((x) => x.getArtistInformationAsync(trackModel1))
                .returns(() => Promise.resolve(artistInformation1));

            const trackModel2: TrackModel = MockCreator.createTrackModel('path2', 'title', ';;');
            const artistInformation2: ArtistInformation = MockCreator.createArtistInformation('', '', '', '');
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
            artistInformationServiceMock.verify((x) => x.getQuickArtistInformation(trackModel2), Times.once());
            artistInformationServiceMock.verify((x) => x.getArtistInformationAsync(trackModel2), Times.once());
            expect(artistNameBeforePlaybackStarted).toEqual('');
            expect(artistNameAfterPlaybackStarted).toEqual('');
        });
    });
});
