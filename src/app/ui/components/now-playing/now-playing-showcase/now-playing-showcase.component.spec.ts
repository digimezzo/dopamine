import { IMock, Mock } from 'typemoq';
import { NowPlayingShowcaseComponent } from './now-playing-showcase.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { ApplicationBase } from '../../../../common/io/application.base';
import { WindowSize } from '../../../../common/io/window-size';

describe('NowPlayingShowcaseComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let applicationMock: IMock<ApplicationBase>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): NowPlayingShowcaseComponent {
        return new NowPlayingShowcaseComponent(settingsMock.object, applicationMock.object);
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        applicationMock = Mock.ofType<ApplicationBase>();

        applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(1000, 600));
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: NowPlayingShowcaseComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize coverArtSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingShowcaseComponent = createComponent();

            // Assert
            expect(component.coverArtSize).toEqual(0);
        });

        it('should initialize playbackInformationHeight as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingShowcaseComponent = createComponent();

            // Assert
            expect(component.playbackInformationHeight).toEqual(0);
        });

        it('should initialize playbackInformationLargeFontSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingShowcaseComponent = createComponent();

            // Assert
            expect(component.playbackInformationLargeFontSize).toEqual(0);
        });

        it('should initialize playbackInformationSmallFontSize as 0', () => {
            // Arrange

            // Act
            const component: NowPlayingShowcaseComponent = createComponent();

            // Assert
            expect(component.playbackInformationSmallFontSize).toEqual(0);
        });
    });

    describe('onResize', () => {
        it('should set the now playing sizes in relation to window height', () => {
            // Arrange
            const component: NowPlayingShowcaseComponent = createComponent();

            // Act
            component.onResize();

            // Assert
            expect(component.coverArtSize).toEqual(220);
            expect(component.playbackInformationHeight).toEqual(220);
            expect(component.playbackInformationLargeFontSize).toEqual(27.5);
            expect(component.playbackInformationSmallFontSize).toEqual(18.333333333333332);
        });

        it('should set the now playing sizes in relation to window width if width is too small', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(550, 600));
            const component: NowPlayingShowcaseComponent = createComponent();

            // Act
            component.onResize();

            // Assert
            expect(component.coverArtSize).toEqual(155.56349186104046);
            expect(component.playbackInformationHeight).toEqual(155.56349186104046);
            expect(component.playbackInformationLargeFontSize).toEqual(19.445436482630058);
            expect(component.playbackInformationSmallFontSize).toEqual(12.963624321753372);
        });
    });

    describe('ngOnInit', () => {
        it('should set the now playing sizes', () => {
            // Arrange
            const event: any = {};
            const component: NowPlayingShowcaseComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(220);
            expect(component.playbackInformationHeight).toEqual(220);
            expect(component.playbackInformationLargeFontSize).toEqual(27.5);
            expect(component.playbackInformationSmallFontSize).toEqual(18.333333333333332);
        });

        it('should set the now playing sizes in relation to window width if width is too small', () => {
            // Arrange
            applicationMock.reset();
            applicationMock.setup((x) => x.getWindowSize()).returns(() => new WindowSize(550, 600));
            const component: NowPlayingShowcaseComponent = createComponent();
            const event: any = {};

            // Act
            component.ngOnInit();

            // Assert
            expect(component.coverArtSize).toEqual(155.56349186104046);
            expect(component.playbackInformationHeight).toEqual(155.56349186104046);
            expect(component.playbackInformationLargeFontSize).toEqual(19.445436482630058);
            expect(component.playbackInformationSmallFontSize).toEqual(12.963624321753372);
        });
    });
});
