import { IMock, It, Mock, Times } from 'typemoq';
import { RatingComponent } from './rating.component';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { DateTime } from '../../../common/date-time';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { TrackModel } from '../../../services/track/track-model';
import { Track } from '../../../data/entities/track';
import { SettingsMock } from '../../../testing/settings-mock';
import { MetadataService } from '../../../services/metadata/metadata.service';

describe('RatingComponent', () => {
    let metadataServiceMock: IMock<MetadataService>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let settingsMock: any;

    function createComponent(): RatingComponent {
        return new RatingComponent(
            metadataServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
            appearanceServiceMock.object,
        );
    }

    function createTrackModelWithRating(rating: number): TrackModel {
        const track: Track = new Track('Path');
        track.rating = rating;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    beforeEach(() => {
        metadataServiceMock = Mock.ofType<MetadataService>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        settingsMock = new SettingsMock();

        translatorServiceMock.setup((x) => x.getAsync('save-rating-error')).returns(() => Promise.resolve('save-rating-error'));
    });

    describe('constructor', () => {
        it('should initialize fontSize from the selected font size', () => {
            // Arrange
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => 13);

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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            expect(track.rating).toEqual(0);
        });

        it('should save the track rating', async () => {
            // Arrange
            const ratingComponent: RatingComponent = createComponent();
            const trackModel: TrackModel = createTrackModelWithRating(3);
            ratingComponent.track = trackModel;

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackRatingAsync(trackModel), Times.once());
        });

        it('should show an error dialog when saving the track rating failed', async () => {
            // Arrange
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = createTrackModelWithRating(3);

            metadataServiceMock.setup((x) => x.saveTrackRatingAsync(It.isAny())).throws(new Error('The error text'));

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.once());
        });

        it('should not show an error dialog when saving the track rating is successful', async () => {
            // Arrange
            const ratingComponent: RatingComponent = createComponent();
            ratingComponent.track = createTrackModelWithRating(3);

            // Act
            await ratingComponent.setRatingAsync(3);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.never());
        });
    });

    describe('getStarClass', () => {
        let ratingComponent: RatingComponent;

        beforeEach(() => {
            ratingComponent = createComponent();
        });

        it('should return empty star when track is undefined', () => {
            // Arrange, Act
            const cls = ratingComponent.getStarClass(1);

            // Assert
            expect(cls).toEqual('far fa-star secondary-text');
        });

        describe('full stars', () => {
            it('star 1 should be full when rating >= 2', () => {
                ratingComponent.track = createTrackModelWithRating(2);

                expect(ratingComponent.getStarClass(1)).toEqual('fas fa-star accent-color-important');
            });

            it('star 3 should be full when rating >= 6', () => {
                ratingComponent.track = createTrackModelWithRating(6);

                expect(ratingComponent.getStarClass(3)).toEqual('fas fa-star accent-color-important');
            });
        });

        describe('half stars', () => {
            it('star 1 should be half when rating = 1', () => {
                ratingComponent.track = createTrackModelWithRating(1);

                expect(ratingComponent.getStarClass(1)).toEqual('fas fa-star-half-alt accent-color-important');
            });

            it('star 4 should be half when rating = 7 (half of star 4)', () => {
                ratingComponent.track = createTrackModelWithRating(7);

                expect(ratingComponent.getStarClass(4)).toEqual('fas fa-star-half-alt accent-color-important');
            });
        });

        describe('empty stars', () => {
            it('star 1 should be empty when rating = 0', () => {
                ratingComponent.track = createTrackModelWithRating(0);

                expect(ratingComponent.getStarClass(1)).toEqual('far fa-star secondary-text');
            });

            it('star 5 should be empty when rating = 8', () => {
                ratingComponent.track = createTrackModelWithRating(8);

                expect(ratingComponent.getStarClass(5)).toEqual('far fa-star secondary-text');
            });
        });
    });
});
