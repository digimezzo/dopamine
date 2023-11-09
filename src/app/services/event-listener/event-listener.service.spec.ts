import { EventListenerService } from './event-listener.service';
import { EventListenerServiceBase } from './event-listener.service.base';

describe('EventListenerService', () => {
    function createSut(): EventListenerServiceBase {
        return new EventListenerService();
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const sut: EventListenerServiceBase = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });
});
