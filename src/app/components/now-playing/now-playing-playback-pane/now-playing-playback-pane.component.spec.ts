import { IMock, Mock, Times } from 'typemoq';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { NowPlayingPlaybackPaneComponent } from './now-playing-playback-pane.component';

describe('NowPlayingPlaybackPaneComponent', () => {
    let navigationServiceMock: IMock<NavigationService>;
    let component: NowPlayingPlaybackPaneComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationService>();
        component = new NowPlayingPlaybackPaneComponent(navigationServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('showPlaybackQueue', () => {
        it('should request to show the playback queue', () => {
            // Arrange

            // Act
            component.showPlaybackQueue();

            // Assert
            navigationServiceMock.verify((x) => x.showPlaybackQueue(), Times.exactly(1));
        });
    });
});
