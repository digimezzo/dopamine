import { IMock, Mock } from 'typemoq';
import { SliderComponent } from './slider.component';
import { NativeElementProxy } from '../../../common/native-element-proxy';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { SettingsBase } from '../../../common/settings/settings.base';

describe('Slider', () => {
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let mathExtensionsMock: IMock<MathExtensions>;
    let loggerMock: IMock<Logger>;
    let settingsMock: IMock<SettingsBase>;

    beforeEach(() => {
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        mathExtensionsMock = Mock.ofType<MathExtensions>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = Mock.ofType<SettingsBase>();
    });

    function createSlider(): SliderComponent {
        return new SliderComponent(nativeElementProxyMock.object, mathExtensionsMock.object, loggerMock.object, settingsMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const slider: SliderComponent = createSlider();

            // Assert
            expect(slider).toBeDefined();
        });
    });

    test.todo('should write tests');
});
