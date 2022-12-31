import { IMock, It, Mock, Times } from 'typemoq';
import { FontSize } from '../../common/application/font-size';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BaseScrobblingService } from '../../services/scrobbling/base-scrobbling.service';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { LoveComponent } from './love.component';

describe('LoveComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let scrobblingServiceMock: IMock<BaseScrobblingService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createComponent(): LoveComponent {
        return new LoveComponent(
            appearanceServiceMock.object,
            scrobblingServiceMock.object,
            metadataServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object
        );
    }

    beforeEach(() => {
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        scrobblingServiceMock = Mock.ofType<BaseScrobblingService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();

        translatorServiceMock.setup((x) => x.getAsync('save-love-error')).returns(async () => 'save-love-error');
    });

    describe('constructor', () => {
        it('should initialize fontSize from the selected font size normal size', () => {
            // Arrange
            const fontSize: FontSize = new FontSize(13);
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => fontSize);

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.fontSize).toEqual(13);
        });

        it('should initialize largerFontSize from the selected font size normal size plus 4px', () => {
            // Arrange
            const fontSize: FontSize = new FontSize(13);
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => fontSize);

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.largerFontSize).toEqual(17);
        });

        it('should initialize lineHeight as 1', () => {
            // Arrange

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.lineHeight).toEqual(1);
        });
    });

    describe('track', () => {
        it('should set and get track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();

            // Act
            loveComponent.track = trackModel;

            // Assert
            expect(loveComponent.track).toBe(trackModel);
        });
    });

    describe('toggleLoveAsync', () => {
        it('should set track love to 1 when track love is 0', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 0;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            expect(track.love).toEqual(1);
        });

        it('should set track love to -1 when track love is 1', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 1;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            expect(track.love).toEqual(-1);
        });

        it('should set track love to 0 when track love is -1', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = -1;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            expect(track.love).toEqual(0);
        });

        it('should set track love to 0 when track love is any unsupported value', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 6;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            expect(track.love).toEqual(0);
        });

        it('should scrobble track love', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 0;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            scrobblingServiceMock.verify((x) => x.sendTrackLoveAsync(trackModel, true), Times.once());
        });

        it('should save track love', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 0;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackLoveAsync(trackModel), Times.once());
        });

        it('should show an error message if saving track love fails', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 0;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            metadataServiceMock.setup((x) => x.saveTrackLoveAsync(It.isAny())).throws(new Error('The error text'));
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackLoveAsync(trackModel), Times.once());
            dialogServiceMock.verify((x) => x.showErrorDialog('save-love-error'), Times.once());
        });

        it('should not show an error dialog when saving track love is successful', async () => {
            // Arrange
            const track: Track = new Track('Path');
            track.love = 0;
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.never());
        });
    });
});
