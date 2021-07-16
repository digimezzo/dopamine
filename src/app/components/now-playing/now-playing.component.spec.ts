import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { NowPlayingComponent } from './now-playing.component';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let component: NowPlayingComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        component = new NowPlayingComponent(appearanceServiceMock.object, navigationServiceMock.object);
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
    });

    describe('goBackToCollection', () => {
        it('should request to go back to the collection', () => {
            // Arrange

            // Act
            component.goBackToCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollection(), Times.exactly(1));
        });
    });
});
