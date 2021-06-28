import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackQueueComponent } from './playback-queue.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackQueueComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();

        component = new PlaybackQueueComponent(playbackServiceMock.object);
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
