import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { GenreComponent } from './genre.component';

describe('GenreComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let semanticZoomServiceMock: IMock<BaseSemanticZoomService>;
    let component: GenreComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        semanticZoomServiceMock = Mock.ofType<BaseSemanticZoomService>();
        component = new GenreComponent(appearanceServiceMock.object, semanticZoomServiceMock.object);
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
