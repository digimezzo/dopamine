import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { InformationComponent } from './information.component';

describe('InformationComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    let component: InformationComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        component = new InformationComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBe(appearanceServiceMock.object);
        });
    });
});
