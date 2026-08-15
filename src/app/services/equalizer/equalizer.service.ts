import { Injectable } from '@angular/core';
import { EqualizerServiceBase } from './equalizer.service.base';
import { EqualizerPresets } from './equalizer-presets';
import { AudioEqualizer } from '../playback/audio-player/audio-equalizer';
import { SettingsBase } from '../../common/settings/settings.base';
import { Logger } from '../../common/logger';

@Injectable()
export class EqualizerService implements EqualizerServiceBase {
    public static readonly minimumGain: number = -12;
    public static readonly maximumGain: number = 12;

    private readonly _registeredEqualizers: Set<AudioEqualizer> = new Set<AudioEqualizer>();
    private _gains: number[] = new Array<number>(AudioEqualizer.frequencies.length).fill(0);
    private _isEnabled: boolean = false;
    private _selectedPreset: string = 'flat';
    private _isInitialized: boolean = false;

    public constructor(
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public readonly bands: readonly number[] = AudioEqualizer.frequencies;

    public readonly presetNames: readonly string[] = Object.keys(EqualizerPresets.presets).concat(EqualizerPresets.manual);

    public get isEnabled(): boolean {
        this.ensureInitialized();
        return this._isEnabled;
    }

    public set isEnabled(value: boolean) {
        this.ensureInitialized();
        this._isEnabled = value;
        this.settings.audioEqualizerEnabled = value;
        this.applyToRegisteredEqualizers();
    }

    public get selectedPreset(): string {
        this.ensureInitialized();
        return this._selectedPreset;
    }

    public set selectedPreset(value: string) {
        this.applyPreset(value);
    }

    public get gains(): number[] {
        this.ensureInitialized();
        return [...this._gains];
    }

    public register(equalizer: AudioEqualizer): void {
        this.ensureInitialized();
        this._registeredEqualizers.add(equalizer);
        equalizer.setGains(this.effectiveGains());
    }

    public unregister(equalizer: AudioEqualizer): void {
        this._registeredEqualizers.delete(equalizer);
    }

    public setGain(index: number, gainInDecibels: number): void {
        this.ensureInitialized();

        if (index < 0 || index >= this._gains.length) {
            return;
        }

        const clampedGain: number = Math.max(EqualizerService.minimumGain, Math.min(EqualizerService.maximumGain, gainInDecibels));
        this._gains[index] = clampedGain;
        this._selectedPreset = EqualizerPresets.manual;

        this.persistGains();
        this.settings.audioEqualizerPreset = this._selectedPreset;
        this.applyToRegisteredEqualizers();
    }

    public applyPreset(presetName: string): void {
        this.ensureInitialized();

        const presetGains: number[] | undefined = EqualizerPresets.presets[presetName];

        if (presetGains === undefined) {
            return;
        }

        this._gains = [...presetGains];
        this._selectedPreset = presetName;

        this.persistGains();
        this.settings.audioEqualizerPreset = this._selectedPreset;
        this.applyToRegisteredEqualizers();
    }

    public reset(): void {
        this.applyPreset('flat');
    }

    private ensureInitialized(): void {
        if (this._isInitialized) {
            return;
        }

        this._isInitialized = true;

        try {
            this._isEnabled = this.settings.audioEqualizerEnabled;
            this._selectedPreset = this.settings.audioEqualizerPreset;
            this._gains = this.parseGains(this.settings.audioEqualizerGains);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not load equalizer settings', 'EqualizerService', 'ensureInitialized');
            this._isEnabled = false;
            this._selectedPreset = 'flat';
            this._gains = new Array<number>(AudioEqualizer.frequencies.length).fill(0);
        }
    }

    private parseGains(value: string): number[] {
        const gains: number[] = new Array<number>(AudioEqualizer.frequencies.length).fill(0);

        if (!value) {
            return gains;
        }

        const parts: string[] = value.split(';');

        for (let i = 0; i < gains.length && i < parts.length; i++) {
            const parsed: number = parseFloat(parts[i]);
            gains[i] = isNaN(parsed) ? 0 : parsed;
        }

        return gains;
    }

    private persistGains(): void {
        this.settings.audioEqualizerGains = this._gains.join(';');
    }

    private effectiveGains(): number[] {
        return this._isEnabled ? this._gains : new Array<number>(this._gains.length).fill(0);
    }

    private applyToRegisteredEqualizers(): void {
        const gains: number[] = this.effectiveGains();

        for (const equalizer of this._registeredEqualizers) {
            equalizer.setGains(gains);
        }
    }
}
