import { TracksColumnsVisibility } from './tracks-columns-visibility';

describe('TracksColumnsVisibility', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Assert
            expect(tracksColumnsVisibility).toBeDefined();
        });

        it('should set showRating', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showRating = true;

            // Assert
            expect(tracksColumnsVisibility.showRating).toBeTruthy();
        });

        it('should set showArtists', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showArtists = true;

            // Assert
            expect(tracksColumnsVisibility.showArtists).toBeTruthy();
        });

        it('should set showAlbum', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showAlbum = true;

            // Assert
            expect(tracksColumnsVisibility.showAlbum).toBeTruthy();
        });

        it('should set showGenres', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showGenres = true;

            // Assert
            expect(tracksColumnsVisibility.showGenres).toBeTruthy();
        });

        it('should set showDuration', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showDuration = true;

            // Assert
            expect(tracksColumnsVisibility.showDuration).toBeTruthy();
        });

        it('should set showtrackNumber', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showTrackNumber = true;

            // Assert
            expect(tracksColumnsVisibility.showTrackNumber).toBeTruthy();
        });

        it('should set showYear', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showYear = true;

            // Assert
            expect(tracksColumnsVisibility.showYear).toBeTruthy();
        });

        it('should set showPlayCount', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showPlayCount = true;

            // Assert
            expect(tracksColumnsVisibility.showPlayCount).toBeTruthy();
        });

        it('should set showSkipCount', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showSkipCount = true;

            // Assert
            expect(tracksColumnsVisibility.showSkipCount).toBeTruthy();
        });

        it('should set showDateLastPlayed', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showDateLastPlayed = true;

            // Assert
            expect(tracksColumnsVisibility.showDateLastPlayed).toBeTruthy();
        });

        it('should set showDateAdded', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            // Act
            tracksColumnsVisibility.showDateAdded = true;

            // Assert
            expect(tracksColumnsVisibility.showDateAdded).toBeTruthy();
        });
    });
});
