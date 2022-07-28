import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { ArtistComponent } from './artist.component';

describe('GenreComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: ArtistComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new ArtistComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare artist', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artist).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
