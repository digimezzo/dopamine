import { MatLegacySliderChange as MatSliderChange } from '@angular/material/legacy-slider';
import { IMock, Mock, Times } from 'typemoq';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { VolumeControlComponent } from './volume-control.component';

describe('VolumeControlComponent', () => {
    let component: VolumeControlComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        component = new VolumeControlComponent(playbackServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });
    });

    describe('onInputChange', () => {
        it('should update the playbackService volume', () => {
            // Arrange
            const sliderChange = new MatSliderChange();
            sliderChange.value = 0.8;

            // Act
            component.onInputChange(sliderChange);

            // Assert
            playbackServiceMock.verify((x) => (x.volume = 0.8), Times.exactly(1));
        });
    });
    describe('onMouseWheel', () => {
        it('should increase the playbackService volume by 0.05 when scrolling up', () => {
            // Arrange
            const event: any = { deltaY: -50 };
            const playbackServiceStub: any = { volume: 0.5 };
            component = new VolumeControlComponent(playbackServiceStub);

            // Act
            component.onMouseWheel(event);

            // Assert
            expect(playbackServiceStub.volume).toEqual(0.55);
        });

        it('should decrease the playbackService volume by 0.05 when scrolling down', () => {
            // Arrange
            const event: any = { deltaY: 50 };
            const playbackServiceStub: any = { volume: 0.5 };
            component = new VolumeControlComponent(playbackServiceStub);

            // Act
            component.onMouseWheel(event);

            // Assert
            expect(playbackServiceStub.volume).toEqual(0.45);
        });
    });
});
