import { IMock, Mock, Times } from 'typemoq';
import { NowPlayingNavigationServiceBase } from '../../../../services/now-playing-navigation/now-playing-navigation.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { NowPlayingPage } from '../../../../services/now-playing-navigation/now-playing-page';
import { HighlightsPlaybackPaneComponent } from './highlights-playback-pane.component';

describe('HighlightsPlaybackPaneComponent', () => {
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let nowPlayingNavigationServiceMock: IMock<NowPlayingNavigationServiceBase>;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        nowPlayingNavigationServiceMock = Mock.ofType<NowPlayingNavigationServiceBase>();
    });

    function createComponent(): HighlightsPlaybackPaneComponent {
        return new HighlightsPlaybackPaneComponent(navigationServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const component: HighlightsPlaybackPaneComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });
});
