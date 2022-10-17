import { IMock, Mock, Times } from 'typemoq';
import { ListItemStyler } from '../../../../common/styling/list-item-styler';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { ArtistComponent } from './artist.component';

describe('GenreComponent', () => {
    let listItemStylerMock: IMock<ListItemStyler>;
    let semanticZoomServiceMock: IMock<BaseSemanticZoomService>;
    let component: ArtistComponent;

    beforeEach(() => {
        listItemStylerMock = Mock.ofType<ListItemStyler>();
        semanticZoomServiceMock = Mock.ofType<BaseSemanticZoomService>();
        component = new ArtistComponent(listItemStylerMock.object, semanticZoomServiceMock.object);
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
