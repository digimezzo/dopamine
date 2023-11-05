import { IMock, Mock } from 'typemoq';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { NativeElementProxy } from '../../common/native-element-proxy';
import { SliderComponent } from './slider.component';

describe('Slider', () => {
    let nativeElementProxyMock: IMock<NativeElementProxy>;
    let mathExtensionsMock: IMock<MathExtensions>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        nativeElementProxyMock = Mock.ofType<NativeElementProxy>();
        mathExtensionsMock = Mock.ofType<MathExtensions>();
        loggerMock = Mock.ofType<Logger>();
    });

    function createSlider(): SliderComponent {
        return new SliderComponent(nativeElementProxyMock.object, mathExtensionsMock.object, loggerMock.object);
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
