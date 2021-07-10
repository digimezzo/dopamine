import { GenreComponent } from './genre.component';

describe('GenreComponent', () => {
    let component: GenreComponent;

    beforeEach(() => {
        component = new GenreComponent();
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
    });
});
