import { BaseEventListenerService } from './base-event-listener.service';
import { EventListenerService } from './event-listener.service';

describe('EventListenerService', () => {
    function createSut(): BaseEventListenerService {
        return new EventListenerService();
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const sut: BaseEventListenerService = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });
});
