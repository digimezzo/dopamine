import { VolumeControlComponent } from './volume-control.component';

describe('VolumeControlComponent', () => {
    let playbackServiceMock: any;

    beforeEach(() => {
        playbackServiceMock = { volume: 0 };
    });

    function createVolumeControl(): VolumeControlComponent {
        return new VolumeControlComponent(playbackServiceMock);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            let component: VolumeControlComponent = createVolumeControl();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('volume', () => {
        it('should set playbackService.volume', () => {
            // Arrange
            playbackServiceMock.volume = 50;
            let component: VolumeControlComponent = createVolumeControl();

            // Act
            component.volume = 20;

            // Assert
            expect(playbackServiceMock.volume).toEqual(20);
        });

        it('should get playbackService.volume', () => {
            // Arrange
            playbackServiceMock.volume = 40;
            let component: VolumeControlComponent = createVolumeControl();

            // Act & Assert
            expect(component.volume).toEqual(40);
        });
    });
});
