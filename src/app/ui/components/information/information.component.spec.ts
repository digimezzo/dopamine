import { IMock, Mock } from 'typemoq';
import { InformationComponent } from './information.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';

describe('InformationComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;

    let component: InformationComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();

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
