import { IMock, Mock } from 'typemoq';
import { PlaybackTimeComponent } from './playback-time.component';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';

describe('PlaybackTimeComponent', () => {
    let component: PlaybackTimeComponent;
    let playbackServiceMock: IMock<PlaybackServiceBase>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();

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
