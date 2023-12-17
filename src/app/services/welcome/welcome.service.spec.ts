import { WelcomeService } from './welcome.service';

describe('WelcomeService', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const service: WelcomeService = new WelcomeService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should define isLoaded', () => {
            // Arrange, Act
            const service: WelcomeService = new WelcomeService();

            // Assert
            expect(service.isLoaded).toBeFalsy();
        });
    });
});
