import { AudioVisualizerService } from './audio-visualizer.service';
import { IMock, Mock } from 'typemoq';
import { SettingsBase } from '../../common/settings/settings.base';
import { AudioVisualizerServiceBase } from './audio-visualizer.service.base';

describe('AudioVisualizerService', () => {
    let settingsMock: IMock<SettingsBase>;
    const settingsStub: any = { showAudioVisualizer: true, audioVisualizerStyle: 'flames', audioVisualizerFrameRate: 10 };

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
    });

    function createSut(): AudioVisualizerServiceBase {
        return new AudioVisualizerService(settingsMock.object);
    }

    function createSutWithSettingsStub(): AudioVisualizerServiceBase {
        return new AudioVisualizerService(settingsStub);
    }

    describe('showAudioVisualizer', () => {
        it('should return showAudioVisualizer from settings', () => {
            // Arrange
            settingsMock.setup((x) => x.showAudioVisualizer).returns(() => true);
            const sut: AudioVisualizerServiceBase = createSut();

            // Act, Assert
            expect(sut.showAudioVisualizer).toBeTruthy();
        });

        it('should save showAudioVisualizer in settings', () => {
            // Arrange
            settingsStub.showAudioVisualizer = true;
            const sut: AudioVisualizerServiceBase = createSutWithSettingsStub();

            // Act
            sut.showAudioVisualizer = false;

            // Assert
            expect(settingsStub.showAudioVisualizer).toBeFalsy();
        });
    });

    describe('audioVisualizerStyles', () => {
        it('should return the audio visualizer styles', () => {
            // Arrange
            const sut: AudioVisualizerServiceBase = createSut();

            // Act, Assert
            expect(sut.audioVisualizerStyles.length).toEqual(2);
            expect(sut.audioVisualizerStyles[0]).toEqual('flames');
            expect(sut.audioVisualizerStyles[1]).toEqual('stripes');
        });
    });

    describe('audioVisualizerFrameRates', () => {
        it('should return the audio visualizer frame rates', () => {
            // Arrange
            const sut: AudioVisualizerServiceBase = createSut();

            // Act, Assert
            expect(sut.audioVisualizerFrameRates.length).toEqual(12);
            expect(sut.audioVisualizerFrameRates[0]).toEqual(5);
            expect(sut.audioVisualizerFrameRates[1]).toEqual(10);
            expect(sut.audioVisualizerFrameRates[2]).toEqual(15);
            expect(sut.audioVisualizerFrameRates[3]).toEqual(20);
            expect(sut.audioVisualizerFrameRates[4]).toEqual(25);
            expect(sut.audioVisualizerFrameRates[5]).toEqual(30);
            expect(sut.audioVisualizerFrameRates[6]).toEqual(35);
            expect(sut.audioVisualizerFrameRates[7]).toEqual(40);
            expect(sut.audioVisualizerFrameRates[8]).toEqual(45);
            expect(sut.audioVisualizerFrameRates[9]).toEqual(50);
            expect(sut.audioVisualizerFrameRates[10]).toEqual(55);
            expect(sut.audioVisualizerFrameRates[11]).toEqual(60);
        });
    });

    describe('selectedAudioVisualizerStyle', () => {
        it('should save the selected audio visualizer style in the settings', () => {
            // Arrange
            settingsStub.audioVisualizerStyle = 'flames';
            const sut: AudioVisualizerServiceBase = createSutWithSettingsStub();

            // Act
            sut.selectedAudioVisualizerStyle = 'stripes';

            // Assert
            expect(settingsStub.audioVisualizerStyle).toEqual('stripes');
        });
    });

    describe('selectedAudioVisualizerFrameRate', () => {
        it('should save the selected audio visualizer frame rate in the settings', () => {
            // Arrange
            settingsStub.audioVisualizerFrameRate = 10;
            const sut: AudioVisualizerServiceBase = createSutWithSettingsStub();

            // Act
            sut.selectedAudioVisualizerFrameRate = 45;

            // Assert
            expect(settingsStub.audioVisualizerFrameRate).toEqual(45);
        });
    });
});
