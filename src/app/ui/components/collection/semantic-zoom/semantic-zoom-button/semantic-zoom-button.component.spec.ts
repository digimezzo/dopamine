import { IMock, Mock, Times } from 'typemoq';
import { SemanticZoomButtonComponent } from './semantic-zoom-button.component';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';

describe('SemanticZoomButtonComponent', () => {
    let semanticZoomServiceMock: IMock<SemanticZoomServiceBase>;

    let component: SemanticZoomButtonComponent;

    beforeEach(() => {
        semanticZoomServiceMock = Mock.ofType<SemanticZoomServiceBase>();
        component = new SemanticZoomButtonComponent(semanticZoomServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare isZoomable as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isZoomable).toBeFalsy();
        });
    });

    describe('requestZoomIn', () => {
        it('should request zoom in', () => {
            // Arrange
            component.text = 'e';

            // Act
            component.requestZoomIn();

            // Assert
            semanticZoomServiceMock.verify((x) => x.requestZoomIn('e'), Times.once());
        });
    });
});
