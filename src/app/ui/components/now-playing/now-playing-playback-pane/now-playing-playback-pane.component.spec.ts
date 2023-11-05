import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BaseNowPlayingNavigationService } from '../../../services/now-playing-navigation/base-now-playing-navigation.service';
import { NowPlayingPage } from '../../../services/now-playing-navigation/now-playing-page';
import { NowPlayingPlaybackPaneComponent } from './now-playing-playback-pane.component';

describe('NowPlayingPlaybackPaneComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let nowPlayingNavigationServiceMock: IMock<BaseNowPlayingNavigationService>;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        nowPlayingNavigationServiceMock = Mock.ofType<BaseNowPlayingNavigationService>();
    });

    function createComponent(): NowPlayingPlaybackPaneComponent {
        return new NowPlayingPlaybackPaneComponent(navigationServiceMock.object, nowPlayingNavigationServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const component: NowPlayingPlaybackPaneComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('currentNowPlayingPage', () => {
        it('should return the current now playing page', () => {
            // Arrange
            const component: NowPlayingPlaybackPaneComponent = createComponent();
            nowPlayingNavigationServiceMock.setup((x) => x.currentNowPlayingPage).returns(() => NowPlayingPage.lyrics);

            // Act, Assert
            expect(component.currentNowPlayingPage).toEqual(NowPlayingPage.lyrics);
        });
    });

    describe('showPlaybackQueue', () => {
        it('should request to show the playback queue', () => {
            // Arrange
            const component: NowPlayingPlaybackPaneComponent = createComponent();

            // Act
            component.showPlaybackQueue();

            // Assert
            navigationServiceMock.verify((x) => x.showPlaybackQueue(), Times.exactly(1));
        });
    });

    describe('navigateToShowcase', () => {
        it('should request to navigate to showcase', () => {
            // Arrange
            const component: NowPlayingPlaybackPaneComponent = createComponent();

            // Act
            component.navigateToShowcase();

            // Assert
            nowPlayingNavigationServiceMock.verify((x) => x.navigate(NowPlayingPage.showcase), Times.once());
        });
    });

    describe('navigateToArtistInformation', () => {
        it('should request to navigate to artist information', () => {
            // Arrange
            const component: NowPlayingPlaybackPaneComponent = createComponent();

            // Act
            component.navigateToArtistInformation();

            // Assert
            nowPlayingNavigationServiceMock.verify((x) => x.navigate(NowPlayingPage.artistInformation), Times.once());
        });
    });

    describe('navigateToLyrics', () => {
        it('should request to navigate to lyrics', () => {
            // Arrange
            const component: NowPlayingPlaybackPaneComponent = createComponent();

            // Act
            component.navigateToLyrics();

            // Assert
            nowPlayingNavigationServiceMock.verify((x) => x.navigate(NowPlayingPage.lyrics), Times.once());
        });
    });
});
