import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { PlaybackIndicatorComponent } from './playback-indicator.component';

describe('PlaybackControlsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: PlaybackIndicatorComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new PlaybackIndicatorComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
