import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { GenreComponent } from './genre.component';

describe('GenreComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: GenreComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new GenreComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare genre', () => {
            // Arrange

            // Act

            // Assert
            expect(component.genre).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
