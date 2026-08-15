import { AudioEqualizer } from '../playback/audio-player/audio-equalizer';

export abstract class EqualizerServiceBase {
    public abstract readonly bands: readonly number[];
    public abstract readonly presetNames: readonly string[];
    public abstract isEnabled: boolean;
    public abstract selectedPreset: string;
    public abstract get gains(): number[];
    public abstract register(equalizer: AudioEqualizer): void;
    public abstract unregister(equalizer: AudioEqualizer): void;
    public abstract setGain(index: number, gainInDecibels: number): void;
    public abstract applyPreset(presetName: string): void;
    public abstract reset(): void;
}
