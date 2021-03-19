import { AlbumService } from './album-service';

describe('AlbumService', () => {
    let service: AlbumService;

    beforeEach(() => {
        service = new AlbumService();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
