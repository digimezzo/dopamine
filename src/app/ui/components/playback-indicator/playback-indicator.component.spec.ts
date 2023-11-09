import { IMock, Mock } from 'typemoq';
import { PlaybackIndicatorComponent } from './playback-indicator.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

describe('PlaybackControlsComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let component: PlaybackIndicatorComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        component = new PlaybackIndicatorComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare isSelected', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
