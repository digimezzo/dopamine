import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Desktop } from '../../common/io/desktop';
import { WindowSize } from '../../common/io/window-size';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { NowPlayingComponent } from './now-playing.component';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let desktopMock: IMock<Desktop>;
    let component: NowPlayingComponent;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;

    const flushPromises = () => new Promise(setImmediate);

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        desktopMock = Mock.ofType<Desktop>();

        desktopMock.setup((x) => x.getApplicationWindowSize()).returns(() => new WindowSize(1000, 600));

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);
        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStopped$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStopped$);

        component = new NowPlayingComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
            metadataServiceMock.object,
            playbackServiceMock.object,
            desktopMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should initialize coverArtSize as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.coverArtSize).toEqual(0);
        });

        it('should initialize playbackInformationHeight as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackInformationHeight).toEqual(0);
        });

        it('should initialize playbackInformationLargeFontSize as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackInformationLargeFontSize).toEqual(0);
        });

        it('should initialize playbackInformationSmallFontSize as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackInformationSmallFontSize).toEqual(0);
        });

        it('should initialize controlsVisibility as "visible"', () => {
            // Arrange

            // Act

            // Assert
            expect(component.controlsVisibility).toEqual('visible');
        });
    });

    describe('goBackToCollection', () => {
        it('should request to go back to the collection', () => {
            // Arrange

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

            // Act
            component.onResize(event);

            // Assert
            expect(component.coverArtSize).toEqual(242);
            expect(component.playbackInformationHeight).toEqual(121);
            expect(component.playbackInformationLargeFontSize).toEqual(48.4);
            expect(component.playbackInformationSmallFontSize).toEqual(24.2);
        });

        it('should set the now playing sizes in relation to window width if width is too small', () => {
            // Arrange
            desktopMock.reset();
            desktopMock.setup((x) => x.getApplicationWindowSize()).returns(() => new WindowSize(550, 600));
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );
            const event: any = {};

            // Act
            component.onResize(event);

            // Assert
            expect(component.coverArtSize).toEqual(150);
            expect(component.playbackInformationHeight).toEqual(75);
            expect(component.playbackInformationLargeFontSize).toEqual(30);
            expect(component.playbackInformationSmallFontSize).toEqual(15);
        });
    });

    describe('ngOnInit', () => {
        it('should set the now playing sizes', async () => {
            // Arrange
            const event: any = {};

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(242);
            expect(component.playbackInformationHeight).toEqual(121);
            expect(component.playbackInformationLargeFontSize).toEqual(48.4);
            expect(component.playbackInformationSmallFontSize).toEqual(24.2);
        });

        it('should set the now playing sizes in relation to window width if width is too small', async () => {
            // Arrange
            desktopMock.reset();
            desktopMock.setup((x) => x.getApplicationWindowSize()).returns(() => new WindowSize(550, 600));
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );
            const event: any = {};

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(150);
            expect(component.playbackInformationHeight).toEqual(75);
            expect(component.playbackInformationLargeFontSize).toEqual(30);
            expect(component.playbackInformationSmallFontSize).toEqual(15);
        });

        it('should set background2 if background1 is used and background1 is different than the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            expect(component.background2Animation).toEqual('fade-in');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

            component.background1IsUsed = false;
            component.background2 = 'another-background';

            component.background1 = 'unset-value';
            component.background1Animation = 'unset-value';
            component.background2Animation = 'unset-value';

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.background1).toEqual('dummy-background');
            expect(component.background1Animation).toEqual('fade-in');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            expect(component.background2Animation).toEqual('fade-in');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            expect(component.background1Animation).toEqual('fade-in');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background on playback started', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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

        it('should set background2 if background1 is used and background1 is different than the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            expect(component.background2Animation).toEqual('fade-in');
            expect(component.background1IsUsed).toBeFalsy();
        });

        it('should set background1 if background1 is not used and background2 is different than the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            expect(component.background1Animation).toEqual('fade-in');
            expect(component.background2Animation).toEqual('fade-out');
            expect(component.background1IsUsed).toBeTruthy();
        });

        it('should not set background2 if background1 is used and background1 is the same as the proposed background on playback stopped', async () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModelMock.object);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModelMock.object)).returns(async () => 'dummy-background');
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
            component = new NowPlayingComponent(
                appearanceServiceMock.object,
                navigationServiceMock.object,
                metadataServiceMock.object,
                playbackServiceMock.object,
                desktopMock.object
            );

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
        it('should toggle playback when space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.once());
        });

        it('should not toggle playback when another key then space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });
    });
});
