import { IMock, Mock, Times } from 'typemoq';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { CollectionPlaybackPaneComponent } from './collection-playback-pane.component';

describe('CollectionPlaybackPaneComponent', () => {
    let navigationServiceMock: IMock<NavigationService>;
    let component: CollectionPlaybackPaneComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationService>();
        component = new CollectionPlaybackPaneComponent(navigationServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('showNowPlaying', () => {
        it('should request to show Now playing', () => {
            // Arrange

            // Act
            component.showNowPlaying();

            // Assert
            navigationServiceMock.verify((x) => x.showNowPlaying(), Times.exactly(1));
        });
    });
});
