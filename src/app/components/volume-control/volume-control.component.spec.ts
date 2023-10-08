import { Mock, Times } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { VolumeControlComponent } from './volume-control.component';

describe('VolumeControlComponent', () => {
    let playbackServiceMock: any;

    beforeEach(() => {
        playbackServiceMock = { volume: 0 };
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const playbackServiceMock = Mock.ofType<BasePlaybackService>();

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
            const playbackServiceMock = Mock.ofType<BasePlaybackService>();
            const component: VolumeControlComponent = new VolumeControlComponent(playbackServiceMock.object);

            // Act
            component.toggleMute();

            // Assert
            playbackServiceMock.verify((x) => x.toggleMute(), Times.once());
        });
    });
});
