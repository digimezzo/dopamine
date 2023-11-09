import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { NowPlayingComponent } from './now-playing.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { MetadataServiceBase } from '../../../services/metadata/metadata.service.base';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { NowPlayingNavigationServiceBase } from '../../../services/now-playing-navigation/now-playing-navigation.service.base';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { NowPlayingPage } from '../../../services/now-playing-navigation/now-playing-page';
import { TrackModel } from '../../../services/track/track-model';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let metadataServiceMock: IMock<MetadataServiceBase>;
    let playbackServiceMock: IMock<PlaybackServiceBase>;
    let searchServiceMock: IMock<SearchServiceBase>;
    let nowPlayingNavigationServiceMock: IMock<NowPlayingNavigationServiceBase>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;

    let nowPlayingNavigationServiceNavigatedMock: Subject<NowPlayingPage>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): NowPlayingComponent {
        return new NowPlayingComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
            metadataServiceMock.object,
            playbackServiceMock.object,
            searchServiceMock.object,
            nowPlayingNavigationServiceMock.object,
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataServiceBase>();
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        nowPlayingNavigationServiceMock = Mock.ofType<NowPlayingNavigationServiceBase>();

        appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => false);

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);
        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStopped$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStopped$);

        nowPlayingNavigationServiceNavigatedMock = new Subject();
        const nowPlayingNavigationServiceNavigated$: Observable<NowPlayingPage> = nowPlayingNavigationServiceNavigatedMock.asObservable();
        nowPlayingNavigationServiceMock.setup((x) => x.navigated$).returns(() => nowPlayingNavigationServiceNavigated$);
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

        it('should declare stepper', () => {
            // Arrange

            // Act
            const component: NowPlayingComponent = createComponent();

            // Assert
            expect(component.stepper).toBeUndefined();
        });
    });

    describe('goBackToCollection', () => {
        it('should request to go back to the collection', async () => {
            // Arrange
            const component: NowPlayingComponent = createComponent();

            // Act
            await component.goBackToCollectionAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollectionAsync(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set background2 if background1 is used and background1 is different than the proposed background and light theme is used', async () => {
            // Arrange
            appearanceServiceMock.reset();
            appearanceServiceMock.setup((x) => x.isUsingLightTheme).returns(() => true);
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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
            metadataServiceMock
                .setup((x) => x.createImageUrlAsync(trackModelMock.object))
                .returns(() => Promise.resolve('dummy-background'));
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

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

        it('should set stepper.selectedIndex', async () => {
            // Arrange
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;

            nowPlayingNavigationServiceMock.setup((x) => x.currentNowPlayingPage).returns(() => NowPlayingPage.artistInformation);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.stepper.selectedIndex).toEqual(NowPlayingPage.artistInformation);
        });

        it('should detect navigation request and set stepper.selectedIndex', async () => {
            // Arrange
            const component: NowPlayingComponent = createComponent();
            component.stepper = { selectedIndex: NowPlayingPage.showcase } as any;
            await component.ngOnInit();

            // Act
            nowPlayingNavigationServiceNavigatedMock.next(NowPlayingPage.artistInformation);

            // Assert
            expect(component.stepper.selectedIndex).toEqual(NowPlayingPage.artistInformation);
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
