import { Injectable } from '@angular/core';
import { AudioVisualizerServiceBase } from './audio-visualizer.service.base';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class AudioVisualizerService implements AudioVisualizerServiceBase {
    private _selectedAudioVisualizerStyle: string;
    private _selectedAudioVisualizerFrameRate: number;

    public constructor(private settings: SettingsBase) {
        this._selectedAudioVisualizerStyle = this.getSelectedAudioVisualiserStyleFromSettings();
        this._selectedAudioVisualizerFrameRate = this.getSelectedAudioVisualiserFrameRateFromSettings();
    }

    public get showAudioVisualizer(): boolean {
        return this.settings.showAudioVisualizer;
    }

    public set showAudioVisualizer(v: boolean) {
        this.settings.showAudioVisualizer = v;
    }

    public audioVisualizerStyles: string[] = ['flames', 'stripes'];
    public audioVisualizerFrameRates: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    public get selectedAudioVisualizerStyle(): string {
        return this._selectedAudioVisualizerStyle;
    }

    public set selectedAudioVisualizerStyle(v: string) {
        this._selectedAudioVisualizerStyle = v;
        this.settings.audioVisualizerStyle = v;
    }

    public get selectedAudioVisualizerFrameRate(): number {
        return this._selectedAudioVisualizerFrameRate;
    }

    public set selectedAudioVisualizerFrameRate(v: number) {
        this._selectedAudioVisualizerFrameRate = v;
        this.settings.audioVisualizerFrameRate = v;
    }

    private getSelectedAudioVisualiserStyleFromSettings(): string {
        const possibleAudioVisualizerStyles: string[] = this.audioVisualizerStyles.filter(
            (x: string) => x === this.settings.audioVisualizerStyle,
        );

        if (possibleAudioVisualizerStyles.length > 0) {
            return possibleAudioVisualizerStyles[0];
        }

        return this.audioVisualizerStyles[0];
    }

    private getSelectedAudioVisualiserFrameRateFromSettings(): number {
        const possibleAudioVisualizerFrameRates: number[] = this.audioVisualizerFrameRates.filter(
            (x: number) => x === this.settings.audioVisualizerFrameRate,
        );

        if (possibleAudioVisualizerFrameRates.length > 0) {
            return possibleAudioVisualizerFrameRates[0];
        }

        return this.audioVisualizerFrameRates[0];
    }
}
