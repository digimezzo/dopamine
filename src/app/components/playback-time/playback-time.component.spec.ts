import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackTimeComponent } from './playback-time.component';

describe('PlaybackTimeComponent', () => {
    let component: PlaybackTimeComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();

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
