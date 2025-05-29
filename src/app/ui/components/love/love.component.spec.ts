import { IMock, It, Mock, Times } from 'typemoq';
import { LoveComponent } from './love.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { ScrobblingServiceBase } from '../../../services/scrobbling/scrobbling.service.base';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { DateTime } from '../../../common/date-time';
import { Track } from '../../../data/entities/track';
import { TrackModel } from '../../../services/track/track-model';
import { SettingsMock } from '../../../testing/settings-mock';
import { MetadataService } from '../../../services/metadata/metadata.service';

describe('LoveComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let scrobblingServiceMock: IMock<ScrobblingServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    function createComponent(): LoveComponent {
        return new LoveComponent(
            appearanceServiceMock.object,
            scrobblingServiceMock.object,
            metadataServiceMock.object,
            dialogServiceMock.object,
            translatorServiceMock.object,
        );
    }

    beforeEach(() => {
        metadataServiceMock = Mock.ofType<MetadataService>();
        scrobblingServiceMock = Mock.ofType<ScrobblingServiceBase>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        settingsMock = new SettingsMock();

        translatorServiceMock.setup((x) => x.getAsync('save-love-error')).returns(() => Promise.resolve('save-love-error'));
    });

    function createTrackModelWithLove(love: number): TrackModel {
        const track: Track = new Track('Path');
        track.love = love;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    describe('constructor', () => {
        it('should initialize fontSize from the selected font size', () => {
            // Arrange
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => 13);

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.fontSize).toEqual(13);
        });

        it('should initialize fontSize from the selected font', () => {
            // Arrange
            appearanceServiceMock.setup((x) => x.selectedFontSize).returns(() => 13);

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.fontSize).toEqual(13);
        });

        it('should initialize lineHeight as 1', () => {
            // Arrange

            // Act
            const loveComponent: LoveComponent = createComponent();

            // Assert
            expect(loveComponent.lineHeight).toEqual(1);
        });
    });

    describe('loveClasses', () => {
        it('should be "fas fa-heart accent-color-important" if love is 1', () => {
            // Arrange
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = createTrackModelWithLove(1);

            // Act
            const loveClasses: string = loveComponent.loveClasses;

            // Assert
            expect(loveClasses).toEqual('fas fa-heart accent-color-important');
        });

        it('should be "fas fa-heart accent-color-important" if love is -1', () => {
            // Arrange
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = createTrackModelWithLove(-1);

            // Act
            const loveClasses: string = loveComponent.loveClasses;

            // Assert
            expect(loveClasses).toEqual('fas fa-heart-crack accent-color-important');
        });

        it('should be "fas fa-heart accent-color-important" if love is 0', () => {
            // Arrange
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = createTrackModelWithLove(0);

            // Act
            const loveClasses: string = loveComponent.loveClasses;

            // Assert
            expect(loveClasses).toEqual('far fa-heart secondary-text');
        });
    });

    describe('track', () => {
        it('should set and get track', () => {
            // Arrange
            const track: Track = new Track('Path');
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            expect(track.love).toEqual(0);
        });

        it('should scrobble track love', async () => {
            // Arrange
            const trackModel: TrackModel = createTrackModelWithLove(0);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            scrobblingServiceMock.verify((x) => x.sendTrackLoveAsync(trackModel, true), Times.once());
        });

        it('should save track love', async () => {
            // Arrange
            const trackModel: TrackModel = createTrackModelWithLove(0);
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackLove(trackModel), Times.once());
        });

        it('should show an error message if saving track love fails', async () => {
            // Arrange
            const trackModel: TrackModel = createTrackModelWithLove(0);
            metadataServiceMock.setup((x) => x.saveTrackLove(It.isAny())).throws(new Error('The error text'));
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = trackModel;

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            metadataServiceMock.verify((x) => x.saveTrackLove(trackModel), Times.once());
            dialogServiceMock.verify((x) => x.showErrorDialog('save-love-error'), Times.once());
        });

        it('should not show an error dialog when saving track love is successful', async () => {
            // Arrange
            const loveComponent: LoveComponent = createComponent();
            loveComponent.track = createTrackModelWithLove(0);

            // Act
            await loveComponent.toggleLoveAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('save-rating-error'), Times.never());
        });
    });
});
