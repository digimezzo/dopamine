import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { ArtistComponent } from './artist.component';

describe('GenreComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let semanticZoomServiceMock: IMock<BaseSemanticZoomService>;
    let component: ArtistComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        semanticZoomServiceMock = Mock.ofType<BaseSemanticZoomService>();
        component = new ArtistComponent(appearanceServiceMock.object, semanticZoomServiceMock.object);
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

        it('should define semanticZoomService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.semanticZoomService).toBeDefined();
        });
    });

    describe('requestZoomOut', () => {
        it('should request zoom out', () => {
            // Arrange

            // Act
            component.requestZoomOut();

            // Assert
            semanticZoomServiceMock.verify((x) => x.requestZoomOut(), Times.once());
        });
    });
});
