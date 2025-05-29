import { IMock, Mock } from 'typemoq';
import { PlaybackTimeComponent } from './playback-time.component';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('PlaybackTimeComponent', () => {
    let component: PlaybackTimeComponent;
    let playbackServiceMock: IMock<PlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();

        component = new PlaybackTimeComponent(playbackServiceMock.object);
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
