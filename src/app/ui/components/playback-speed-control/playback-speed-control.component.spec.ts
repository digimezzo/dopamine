import { PlaybackSpeedControlComponent } from './playback-speed-control.component';

describe('PlaybackSpeedControlComponent', () => {
    it('should expose the playback speed as a slider offset from 0.5x', () => {
        // Arrange
        const playbackServiceMock: any = { playbackSpeed: 1.25 };
        const component: PlaybackSpeedControlComponent = new PlaybackSpeedControlComponent(playbackServiceMock);

        // Act, Assert
        expect(component.sliderValue).toEqual(0.75);
    });

    it('should update the playback service when the slider changes', () => {
        // Arrange
        const playbackServiceMock: any = { playbackSpeed: 1 };
        const component: PlaybackSpeedControlComponent = new PlaybackSpeedControlComponent(playbackServiceMock);

        // Act
        component.sliderValue = 1;

        // Assert
        expect(playbackServiceMock.playbackSpeed).toEqual(1.5);
    });

    it('should change playback speed by exactly 0.05x', () => {
        // Arrange
        const playbackServiceMock: any = { playbackSpeed: 1 };
        const component: PlaybackSpeedControlComponent = new PlaybackSpeedControlComponent(playbackServiceMock);

        // Act
        component.decreaseSpeed();
        component.increaseSpeed();

        // Assert
        expect(playbackServiceMock.playbackSpeed).toEqual(1);
        expect(component.maximumSpeed).toEqual(3);
    });

    it('should use the speed button as an above-anchor popup with a 16px-safe primary position', () => {
        // Arrange
        const playbackServiceMock: any = { playbackSpeed: 1 };
        const component: PlaybackSpeedControlComponent = new PlaybackSpeedControlComponent(playbackServiceMock);

        // Act, Assert
        expect(component.popupPositions[0]).toEqual({ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 });
        expect(component.popupViewportMargin).toEqual(16);
    });

    it('should open and close the speed popup without changing playback speed', () => {
        // Arrange
        const playbackServiceMock: any = { playbackSpeed: 1.25 };
        const component: PlaybackSpeedControlComponent = new PlaybackSpeedControlComponent(playbackServiceMock);

        // Act
        component.togglePopup();
        component.closePopup();

        // Assert
        expect(component.isPopupOpen).toBeFalsy();
        expect(playbackServiceMock.playbackSpeed).toEqual(1.25);
    });
});
