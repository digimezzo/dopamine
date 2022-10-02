import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
    let metadataServiceMock: IMock<BaseMetadataService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createComponent(): RatingComponent {
        return new RatingComponent(metadataServiceMock.object, dialogServiceMock.object, translatorServiceMock.object);
    }

    beforeEach(() => {
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        translatorServiceMock.setup((x) => x.getAsync('save-rating-error')).returns(async () => 'save-rating-error');
    });

    describe('constructor', () => {
        it('should initialize fontSize as 0', () => {
            // Arrange

            // Act
            const ratingComponent: RatingComponent = createComponent();

            // Assert
            expect(ratingComponent.fontSize).toEqual(0);
        });
    });

    describe('track', () => {
        it('should set and get track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();

            // Act
            ratingComponent.track = trackModel;

            // Assert
            expect(ratingComponent.track).toBe(trackModel);
        });
    });

    describe('setRatingAsync', () => {
        it('should set track rating to 0 when given 0', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(0);

            // Assert
            expect(track.rating).toEqual(0);
        });

        it('should set track rating to given rating when it is not equal to the given rating', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(4);

            // Assert
            expect(track.rating).toEqual(4);
        });

        it('should set track rating to 0 when it is equal to the given rating', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            expect(track.rating).toEqual(0);
        });

        it('should save the track rating', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackRating(trackModel), Times.once());
        });

        it('should show an error dialog when saving the track rating failed', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            metadataServiceMock.setup((x) => x.saveTrackRating(It.isAny())).throws(new Error('The error text'));

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.once());
        });

        it('should not show an error dialog when saving the track rating is successful', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.never());
        });
    });
});
