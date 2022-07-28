import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackControlsComponent } from './playback-controls.component';

describe('PlaybackControlsComponent', () => {
    let component: PlaybackControlsComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        component = new PlaybackControlsComponent(playbackServiceMock.object);
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

        it('should define loopModeEnum', () => {
            // Arrange

            // Act

            // Assert
            expect(component.loopModeEnum).toBeDefined();
        });
    });
});
