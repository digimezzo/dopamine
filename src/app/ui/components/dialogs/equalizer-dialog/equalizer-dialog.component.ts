import { Component } from '@angular/core';
import { EqualizerServiceBase } from '../../../../services/equalizer/equalizer.service.base';
import { EqualizerService } from '../../../../services/equalizer/equalizer.service';

@Component({
    selector: 'app-equalizer-dialog',
    templateUrl: './equalizer-dialog.component.html',
    styleUrls: ['./equalizer-dialog.component.scss'],
})
export class EqualizerDialogComponent {
    public readonly minimumGain: number = EqualizerService.minimumGain;
    public readonly maximumGain: number = EqualizerService.maximumGain;

    public constructor(public equalizerService: EqualizerServiceBase) {}

    public get isEnabled(): boolean {
        return this.equalizerService.isEnabled;
    }

    public set isEnabled(value: boolean) {
        this.equalizerService.isEnabled = value;
    }

    public get bands(): readonly number[] {
        return this.equalizerService.bands;
    }

    public get gains(): number[] {
        return this.equalizerService.gains;
    }

    public get presetNames(): readonly string[] {
        return this.equalizerService.presetNames;
    }

    public get selectedPreset(): string {
        return this.equalizerService.selectedPreset;
    }

    public set selectedPreset(value: string) {
        this.equalizerService.selectedPreset = value;
    }

    public onGainChanged(index: number, event: Event): void {
        const value: number = parseFloat((event.target as HTMLInputElement).value);
        this.equalizerService.setGain(index, value);
    }

    public reset(): void {
        this.equalizerService.reset();
    }

    public formatFrequency(frequency: number): string {
        return frequency >= 1000 ? `${frequency / 1000}k` : `${frequency}`;
    }

    public formatGain(gain: number): string {
        return gain > 0 ? `+${gain}` : `${gain}`;
    }
}
