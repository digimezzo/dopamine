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
