import { Subscription } from 'rxjs';
import { SemanticZoomService } from './semantic-zoom.service';

describe('SemanticZoomService', () => {
    let service: SemanticZoomService;

    beforeEach(() => {
        service = new SemanticZoomService();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define zoomOutRequested$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.zoomOutRequested$).toBeDefined();
        });

        it('should define zoomInRequested$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.zoomInRequested$).toBeDefined();
        });
    });

    describe('requestZoomOut', () => {
        it('should request zoom out', () => {
            // Arrange
            let zoomOutRequested: boolean = false;
            const subscription: Subscription = service.zoomOutRequested$.subscribe(() => {
                zoomOutRequested = true;
            });

            // Act
            service.requestZoomOut();

            // Assert
            expect(zoomOutRequested).toBeTruthy();
        });
    });

    describe('requestZoomIn', () => {
        it('should request zoom in', () => {
            // Arrange
            let receivedText: string = '';
            const subscription: Subscription = service.zoomInRequested$.subscribe((text: string) => {
                receivedText = text;
            });

            // Act
            service.requestZoomIn('l');

            // Assert
            expect(receivedText).toEqual('l');
        });
    });
});
