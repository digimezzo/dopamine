import { SimilarArtistComponent } from './similar-artist.component';

describe('NowPlayingArtistInfoComponent', () => {
    function createComponent(): SimilarArtistComponent {
        return new SimilarArtistComponent();
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: SimilarArtistComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should ensure empty similarArtist', () => {
            // Arrange

            // Act
            const component: SimilarArtistComponent = createComponent();

            // Assert
            expect(component.similarArtist).toBeDefined();
            expect(component.similarArtist.name).toEqual('');
            expect(component.similarArtist.url).toEqual('');
            expect(component.similarArtist.imageUrl).toEqual('');
            expect(component.similarArtist.biography).toEqual('');
        });
    });
});
