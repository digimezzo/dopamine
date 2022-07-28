import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { TrackComponent } from './track.component';

describe('TrackComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: TrackComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new TrackComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Track', () => {
            // Arrange

            // Act

            // Assert
            expect(component.track).toBeUndefined();
        });

        it('should define canShowHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canShowHeader).toBeFalsy();
        });

        it('should define appearanceService as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
