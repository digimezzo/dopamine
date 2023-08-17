import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../common/settings/base-settings';
import { NowPlayingArtistInfoComponent } from './now-playing-artist-info.component';

describe('NowPlayingArtistInfoComponent', () => {
    let settingsMock: IMock<BaseSettings>;

    function createComponent(): NowPlayingArtistInfoComponent {
        return new NowPlayingArtistInfoComponent(settingsMock.object);
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const component: NowPlayingArtistInfoComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });
});
