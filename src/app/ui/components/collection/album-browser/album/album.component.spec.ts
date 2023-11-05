import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { AlbumComponent } from './album.component';

describe('AlbumComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: AlbumComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new AlbumComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare but not define Album', () => {
            // Arrange

            // Act

            // Assert
            expect(component.album).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isSelected).toBeFalsy();
        });
    });
});
