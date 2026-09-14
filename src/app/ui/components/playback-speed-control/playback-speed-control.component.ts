import { Component, ViewEncapsulation } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-playback-speed-control',
    host: { style: 'display: block' },
    templateUrl: './playback-speed-control.component.html',
    styleUrls: ['./playback-speed-control.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackSpeedControlComponent {
    public readonly minimumSpeed: number = 0.5;
    public readonly maximumSpeed: number = 3;
    public readonly speedStep: number = 0.05;
    public readonly speedPresets: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
    public readonly popupViewportMargin: number = 16;
    public readonly popupPositions: ConnectedPosition[] = [
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
    ];
    public isPopupOpen: boolean = false;

    public constructor(private playbackService: PlaybackService) {}

    public get speed(): number {
        return this.playbackService.playbackSpeed;
    }

    public set speed(value: number) {
        this.playbackService.playbackSpeed = value;
    }

    public get sliderValue(): number {
        return this.speed - this.minimumSpeed;
    }

    public set sliderValue(value: number) {
        this.speed = value + this.minimumSpeed;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public decreaseSpeed(): void {
        this.speed -= this.speedStep;
    }

    public increaseSpeed(): void {
        this.speed += this.speedStep;
    }

    public togglePopup(): void {
        this.isPopupOpen = !this.isPopupOpen;
    }

    public closePopup(): void {
        this.isPopupOpen = false;
    }

    public formatSpeed(speed: number): string {
        return speed.toFixed(2).replace(/\.0+$/, '').replace(/(\.\d)0$/, '$1');
    }
}
