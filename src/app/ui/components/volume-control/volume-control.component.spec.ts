import { Mock, Times } from 'typemoq';
import { VolumeControlComponent } from './volume-control.component';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('VolumeControlComponent', () => {
    let playbackServiceMock: any;

    beforeEach(() => {
        playbackServiceMock = { volume: 0 };
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const playbackServiceMock = Mock.ofType<PlaybackService>();

            // Act
            const component: VolumeControlComponent = new VolumeControlComponent(playbackServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('volume', () => {
        it('should set playbackService.volume', () => {
            // Arrange
            const playbackServiceMock: any = { volume: 50 };
            const component: VolumeControlComponent = new VolumeControlComponent(playbackServiceMock);

            // Act
            component.volume = 20;

            // Assert
            expect(playbackServiceMock.volume).toEqual(20);
        });

        it('should get playbackService.volume', () => {
            // Arrange
            const playbackServiceMock: any = { volume: 40 };
            const component: VolumeControlComponent = new VolumeControlComponent(playbackServiceMock);

            // Act & Assert
            expect(component.volume).toEqual(40);
        });
    });

    describe('toggleMute', () => {
        it('should call playbackService.toggleMute()', () => {
            // Arrange
            const playbackServiceMock = Mock.ofType<PlaybackService>();
            const component: VolumeControlComponent = new VolumeControlComponent(playbackServiceMock.object);

            // Act
            component.toggleMute();

            // Assert
            playbackServiceMock.verify((x) => x.toggleMute(), Times.once());
        });
    });
});
