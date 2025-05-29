import { IMock, Mock } from 'typemoq';
import { PlaybackControlsComponent } from './playback-controls.component';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('PlaybackControlsComponent', () => {
    let component: PlaybackControlsComponent;
    let playbackServiceMock: IMock<PlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
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
