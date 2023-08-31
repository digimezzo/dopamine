import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BaseNowPlayingNavigationService } from '../../../services/now-playing-navigation/base-now-playing-navigation.service';
import { NowPlayingPage } from '../../../services/now-playing-navigation/now-playing-page';
import { NowPlayingPlaybackPaneComponent } from './now-playing-playback-pane.component';

describe('NowPlayingPlaybackPaneComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let nowPlayingNavigationServiceMock: IMock<BaseNowPlayingNavigationService>;
    let component: NowPlayingPlaybackPaneComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        nowPlayingNavigationServiceMock = Mock.ofType<BaseNowPlayingNavigationService>();
        component = new NowPlayingPlaybackPaneComponent(navigationServiceMock.object, nowPlayingNavigationServiceMock.object);
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

    describe('navigateToShowcase', () => {
        it('should request to navigate to showcase', () => {
            // Arrange

            // Act
            component.navigateToShowcase();

            // Assert
            nowPlayingNavigationServiceMock.verify((x) => x.navigate(NowPlayingPage.showcase), Times.once());
        });

        it('should request to navigate to artist information', () => {
            // Arrange

            // Act
            component.navigateToArtistInformation();

            // Assert
            nowPlayingNavigationServiceMock.verify((x) => x.navigate(NowPlayingPage.artistInformation), Times.once());
        });
    });
});
