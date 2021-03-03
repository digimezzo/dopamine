import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { VolumeControlComponent } from './volume-control.component';

describe('VolumeControlComponent', () => {
    let component: VolumeControlComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        component = new VolumeControlComponent(playbackServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });
    });
});
