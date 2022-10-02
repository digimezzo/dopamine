import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { BaseApplication } from '../../common/io/base-application';
import { WindowSize } from '../../common/io/window-size';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { BaseSearchService } from '../../services/search/base-search.service';
import { TrackModel } from '../../services/track/track-model';
import { NowPlayingComponent } from './now-playing.component';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let searchServiceMock: IMock<BaseSearchService>;
    let applicationMock: IMock<BaseApplication>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): NowPlayingComponent {
        return new NowPlayingComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
            metadataServiceMock.object,
            playbackServiceMock.object,
            searchServiceMock.object,
            applicationMock.object
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        applicationMock = Mock.ofType<BaseApplication>();

        applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(1000, 600));

        appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);
        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStopped$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStopped$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should initialize coverArtSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.coverArtSize).toEqual(0);
        });

        it('should initialize playbackInformationHeight as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.playbackInformationHeight).toEqual(0);
        });

        it('should initialize playbackInformationLargeFontSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.playbackInformationLargeFontSize).toEqual(0);
        });

        it('should initialize playbackInformationSmallFontSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.playbackInformationSmallFontSize).toEqual(0);
        });

        it('should initialize controlsVisibility as "visible"', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.controlsVisibility).toEqual('visible');
        });

        it('should initialize background1IsUsed as false', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should initialize background1 as empty', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background1).toEqual('');
        });

        it('should initialize background2 as empty', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background2).toEqual('');
        });

        it('should initialize background1Animation as "fade-out"', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background1Animation).toEqual('fade-out');
        });

        it('should initialize background2Animation as "fade-in-light" if the light theme is being used', () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => true);

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background2Animation).toEqual('fade-in-light');
        });

        it('should initialize background2Animation as "fade-in-dark" if the light theme is not being used', () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.background2Animation).toEqual('fade-in-dark');
        });
    });

    describe('goBackToCollection', () => {
        it('should request to go back to the collection', () => {
            // Arrange
            const component: NowPlayingComponent = createComponent();

            // Act
            component.goBackToCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });
    });

    describe('onResize', () => {
        it('should set the now playing sizes in relation to window height', () => {
            // Arrange
            const event: any = {};
            const component: NowPlayingComponent = createComponent();

            // Act
            component.onResize(event);

            // Assert
            expect(component.coverArtSize).toEqual(242);
            expect(component.playbackInformationHeight).toEqual(242);
            expect(component.playbackInformationLargeFontSize).toEqual(43.214285714285715);
            expect(component.playbackInformationSmallFontSize).toEqual(21.607142857142858);
        });

        it('should set the now playing sizes in relation to window width if width is too small', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(550, 600));
            const component: NowPlayingComponent = createComponent();
            const event: any = {};

            // Act
            component.onResize(event);

            // Assert
            expect(component.coverArtSize).toEqual(150);
            expect(component.playbackInformationHeight).toEqual(150);
            expect(component.playbackInformationLargeFontSize).toEqual(26.78571428571429);
            expect(component.playbackInformationSmallFontSize).toEqual(13.392857142857144);
        });
    });

    describe('ngOnInit', () => {
        it('should set the now playing sizes', async () => {
            // Arrange
            const event: any = {};
            const component: NowPlayingComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(242);
            expect(component.playbackInformationHeight).toEqual(242);
            expect(component.playbackInformationLargeFontSize).toEqual(43.214285714285715);
            expect(component.playbackInformationSmallFontSize).toEqual(21.607142857142858);
        });

        it('should set the now playing sizes in relation to window width if width is too small', async () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(550, 600));
            const component: NowPlayingComponent = createComponent();
            const event: any = {};

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(150);
            expect(component.playbackInformationHeight).toEqual(150);
            expect(component.playbackInformationLargeFontSize).toEqual(26.78571428571429);
            expect(component.playbackInformationSmallFontSize).toEqual(13.392857142857144);
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background and light theme is used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => true);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-light');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background and light theme is not used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-dark');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            component.background1IsUsed = false;
            component.background2 = 'another-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background1).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-in-dark');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            component.background1IsUsed = true;
            component.background1 = 'dummy-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background2).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background1 if background1 is not used and background2 is the same as the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            component.background1IsUsed = false;
            component.background2 = 'dummy-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background1).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback started and light theme is used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => true);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModelMock.object, false));
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-light');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback started and light theme is not used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModelMock.object, false));
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-dark');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = false;
            component.background2 = 'another-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModelMock.object, false));
            await flushPromises();

            // Assert
            expect(component.background1).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-in-dark');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'dummy-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModelMock.object, false));
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background1 if background1 is not used and background2 is the same as the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = false;
            component.background2 = 'dummy-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModelMock.object, false));
            await flushPromises();

            // Assert
            expect(component.background1).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback stopped and light theme is used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => true);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-light');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback stopped and light theme is not used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'another-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-out');
            expect(component.background2Animation).toEqual('fade-in-dark');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = false;
            component.background2 = 'another-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(component.background1).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-in-dark');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = true;
            component.background1 = 'dummy-background';

            component.background2 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(component.background2).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background1 if background1 is not used and background2 is the same as the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            const component: NowPlayingComponent = createComponent();

            await component.ngOnInit();

            component.background1IsUsed = false;
            component.background2 = 'dummy-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            playbackServicePlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(component.background1).toEqual('unset-value');
            expect(component.background1Animation).toEqual('unset-value');
            expect(component.background2Animation).toEqual('unset-value');
            expect(component.background1IsUsed).toBeFalsy();
        });
    });

    describe('handleKeyboardEvent', () => {
        it('should toggle playback when space is pressed and while not searching', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => false);
            const component: NowPlayingComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.once());
        });

        it('should not toggle playback when space is pressed and while searching', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => true);
            const component: NowPlayingComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });

        it('should not toggle playback when another key than space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');
            const component: NowPlayingComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });
    });
});
