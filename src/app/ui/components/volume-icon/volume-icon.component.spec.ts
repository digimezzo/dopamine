import { Mock } from 'typemoq';
import { VolumeIconComponent } from './volume-icon.component';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('VolumeIconComponent', () => {
    let playbackServiceMock: any;

    beforeEach(() => {
        playbackServiceMock = { volume: 0 };
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const playbackServiceMock = Mock.ofType<PlaybackService>();

            // Act
            const component: VolumeIconComponent = new VolumeIconComponent(playbackServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });
});
