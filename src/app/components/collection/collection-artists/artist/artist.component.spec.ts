import { ArtistComponent } from './artist.component';

describe('GenreComponent', () => {
    let component: ArtistComponent;

    beforeEach(() => {
        component = new ArtistComponent();
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
    });
});
