import { IMock, Mock, Times } from 'typemoq';
import { ListItemStyler } from '../../../../common/styling/list-item-styler';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { GenreComponent } from './genre.component';

describe('GenreComponent', () => {
    let listItemStylerMock: IMock<ListItemStyler>;
    let semanticZoomServiceMock: IMock<BaseSemanticZoomService>;
    let component: GenreComponent;

    beforeEach(() => {
        listItemStylerMock = Mock.ofType<ListItemStyler>();
        semanticZoomServiceMock = Mock.ofType<BaseSemanticZoomService>();
        component = new GenreComponent(listItemStylerMock.object, semanticZoomServiceMock.object);
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

        it('should define listItemStyler', () => {
            // Arrange

            // Act

            // Assert
            expect(component.listItemStyler).toBeDefined();
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
