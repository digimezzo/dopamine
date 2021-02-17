import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackProgressComponent } from './playback-progress.component';

describe('PlaybackProgressComponent', () => {
    let component: PlaybackProgressComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        component = new PlaybackProgressComponent(playbackServiceMock.object);
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
