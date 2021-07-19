import { IMock, Mock, Times } from 'typemoq';
import { Desktop } from '../../common/io/desktop';
import { WindowSize } from '../../common/io/window-size';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { NowPlayingComponent } from './now-playing.component';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let desktopMock: IMock<Desktop>;
    let component: NowPlayingComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        desktopMock = Mock.ofType<Desktop>();

        desktopMock.setup((x) => x.getApplicationWindowSize()).returns(() => new WindowSize(1000, 600));

        component = new NowPlayingComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
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
        it('should set the now playing sizes', () => {
            // Arrange
            const event: any = {};

            // Act
            component.ngOnInit();

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
                playbackServiceMock.object,
                desktopMock.object
            );
            const event: any = {};

            // Act
            component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(150);
            expect(component.playbackInformationHeight).toEqual(75);
            expect(component.playbackInformationLargeFontSize).toEqual(30);
            expect(component.playbackInformationSmallFontSize).toEqual(15);
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
