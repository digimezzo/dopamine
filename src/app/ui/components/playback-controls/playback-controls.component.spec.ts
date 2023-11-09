import { IMock, Mock } from 'typemoq';
import { PlaybackControlsComponent } from './playback-controls.component';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';

describe('PlaybackControlsComponent', () => {
    let component: PlaybackControlsComponent;
    let playbackServiceMock: IMock<PlaybackServiceBase>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();
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
