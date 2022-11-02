import { Subscription } from 'rxjs';
import { BaseTracksColumnsService } from './base-tracks-columns.service';
import { TracksColumnsVisibility } from './tracks-columns-visibility';
import { TracksColumnsService } from './tracks-columns.service';

describe('TracksColumnsService', () => {
    let settingsStub: any;
    let service: BaseTracksColumnsService;

    let subscription: Subscription;

    function createService(): BaseTracksColumnsService {
        return new TracksColumnsService(settingsStub);
    }

    beforeEach(() => {
        settingsStub = { tracksPageVisibleColumns: '' };

        subscription = new Subscription();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            service = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should define playingNextTrack$', () => {
            // Arrange

            // Act
            service = createService();

            // Assert
            expect(service.tracksColumnsVisibilityChanged$).toBeDefined();
        });
    });

    describe('getTracksColumnsVisibility', () => {
        it('should get tracks columns visibility from settings', () => {
            // Arrange
            service = createService();
            settingsStub.tracksPageVisibleColumns = 'rating;artists;duration;trackNumber';

            // Act
            const tracksColumnsVisibility: TracksColumnsVisibility = service.getTracksColumnsVisibility();

            // Assert
            expect(tracksColumnsVisibility).toBeDefined();
            expect(tracksColumnsVisibility.showRating).toBeTruthy();
            expect(tracksColumnsVisibility.showArtists).toBeTruthy();
            expect(tracksColumnsVisibility.showAlbum).toBeFalsy();
            expect(tracksColumnsVisibility.showGenres).toBeFalsy();
            expect(tracksColumnsVisibility.showDuration).toBeTruthy();
            expect(tracksColumnsVisibility.showTrackNumber).toBeTruthy();
            expect(tracksColumnsVisibility.showYear).toBeFalsy();
            expect(tracksColumnsVisibility.showPlayCount).toBeFalsy();
            expect(tracksColumnsVisibility.showSkipCount).toBeFalsy();
            expect(tracksColumnsVisibility.showDateLastPlayed).toBeFalsy();
            expect(tracksColumnsVisibility.showDateAdded).toBeFalsy();
        });
    });

    describe('setTracksColumnsVisibility', () => {
        it('should save tracks columns visibility to settings', () => {
            // Arrange
            service = createService();
            settingsStub.tracksPageVisibleColumns = 'rating;artists;duration;trackNumber';
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();
            tracksColumnsVisibility.showRating = true;
            tracksColumnsVisibility.showArtists = true;
            tracksColumnsVisibility.showAlbum = false;
            tracksColumnsVisibility.showGenres = true;
            tracksColumnsVisibility.showDuration = true;
            tracksColumnsVisibility.showTrackNumber = true;
            tracksColumnsVisibility.showYear = true;
            tracksColumnsVisibility.showPlayCount = false;
            tracksColumnsVisibility.showSkipCount = true;
            tracksColumnsVisibility.showDateLastPlayed = true;
            tracksColumnsVisibility.showDateAdded = true;

            // Act
            service.setTracksColumnsVisibility(tracksColumnsVisibility);

            // Assert
            expect(settingsStub.tracksPageVisibleColumns).toEqual(
                'rating;artists;genres;duration;trackNumber;year;skipCount;dateLastPlayed;dateAdded'
            );
        });

        it('should indicate that tracks columns visibility has changed', () => {
            // Arrange
            service = createService();
            const newTracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            let receivedTracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();

            subscription.add(
                service.tracksColumnsVisibilityChanged$.subscribe((tracksColumnsVisibility: TracksColumnsVisibility) => {
                    receivedTracksColumnsVisibility = tracksColumnsVisibility;
                })
            );

            // Act
            service.setTracksColumnsVisibility(newTracksColumnsVisibility);

            // Assert
            expect(receivedTracksColumnsVisibility).toBe(newTracksColumnsVisibility);
        });
    });

    describe('getTracksColumnsOrder', () => {
        test.todo('should write tests');
    });

    describe('setTracksColumnsOrder', () => {
        test.todo('should write tests');
    });
});
