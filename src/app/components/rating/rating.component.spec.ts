import { IMock, It, Mock, Times } from 'typemoq';
import { FontSize } from '../../common/application/font-size';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
    let metadataServiceMock: IMock<BaseMetadataService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;

    function createComponent(): RatingComponent {
        return new RatingComponent(
            metadataServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            appearanceServiceMock.object
        );
    }

    beforeEach(() => {
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        translatorServiceMock.setup((x) => x.getAsync('save-rating-error')).returns(async () => 'save-rating-error');
    });

    describe('constructor', () => {
        it('should initialize fontSize from the selected font size normal size', () => {
            // Arrange
            const fontSize: FontSize = new FontSize(13);
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => fontSize);

            // Act
            const ratingComponent: RatingComponent = createComponent();

            // Assert
            expect(ratingComponent.fontSize).toEqual(13);
        });

        it('should initialize lineHeight as 1', () => {
            // Arrange

            // Act
            const ratingComponent: RatingComponent = createComponent();

            // Assert
            expect(ratingComponent.lineHeight).toEqual(1);
        });
    });

    describe('track', () => {
        it('should set and get track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackRatingAsync(trackModel), Times.once());
        });

        it('should show an error dialog when saving the track rating failed', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            metadataServiceMock.setup((x) => x.saveTrackRatingAsync(It.isAny())).throws(new Error('The error text'));

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.once());
        });

        it('should not show an error dialog when saving the track rating is successful', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.rating = 3;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.never());
        });
    });
});
