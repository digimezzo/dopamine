import { IMock, Mock, Times } from 'typemoq';
import { CollectionPlaybackPaneComponent } from './collection-playback-pane.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

describe('CollectionPlaybackPaneComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let component: CollectionPlaybackPaneComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        component = new CollectionPlaybackPaneComponent(appearanceServiceMock.object, settingsMock.object, navigationServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeDefined();
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

    describe('showNowPlaying', () => {
        it('should request to show now playing', async () => {
            // Arrange

            // Act
            await component.showNowPlayingAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToNowPlayingAsync(), Times.exactly(1));
        });
    });
});
