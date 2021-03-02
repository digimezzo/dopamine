import { Observable } from 'rxjs';

export abstract class BaseAudioPlayer {
    public playbackFinished$: Observable<void>;
    public abstract progressSeconds: number;
    public abstract totalSeconds: number;
    public abstract play(audioFilePath: string): void;
    public abstract stop(): void;
    public abstract pause(): void;
    public abstract resume(): void;
    public abstract setVolume(volume: number): void;
    public abstract mute(): void;
    public abstract unMute(): void;
    public abstract skipToSeconds(seconds: number): void;
}
