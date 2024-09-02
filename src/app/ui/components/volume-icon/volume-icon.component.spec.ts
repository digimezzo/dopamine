import { Mock } from 'typemoq';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { VolumeIconComponent } from './volume-icon.component';

describe('VolumeIconComponent', () => {
    let playbackServiceMock: any;

    beforeEach(() => {
        playbackServiceMock = { volume: 0 };
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const playbackServiceMock = Mock.ofType<PlaybackServiceBase>();

            // Act
            const component: VolumeIconComponent = new VolumeIconComponent(playbackServiceMock.object);

            // Assert
            expect(component).toBeDefined();
        });
    });
});
